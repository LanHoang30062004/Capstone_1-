import 'package:app_nckh/ChatVideoBubble.dart';
import 'package:app_nckh/searchSign.dart';
import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:video_thumbnail/video_thumbnail.dart';
import 'ollama_service.dart';
import 'package:file_picker/file_picker.dart';
import 'dart:typed_data';
import 'package:http_parser/http_parser.dart';
import 'dart:io' as io;
import 'package:cross_file/cross_file.dart';
import 'camera_record_page.dart';
import 'package:flutter/foundation.dart' show kIsWeb;
import 'package:camera/camera.dart';
import 'package:flutter_tts/flutter_tts.dart';
import 'package:video_player/video_player.dart';
import 'package:path_provider/path_provider.dart';
import 'package:video_thumbnail/video_thumbnail.dart' as vt;
import 'package:camera/camera.dart' as cam;
import 'fileConfiguration.dart';


import 'html_stub.dart' if (dart.library.html) 'html_web.dart';

// ✅ Cấu hình backend - Thay đổi theo môi trường của bạn
// ✅ Config backend riêng biệt
class BackendConfig {
  static const String javaEmulatorUrl = "http://10.0.2.2:8080";
  static final String javaDeviceUrl = "http://"+Fileconfiguration.ip+":8080";
  

  static const String pyEmulatorUrl = "http://10.0.2.2:8000";
  static final String pyDeviceUrl = "http://"+Fileconfiguration.ip+":8000";

