import 'dart:io';
import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'loginPage.dart';

class ChatScreen extends StatefulWidget {
  const ChatScreen({super.key});

  @override
  State<ChatScreen> createState() => _ChatScreenState();
}

class _ChatScreenState extends State<ChatScreen> {
  final TextEditingController _controller = TextEditingController();
  final List<Map<String, dynamic>> _messages = [
    {"type": "text", "data": "Ăn gì chưa bạn ơi ?", "isMe": true},
    {"type": "emoji", "data": "👋", "isMe": false},
    {"type": "emoji", "data": "👍", "isMe": true},
  ];

  final ImagePicker _picker = ImagePicker();

  void _sendTextMessage() {
    if (_controller.text.isEmpty) return;

    setState(() {
      _messages.add({"type": "text", "data": _controller.text, "isMe": true});
    });

    _controller.clear();
  }

  void _sendEmoji(String emoji) {
    setState(() {
      _messages.add({"type": "emoji", "data": emoji, "isMe": true});
    });
  }

  Future<void> _pickImage() async {
    final XFile? pickedFile =
        await _picker.pickImage(source: ImageSource.gallery);

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

  Widget _buildMessage(Map<String, dynamic> message) {
    final bool isMe = message["isMe"];
    final String type = message["type"];

    if (type == "text") {
      return Align(
        alignment: isMe ? Alignment.centerRight : Alignment.centerLeft,
        child: Container(
          margin: const EdgeInsets.symmetric(vertical: 4, horizontal: 8),
          padding: const EdgeInsets.symmetric(vertical: 10, horizontal: 14),
          decoration: BoxDecoration(
            color: isMe ? Colors.blue : Colors.grey.shade200,
            borderRadius: BorderRadius.circular(18),
          ),
          child: Text(
            message["data"],
            style: TextStyle(
              color: isMe ? Colors.white : Colors.black87,
              fontSize: 16,
            ),
          ),
        ),
      );
    } else if (type == "emoji") {
      return Align(
        alignment: isMe ? Alignment.centerRight : Alignment.centerLeft,
        child: Container(
          margin: const EdgeInsets.symmetric(vertical: 6, horizontal: 8),
          child: Text(message["data"], style: const TextStyle(fontSize: 30)),
        ),
      );
    } else if (type == "image") {
      return Align(
        alignment: isMe ? Alignment.centerRight : Alignment.centerLeft,
        child: Container(
          margin: const EdgeInsets.symmetric(vertical: 6, horizontal: 8),
          child: ClipRRect(
            borderRadius: BorderRadius.circular(12),
            child: Image.file(
              message["data"],
              width: 180,
              fit: BoxFit.cover,
            ),
          ),
        ),
      );
    }

    return const SizedBox.shrink();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        backgroundColor: Color(0xFF49BBBD),
        title: const Text("Giao tiếp", style: TextStyle(color: Colors.white)),
        leading: IconButton(
          onPressed: () => Navigator.pop(context),
          icon: const Icon(Icons.arrow_back_ios, size: 20, color: Colors.white),
        ),
        
      ),
      body: Column(
        children: [
          Expanded(
            child: ListView.builder(
              padding: const EdgeInsets.all(8),
              itemCount: _messages.length,
              itemBuilder: (context, index) {
                return _buildMessage(_messages[index]);
              },
            ),
          ),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 6),
            decoration: BoxDecoration(
              color: Colors.white,
              border: Border(top: BorderSide(color: Colors.grey.shade300)),
            ),
            child: Row(
              children: [
                IconButton(
                  icon: const Icon(Icons.camera_alt, color: Colors.grey),
                  onPressed: () {}, // có thể mở camera nếu muốn
                ),
                IconButton(
                  icon: const Icon(Icons.image, color: Colors.grey),
                  onPressed: _pickImage, // 📌 chọn ảnh từ gallery
                ),
                Expanded(
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 12),
                    decoration: BoxDecoration(
                      color: Colors.grey.shade200,
                      borderRadius: BorderRadius.circular(20),
                    ),
                    child: TextField(
                      controller: _controller,
                      decoration: const InputDecoration(
                        hintText: "Aa",
                        border: InputBorder.none,
                      ),
                      onSubmitted: (_) => _sendTextMessage(),
                    ),
                  ),
                ),
                IconButton(
                  icon: const Icon(Icons.send, color: Colors.blue),
                  onPressed: _sendTextMessage,
                ),
                IconButton(
                  icon: const Icon(Icons.emoji_emotions, color: Colors.grey),
                  onPressed: () => _sendEmoji("😊"),
                ),
                IconButton(
                  icon: const Icon(Icons.thumb_up, color: Colors.blue),
                  onPressed: () => _sendEmoji("👍"),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
