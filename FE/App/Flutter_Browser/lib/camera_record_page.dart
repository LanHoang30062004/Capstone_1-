// lib/camera_record_page.dart
import 'dart:async';
import 'package:flutter/foundation.dart' show kIsWeb;
import 'package:flutter/material.dart';
import 'package:camera/camera.dart';
import 'package:cross_file/cross_file.dart';
import 'dart:io' show File; // Cho mobile


class CameraRecordPage extends StatefulWidget {
  const CameraRecordPage({Key? key}) : super(key: key);

  @override
  State<CameraRecordPage> createState() => _CameraRecordPageState();
}

class _CameraRecordPageState extends State<CameraRecordPage> {
  CameraController? _controller;
  List<CameraDescription>? _cameras;
  bool _isRecording = false;
  Timer? _timer;
  int _recordSeconds = 0;
  bool _initialized = false;

  @override
  void initState() {
    super.initState();
    _initCamera();
  }

  Future<void> _initCamera() async {
    try {
      _cameras = await availableCameras();
      if ((_cameras ?? []).isEmpty) {
        debugPrint('No camera available');
        return;
      }
      // Chọn camera mặc định (thường là front camera trên web)
      final camera = _cameras!.first;
      _controller = CameraController(camera, ResolutionPreset.medium, enableAudio: true);
      await _controller!.initialize();
      if (mounted) {
        setState(() {
          _initialized = true;
        });
      }
    } catch (e) {
      debugPrint('Error init camera: $e');
    }
  }

  Future<void> _startRecording() async {
    if (_controller == null || !_controller!.value.isInitialized) return;
    try {
      await _controller!.startVideoRecording();
      _isRecording = true;
      _recordSeconds = 0;
      _timer?.cancel();
      _timer = Timer.periodic(const Duration(seconds: 1), (_) {
        setState(() {
          _recordSeconds++;
        });
      });
      setState(() {});
    } catch (e) {
      debugPrint('Start recording error: $e');
    }
  }

  Future<void> _stopRecording() async {
    if (_controller == null || !_controller!.value.isRecordingVideo) return;
    try {
      final XFile recordedFile = await _controller!.stopVideoRecording();
      _timer?.cancel();
      _isRecording = false;
      setState(() {});
      // Trả XFile về page trước để xử lý tiếp
      Navigator.of(context).pop(recordedFile);
    } catch (e) {
      debugPrint('Stop recording error: $e');
    }
  }

  @override
  void dispose() {
    _timer?.cancel();
    _controller?.dispose();
    super.dispose();
  }

  String _fmt(int s) {
    final mm = (s ~/ 60).toString().padLeft(2, '0');
    final ss = (s % 60).toString().padLeft(2, '0');
    return '$mm:$ss';
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Quay video')),
      body: _initialized && _controller != null
          ? Column(
              children: [
                Expanded(
                  child: Center(
                    child: AspectRatio(
                      aspectRatio: _controller!.value.aspectRatio,
                      child: CameraPreview(_controller!),
                    ),
                  ),
                ),
                Padding(
                  padding: const EdgeInsets.symmetric(vertical: 12.0),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Text(_fmt(_recordSeconds), style: const TextStyle(fontSize: 16)),
                      const SizedBox(width: 16),
                      FloatingActionButton(
                        backgroundColor: _isRecording ? Colors.red : Colors.blue,
                        onPressed: _isRecording ? _stopRecording : _startRecording,
                        child: Icon(_isRecording ? Icons.stop : Icons.videocam),
                      ),
                      const SizedBox(width: 12),
                      // Optional: nút chuyển camera nếu có nhiều camera
                      if ((_cameras ?? []).length > 1)
                        IconButton(
                          icon: const Icon(Icons.cameraswitch),
                          onPressed: () async {
                            final currentIndex = _cameras!.indexOf(_controller!.description);
                            final next = _cameras![(currentIndex + 1) % _cameras!.length];
                            await _controller!.dispose();
                            _controller = CameraController(next, ResolutionPreset.medium, enableAudio: true);
                            await _controller!.initialize();
                            setState(() {});
                          },
                        ),
                    ],
                  ),
                ),
              ],
            )
          : const Center(child: CircularProgressIndicator()),
    );
  }
}