  static String get javaBaseUrl => javaDeviceUrl;
  static String get pyBaseUrl => pyDeviceUrl;
}

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
  final FlutterTts _flutterTts = FlutterTts();

  bool useOllama = true;

  @override
  void dispose() {
    _scrollController.dispose();
    _controller.dispose();
    super.dispose();
  }

  String getVideoUrl(List<int> fileBytes, String filePath) {
    if (kIsWeb) {
      return HtmlHelper.createObjectUrlFromBytes(fileBytes);
    } else {
      return filePath;
    }
  }

  void _scrollToBottom() {
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

  Future<void> _speakText() async {
    await _speak(_controller.text.trim());
  }

  Future<void> _speak(String text) async {
    if (text.trim().isEmpty) return;
    await _flutterTts.setLanguage("vi-VN");
    await _flutterTts.setPitch(1.2);
    await _flutterTts.setSpeechRate(0.6);
    await _flutterTts.speak(text);
  }

  Future<Map<String, dynamic>?> pickVideo() async {
    final result = await FilePicker.platform.pickFiles(
      type: FileType.video,
      withData: !kIsWeb, // Mobile không cần withData
    );

    if (result == null) return null;
    final file = result.files.first;

    // ✅ Mobile: đọc từ path, Web: dùng bytes
    List<int> fileBytes;
    if (kIsWeb) {
      fileBytes = file.bytes!;
    } else {
      fileBytes = await io.File(file.path!).readAsBytes();
    }

    return {
      "bytes": fileBytes,
      "name": file.name,
      "path": file.path, // Giữ path cho mobile
    };
  }

  Future<void> _openCameraRecorder() async {
    final XFile? recorded = await Navigator.push<XFile?>(
      context,
      MaterialPageRoute(builder: (_) => const CameraRecordPage()),
    );

    if (recorded == null) return;

    try {
      final bytes = await recorded.readAsBytes();
      final groupId = DateTime.now().millisecondsSinceEpoch.toString();

      // ✅ Mobile: dùng path trực tiếp
      final videoUrlForPreview = recorded.path;

      setState(() {
        _messages.add({
          "type": "video",
          "data": videoUrlForPreview,
          "isMe": false,
          "group": groupId,
        });
      });

      _scrollToBottom();

      await _sendVideoToBackend(bytes, "recorded_$groupId.mp4", groupId);
    } catch (e, st) {
      debugPrint('Lỗi xử lý video quay xong: $e\n$st');
      _showErrorSnackBar('Lỗi xử lý video: $e');
    }
  }

  Future<void> _recordVideo() async {
    try {
      final pickedFile = await _picker.pickVideo(
        source: ImageSource.camera,
        maxDuration: const Duration(seconds: 30),
      );

      if (pickedFile == null) return;

      final file = io.File(pickedFile.path);
      final fileBytes = await file.readAsBytes();
      final groupId = DateTime.now().millisecondsSinceEpoch.toString();

      String videoUrl = getVideoUrl(fileBytes, file.path);

      setState(() {
        _messages.add({
          "type": "video",
          "data": videoUrl,
          "isMe": false,
          "group": groupId,
        });
      });

      _scrollToBottom();

      await _sendVideoToBackend(fileBytes, "recorded_video.mp4", groupId);
    } catch (e, stack) {
      debugPrint("Lỗi khi quay video: $e\n$stack");
      _showErrorSnackBar('Không thể quay video');
    }
  }

  Future<void> _sendVideoToBackend(
    List<int> fileBytes,
    String fileName,
    String groupId,
  ) async {
    try {
      debugPrint("Upload video: $fileName, size: ${fileBytes.length} bytes");

      // ✅ Sử dụng URL từ config
      final uri = Uri.parse("${BackendConfig.pyBaseUrl}/process-video");
      final request = http.MultipartRequest("POST", uri);

      // Đoán mime type
      String ext = fileName.toLowerCase().endsWith(".webm") ? "webm" : "mp4";
      request.files.add(
        http.MultipartFile.fromBytes(
          'file',
          fileBytes,
          filename: fileName,
          contentType: MediaType('video', ext),
        ),
      );

      // ✅ Thêm timeout
      final response = await request.send().timeout(
        const Duration(seconds: 60),
        onTimeout: () {
          throw Exception('Timeout khi upload video');
        },
      );

      final respStr = await response.stream.bytesToString();

      debugPrint("Response status: ${response.statusCode}");
      debugPrint("Response body: $respStr");

      if (response.statusCode == 200) {
        final jsonResp = jsonDecode(respStr);

        if (jsonResp["success"] == true) {
          final rawText = jsonResp["recognized_sequence"] ?? "";
          print("vfc");
          String displayText = rawText;
          print("useOllama = $useOllama");

          if (useOllama) {
            print("olama duoc goi tai day");
            try {
              displayText = await _ollama.generateText(rawText);
              print("Text sau khi Ollama format: $displayText");
            } catch (e) {
              displayText = rawText; 
              print("Lỗi Ollama: $e");  
            }
          }

          setState(() {
            _messages.add({
              "type": "text",
              "data": displayText,
              "isMe": false,
              "group": groupId,
            });
          });

          _scrollToBottom();
        } else {
          debugPrint("BE trả về lỗi: $jsonResp");
          _showErrorSnackBar('Không nhận diện được video');
        }
      } else {
        debugPrint("Upload thất bại: ${response.statusCode}");
        _showErrorSnackBar('Upload thất bại (${response.statusCode})');
      }
    } catch (e, stack) {
      debugPrint("Lỗi khi upload video: $e\n$stack");
      _showErrorSnackBar('Lỗi kết nối: ${e.toString()}');
    }
  }

  Future<void> _uploadAndProcessVideo() async {
    final pickedFile = await pickVideo();
    if (pickedFile == null) return;

    final groupId = DateTime.now().millisecondsSinceEpoch.toString();

    try {
      final fileBytes = pickedFile["bytes"] as List<int>;
      final fileName = pickedFile["name"] as String;
      final filePath = pickedFile["path"] as String?;

      // ✅ Mobile: dùng path, Web: tạo blob URL
      String videoUrl;
      if (kIsWeb) {
        videoUrl = getVideoUrl(fileBytes, "");
      } else {
        videoUrl = filePath ?? "";
      }

      setState(() {
        _messages.add({
          "type": "video",
          "data": videoUrl,
          "isMe": false,
          "group": groupId,
        });
      });

      _scrollToBottom();

      // ✅ Gửi lên BE với URL đúng
      final uri = Uri.parse("${BackendConfig.pyBaseUrl}/process-video");
      final request = http.MultipartRequest("POST", uri);

      request.files.add(
        http.MultipartFile.fromBytes(
          'file',
          fileBytes,
          filename: fileName,
          contentType: MediaType('video', 'mp4'),
        ),
      );

      final response = await request.send().timeout(
        const Duration(seconds: 60),
      );

      final respStr = await response.stream.bytesToString();

      debugPrint("Response status: ${response.statusCode}");
      debugPrint("Response body: $respStr");

      if (response.statusCode == 200) {
        final jsonResp = jsonDecode(respStr);

        if (jsonResp["success"] == true) {
          final rawText = jsonResp["recognized_sequence"] ?? "";

          String displayText = rawText;
          if (useOllama) {
            displayText = await _ollama.generateText(rawText);
          }

          setState(() {
            _messages.add({
              "type": "text",
              "data": displayText,
              "isMe": false,
              "group": groupId,
            });
          });

          _scrollToBottom();
        } else {
          _showErrorSnackBar('Không nhận diện được video');
        }
      } else {
        _showErrorSnackBar('Upload thất bại (${response.statusCode})');
      }
    } catch (e, stack) {
      debugPrint("Lỗi khi upload video: $e\n$stack");
      _showErrorSnackBar('Lỗi: ${e.toString()}');
    }
  }

  Future<void> _sendTextMessage() async {
    if (_controller.text.isEmpty) return;

    final inputText = _controller.text.trim();
    final groupId = DateTime.now().millisecondsSinceEpoch.toString();

    setState(() {
      _messages.add({
        "type": "text",
        "data": inputText,
        "isMe": true,
        "group": groupId,
      });
    });
    _scrollToBottom();
    _controller.clear();

    try {
      final response = await http
          .post(
            Uri.parse(
              "${BackendConfig.javaBaseUrl}/api/v1/translate?text=$inputText",
            ),
            headers: {
              "Authorization": "Bearer ${widget.token}",
              "accept": "application/json",
            },
          )
          .timeout(const Duration(seconds: 30));

      if (response.statusCode == 200) {
        final body = jsonDecode(response.body);
        final videoUrl = body["data"];

        if (videoUrl != null && videoUrl.toString().isNotEmpty) {
          setState(() {
            _messages.add({
              "type": "video",
              "data": videoUrl,
              "isMe": true,
              "group": groupId,
            });
          });
        } else {
          setState(() {
            _messages.add({
              "type": "text",
              "data": "Không tồn tại ngôn ngữ ký hiệu cho từ này.",
              "isMe": false,
              "group": groupId,
            });
          });
        }
      } else {
        _showErrorSnackBar('Lỗi API (${response.statusCode})');
      }

      _scrollToBottom();
    } catch (e) {
      debugPrint("Lỗi kết nối API: $e");
      _showErrorSnackBar('Lỗi kết nối');
    }
  }

  void _showErrorSnackBar(String message) {
    if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(message),
          backgroundColor: Colors.red,
          duration: const Duration(seconds: 3),
        ),
      );
    }
  }

  Future<void> _pickVideo() async {
    final result = await FilePicker.platform.pickFiles(type: FileType.video);

    if (result != null && result.files.isNotEmpty) {
      final file = result.files.first;
      final path = file.path;

      if (path != null && !kIsWeb) {
        // ✅ Mobile: dùng path trực tiếp
        setState(() {
          _messages.add({
            "type": "video",
            "data": path,
            "isMe": true,
            "group": DateTime.now().millisecondsSinceEpoch.toString(),
          });
        });
      } else if (file.bytes != null && kIsWeb) {
        // Web
        final videoUrl = HtmlHelper.createObjectUrlFromBytes(file.bytes!);

        setState(() {
          _messages.add({
            "type": "video",
            "data": videoUrl,
            "isMe": true,
            "group": DateTime.now().millisecondsSinceEpoch.toString(),
          });
        });
      }
    }
  }

  Widget _buildMessage(Map<String, dynamic> message, int index) {
    final bool isMe = message["isMe"];
    final String type = message["type"];

    Widget bubble;

    if (type == "text") {
      bubble = Container(
        constraints: BoxConstraints(
          maxWidth: MediaQuery.of(context).size.width * 0.7,
        ),
        padding: const EdgeInsets.symmetric(vertical: 10, horizontal: 14),
        decoration: BoxDecoration(
          color: isMe ? const Color(0xFF49BBBD) : Colors.grey.shade200,
          borderRadius: BorderRadius.circular(18),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            Flexible(
              child: Text(
                message["data"],
                softWrap: true,
                overflow: TextOverflow.visible,
                style: TextStyle(
                  color: isMe ? Colors.white : Colors.black87,
                  fontSize: 16,
                ),
              ),
            ),
            const SizedBox(width: 8),
            GestureDetector(
              onTap: () => _speak(message["data"]),
              child: Icon(
                Icons.volume_up,
                size: 20,
                color: isMe ? Colors.white : Colors.black54,
              ),
            ),
          ],
        ),
      );
    } else if (type == "emoji") {
      bubble = Text(message["data"], style: const TextStyle(fontSize: 32));
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
            child: _VideoPlayerWidget(videoUrl: message["data"]),
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
                    icon: const Icon(Icons.videocam, color: Colors.grey),
                    onPressed: _openCameraRecorder,
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
                    onPressed: _uploadAndProcessVideo,
                  ),
                  IconButton(
                    icon: const Icon(Icons.volume_up, color: Colors.green),
                    onPressed: _speakText,
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
  final String videoUrl;
  const _VideoPlayerWidget({required this.videoUrl, Key? key})
    : super(key: key);

  @override
  State<_VideoPlayerWidget> createState() => _VideoPlayerWidgetState();
}

