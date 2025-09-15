import 'dart:io';
import 'package:app_nckh/searchSign.dart';
import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:video_player/video_player.dart';
import 'ollama_service.dart';

class ChatScreen extends StatefulWidget {
  final String token;
  const ChatScreen({super.key, required this.token});

  @override
  State<ChatScreen> createState() => _ChatScreenState();
}

class _ChatScreenState extends State<ChatScreen> {
  final TextEditingController _controller = TextEditingController();
  final List<Map<String, dynamic>> _messages = [];
  final ImagePicker _picker = ImagePicker();
  final _ollama = OllamaService();
   final ScrollController _scrollController = ScrollController();

     @override
  void dispose() {
    _scrollController.dispose();
    _controller.dispose();
    super.dispose();
  }

  void _scrollToBottom() {
  // Chờ 100ms để ListView build xong rồi mới scroll
  WidgetsBinding.instance.addPostFrameCallback((_) {
    if (_scrollController.hasClients) {
      _scrollController.animateTo(
        _scrollController.position.maxScrollExtent,
        duration: const Duration(milliseconds: 300),
        curve: Curves.easeOut,
      );
    }
  });
}

  Future<void> _sendTextMessage() async {
  if (_controller.text.isEmpty) return;

  final inputText = _controller.text.trim();
  final groupId = DateTime.now().millisecondsSinceEpoch.toString(); // unique

  setState(() {
    _messages.add({
      "type": "text",
      "data": inputText,
      "isMe": true,
      "group": groupId
    });
  });
  _scrollToBottom();
  _controller.clear();

  try {
    final response = await http.post(
      Uri.parse("http://localhost:8080/api/v1/translate?text=$inputText"),
      headers: {
        "Authorization": "Bearer ${widget.token}",
        "accept": "application/json",
      },
    );

    if (response.statusCode == 200) {
      final body = jsonDecode(response.body);
      final videoUrl = body["data"];

      setState(() {
        _messages.add({
          "type": "video",
          "data": videoUrl ?? "",
          "isMe": true, // ✅ vẫn bên phải vì cùng group với text
          "group": groupId
        });
      });

    } else {
      setState(() {
        _messages.add({
          "type": "text",
          "data": "Không tồn tại ngôn ngữ ký hiệu cho từ này.",
          "isMe": true,
          "group": groupId
        });
      });
    }
    _scrollToBottom();
  } catch (e) {
    debugPrint("Lỗi kết nối API: $e");
  }
}

  void _sendEmoji(String emoji) {
    setState(() {
      _messages.add({"type": "emoji", "data": emoji, "isMe": true});
    });
  }


  Future<void> _pickVideo() async {
  final XFile? pickedFile = await _picker.pickVideo(source: ImageSource.gallery);

  if (pickedFile != null) {
    final groupId = DateTime.now().millisecondsSinceEpoch.toString();

    setState(() {
      _messages.add({
        "type": "video",
        "data": pickedFile.path,
        "isMe": false,  // ✅ bên trái
        "group": groupId
      });
    });

    try {
      final request = http.MultipartRequest(
        "POST",
        Uri.parse("http://localhost:8080/api/v1/video-to-text"),
      )
        ..headers["Authorization"] = "Bearer ${widget.token}"
        ..files.add(await http.MultipartFile.fromPath("file", pickedFile.path));

      final response = await request.send();
      final respBody = await response.stream.bytesToString();

      if (response.statusCode == 200) {
        final rawText = jsonDecode(respBody)["data"];
        final refinedText = await _ollama.generateText(rawText);

        setState(() {
          _messages.add({
            "type": "text",
            "data": refinedText,
            "isMe": true, // ✅ nhưng nằm cùng group với video (liên quan)
            "group": groupId
          });
        });
      }
      _scrollToBottom();
    } catch (e) {
      debugPrint("Lỗi kết nối video→text API: $e");
    }
  }
}

  Future<void> _pickImage() async {
    final XFile? pickedFile = await _picker.pickImage(
      source: ImageSource.gallery,
    );

    if (pickedFile != null) {
      setState(() {
        _messages.add({
          "type": "image",
          "data": File(pickedFile.path),
          "isMe": true,
        });
      });
    }
  }

