import 'package:flutter/material.dart';
import 'package:flutter_chat_ui/flutter_chat_ui.dart';
import 'package:flutter_chat_types/flutter_chat_types.dart' as types;
import 'package:uuid/uuid.dart';
import 'ollama_service.dart';
import 'dart:io' show File; // Cho mobile


class ChatDemo extends StatefulWidget {
  const ChatDemo({super.key});

  @override
  State<ChatDemo> createState() => _ChatDemoState();
}

class _ChatDemoState extends State<ChatDemo> {
  final List<types.Message> _messages = [];
  final _user = const types.User(id: 'user-1'); 
  final _bot = const types.User(id: 'bot-1');   

  final _ollamaService = OllamaService();

  void _handleSendPressed(types.PartialText message) async {
    final userMessage = types.TextMessage(
      author: _user,
      createdAt: DateTime.now().millisecondsSinceEpoch,
      id: const Uuid().v4(),
      text: message.text,
    );

    setState(() {
      _messages.insert(0, userMessage);
    });

    final botReply = await _ollamaService.generateText(message.text);

    final botMessage = types.TextMessage(
      author: _bot,
      createdAt: DateTime.now().millisecondsSinceEpoch,
      id: const Uuid().v4(),
      text: botReply,
    );

    setState(() {
      _messages.insert(0, botMessage);
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Chat(
        messages: _messages,
        onSendPressed: _handleSendPressed,
        user: _user,
      ),
    );
  }
}