class _VideoPlayerWidgetState extends State<_VideoPlayerWidget> {
  Uint8List? _thumbnail;
  VideoPlayerController? _controller;
  bool _inited = false;

  @override
  void initState() {
    super.initState();
    _init();
    if (!kIsWeb) {
      _generateThumbnail();
    }
  }

  Future<void> _init() async {
    try {
      if (kIsWeb ||
          widget.videoUrl.startsWith('http') ||
          widget.videoUrl.startsWith('blob:')) {
        _controller = VideoPlayerController.network(widget.videoUrl);
      } else {
        final file = io.File(widget.videoUrl);
        _controller = VideoPlayerController.file(file);
      }
      await _controller!.initialize();
      if (mounted) {
        setState(() {
          _inited = true;
        });
      }
    } catch (e) {
      debugPrint('Video init error: $e');
    }
  }

  Future<void> _generateThumbnail() async {
    if (kIsWeb) return;

    try {
      final uint8list = await vt.VideoThumbnail.thumbnailData(
        video: widget.videoUrl,
        imageFormat: vt.ImageFormat.JPEG,
        maxWidth: 200,
        quality: 75,
      );

      if (mounted && uint8list != null) {
        setState(() {
          _thumbnail = uint8list;
        });
      }
    } catch (e) {
      debugPrint('Thumbnail generation error: $e');
    }
  }