  Widget _buildMessage(Map<String, dynamic> message, int index) {
    final bool isMe = message["isMe"];
    final String type = message["type"];

    Widget bubble;

    if (type == "text") {
      bubble = Container(
        padding: const EdgeInsets.symmetric(vertical: 10, horizontal: 14),
        decoration: BoxDecoration(
          color: isMe ? const Color(0xFF49BBBD) : Colors.grey.shade200,
          borderRadius: BorderRadius.circular(18),
        ),
        child: Text(
          message["data"],
          style: TextStyle(
            color: isMe ? Colors.white : Colors.black87,
            fontSize: 16,
          ),
        ),
      );
    } else if (type == "emoji") {
      bubble = Text(message["data"], style: const TextStyle(fontSize: 32));
    } else if (type == "image") {
      bubble = ClipRRect(
        borderRadius: BorderRadius.circular(12),
        child: Image.file(message["data"], width: 180, fit: BoxFit.cover),
      );
    } else if (type == "video") {
      bubble = GestureDetector(
        onTap: () {
          Navigator.push(
            context,
            MaterialPageRoute(
              builder: (_) => FullScreenVideoPage(url: message["data"]),
            ),
          );
        },
        child: Hero(
          tag: "video_$index",
          child: SizedBox(
            width: 200,
            height: 200,
            child: _VideoPlayerWidget(url: message["data"]),
          ),
        ),
      );
    } else {
      bubble = const SizedBox.shrink();
    }

    return Align(
      alignment: isMe ? Alignment.centerRight : Alignment.centerLeft,
      child: Container(
        margin: const EdgeInsets.symmetric(vertical: 6, horizontal: 8),
        child: bubble,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey.shade50,
      appBar: AppBar(
        backgroundColor: const Color(0xFF49BBBD),
        elevation: 0,
        title: const Text("Giao tiếp", style: TextStyle(color: Colors.white)),
        leading: IconButton(
          onPressed: () {
            Navigator.pushAndRemoveUntil(
              context,
              MaterialPageRoute(
                builder: (context) => SearchSignScreen(token: widget.token),
              ),
              (route) => false,
            );
          },
          icon: const Icon(Icons.arrow_back_ios, size: 20, color: Colors.white),
        ),
      ),
      body: Column(
        children: [
          Expanded(
            child: ListView.builder(
              controller: _scrollController,
              padding: const EdgeInsets.all(12),
              itemCount: _messages.length,
              itemBuilder: (context, index) {
                return _buildMessage(_messages[index], index);
              },
            ),
          ),
          SafeArea(
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 8),
              decoration: BoxDecoration(
                color: Colors.white,
                border: Border(top: BorderSide(color: Colors.grey.shade300)),
              ),
              child: Row(
                children: [
                  IconButton(
                    icon: const Icon(Icons.image, color: Colors.grey),
                    onPressed: _pickImage,
                  ),
                  Expanded(
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 12),
                      decoration: BoxDecoration(
                        color: Colors.grey.shade200,
                        borderRadius: BorderRadius.circular(25),
                      ),
                      child: TextField(
                        controller: _controller,
                        decoration: const InputDecoration(
                          hintText: "Nhập tin nhắn...",
                          border: InputBorder.none,
                        ),
                        onSubmitted: (_) => _sendTextMessage(),
                      ),
                    ),
                  ),
                  IconButton(
                    icon: const Icon(
                      Icons.video_library,
                      color: Colors.blueAccent,
                    ),
                    onPressed: _pickVideo,
                  ),
                  IconButton(
                    icon: const Icon(
                      Icons.emoji_emotions,
                      color: Colors.orangeAccent,
                    ),
                    onPressed: () => _sendEmoji("😊"),
                  ),
                  IconButton(
                    icon: const Icon(Icons.send, color: Color(0xFF49BBBD)),
                    onPressed: _sendTextMessage,
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _VideoPlayerWidget extends StatefulWidget {
  final String url;
  const _VideoPlayerWidget({Key? key, required this.url}) : super(key: key);

  @override
  State<_VideoPlayerWidget> createState() => _VideoPlayerWidgetState();
}

class _VideoPlayerWidgetState extends State<_VideoPlayerWidget> {
  late VideoPlayerController _controller;

  @override
  void initState() {
    super.initState();
    _controller = VideoPlayerController.network(widget.url)
      ..initialize().then((_) {
        setState(() {});
      });
  }

  @override
  void dispose() {
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return _controller.value.isInitialized
        ? Stack(
            alignment: Alignment.center,
            children: [
              ClipRRect(
                borderRadius: BorderRadius.circular(12),
                child: AspectRatio(
                  aspectRatio: _controller.value.aspectRatio,
                  child: VideoPlayer(_controller),
                ),
              ),
              Icon(Icons.play_circle_fill, size: 50, color: Colors.white70),
            ],
          )
        : const Center(child: CircularProgressIndicator());
  }
}

/// Màn hình video full
class FullScreenVideoPage extends StatefulWidget {
  final String url;
  const FullScreenVideoPage({Key? key, required this.url}) : super(key: key);

  @override
  State<FullScreenVideoPage> createState() => _FullScreenVideoPageState();
}

class _FullScreenVideoPageState extends State<FullScreenVideoPage> {
  late VideoPlayerController _controller;

  @override
  void initState() {
    super.initState();
    _controller = VideoPlayerController.network(widget.url)
      ..initialize().then((_) {
        setState(() {
          _controller.play();
        });
      });
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.black,
      body: GestureDetector(
        onTap: () => Navigator.pop(context),
        child: Center(
          child: Hero(
            tag: "video_full",
            child: _controller.value.isInitialized
                ? AspectRatio(
                    aspectRatio: _controller.value.aspectRatio,
                    child: VideoPlayer(_controller),
                  )
                : const CircularProgressIndicator(color: Colors.white),
          ),
        ),
      ),
    );
  }
}
