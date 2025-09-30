import 'package:flutter/material.dart';
import 'package:video_thumbnail/video_thumbnail.dart';
import 'dart:typed_data';
import 'dart:io' show File; // Cho mobile


class ChatVideoBubble extends StatefulWidget {
  final String videoUrl;
  final VoidCallback onTap;
  final bool isMe;

  const ChatVideoBubble({
    Key? key,
    required this.videoUrl,
    required this.onTap,
    required this.isMe,
  }) : super(key: key);

  @override
  State<ChatVideoBubble> createState() => _ChatVideoBubbleState();
}

class _ChatVideoBubbleState extends State<ChatVideoBubble> {
  Uint8List? _thumbnailBytes;

  @override
  void initState() {
    super.initState();
    _generateThumbnail();
  }

  Future<void> _generateThumbnail() async {
    final bytes = await VideoThumbnail.thumbnailData(
      video: widget.videoUrl,
      imageFormat: ImageFormat.JPEG,
      maxHeight: 200, // chiều cao tối đa
      quality: 75,
    );

    if (mounted) {
      setState(() {
        _thumbnailBytes = bytes;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Align(
      alignment: widget.isMe ? Alignment.centerRight : Alignment.centerLeft,
      child: GestureDetector(
        onTap: widget.onTap,
        child: Container(
          margin: const EdgeInsets.symmetric(vertical: 5, horizontal: 8),
          width: 200,
          height: 140,
          decoration: BoxDecoration(
            color: Colors.black12,
            borderRadius: BorderRadius.circular(16),
          ),
          clipBehavior: Clip.antiAlias,
          child: Stack(
            children: [
              // Thumbnail từ video
              if (_thumbnailBytes != null)
                Positioned.fill(
                  child: Image.memory(
                    _thumbnailBytes!,
                    fit: BoxFit.cover,
                  ),
                )
              else
                const Center(
                  child: CircularProgressIndicator(),
                ),

              // Overlay mờ
              Positioned.fill(
                child: Container(
                  color: Colors.black.withOpacity(0.3),
                ),
              ),

              // Nút play ở giữa
              const Center(
                child: Icon(Icons.play_circle_fill,
                    size: 50, color: Colors.white),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