  @override
  void dispose() {
    _controller?.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () {
        if (_inited && _controller != null) {
          Navigator.push(
            context,
            MaterialPageRoute(
              builder: (_) => FullScreenVideoPage(url: widget.videoUrl),
            ),
          );
        }
      },
      child: Container(
        height: 180,
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(12),
          color: Colors.black12,
        ),
        child: Stack(
          alignment: Alignment.center,
          children: [
            if (_thumbnail != null)
              ClipRRect(
                borderRadius: BorderRadius.circular(12),
                child: Image.memory(
                  _thumbnail!,
                  width: double.infinity,
                  height: double.infinity,
                  fit: BoxFit.cover,
                ),
              )
            else if (_inited && _controller != null)
              AspectRatio(
                aspectRatio: _controller!.value.aspectRatio,
                child: VideoPlayer(_controller!),
              ),
            Container(
              decoration: BoxDecoration(
                color: Colors.black38,
                borderRadius: BorderRadius.circular(12),
              ),
            ),
            const Icon(Icons.play_circle_fill, size: 60, color: Colors.white),
          ],
        ),
      ),
    );
  }
}

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
    if (kIsWeb ||
        widget.url.startsWith('http') ||
        widget.url.startsWith('blob:')) {
      _controller = VideoPlayerController.network(widget.url)
        ..initialize().then((_) {
          if (mounted) {
            setState(() {});
            _controller.play();
          }
        });
    } else {
      _controller = VideoPlayerController.file(io.File(widget.url))
        ..initialize().then((_) {
          if (mounted) {
            setState(() {});
            _controller.play();
          }
        });
    }
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
      appBar: AppBar(
        backgroundColor: Colors.black,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Colors.white),
          onPressed: () => Navigator.pop(context),
        ),
      ),
      body: _controller.value.isInitialized
          ? Column(
              children: [
                Expanded(
                  child: Center(
                    child: AspectRatio(
                      aspectRatio: _controller.value.aspectRatio,
                      child: VideoPlayer(_controller),
                    ),
                  ),
                ),
                VideoProgressIndicator(
                  _controller,
                  allowScrubbing: true,
                  colors: const VideoProgressColors(
                    playedColor: Colors.red,
                    bufferedColor: Colors.white38,
                    backgroundColor: Colors.white24,
                  ),
                ),
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    IconButton(
                      icon: Icon(
                        _controller.value.isPlaying
                            ? Icons.pause
                            : Icons.play_arrow,
                        color: Colors.white,
                      ),
                      onPressed: () {
                        setState(() {
                          _controller.value.isPlaying
                              ? _controller.pause()
                              : _controller.play();
                        });
                      },
                    ),
                  ],
                ),
              ],
            )
          : const Center(child: CircularProgressIndicator(color: Colors.white)),
    );
  }
}
