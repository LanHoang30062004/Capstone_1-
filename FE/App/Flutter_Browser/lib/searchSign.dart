import 'dart:convert';
import 'package:app_nckh/chatScreen.dart';
import 'package:app_nckh/settingScreen.dart';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:video_player/video_player.dart';
import 'dart:io' show File; // Cho mobile


class SearchSignScreen extends StatefulWidget {
  final String token;
    const SearchSignScreen({super.key, required this.token});


  @override
  State<SearchSignScreen> createState() => _SearchSignScreenState();
}

class _SearchSignScreenState extends State<SearchSignScreen> {
  final TextEditingController _searchController = TextEditingController();

  List<dynamic> videos = [];
  bool isLoading = false;

 Future<void> fetchVideos(String query, {int page = 0, int size = 20}) async {
  try {
    setState(() {
      isLoading = true;
    });

    final uri = Uri.parse(
      "http://localhost:8080/api/v1/word?page=$page&size=$size&search=$query",
    );

    final response = await http.get(
      uri,
      headers: {
        "Authorization": "Bearer ${widget.token}",
        "Content-Type": "application/json",
      },
    );

    print("Response status: ${response.statusCode}");
    print("Response body: ${response.body}");

    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);

      if (data["data"] != null && data["data"]["items"] != null) {
        final List items = data["data"]["items"];
        setState(() {
          videos = items.map((item) {
            return {
              "wordName": item["wordName"],
              "wordMeaning": item["wordMeaning"],
              "videoUrl": item["videoUrl"],
            };
          }).toList();
        });
      } else {
        setState(() {
          videos = [];
        });
      }
    } else {
      print("Lỗi từ server: ${response.body}");
    }
  } catch (e) {
    print("Lỗi kết nối API: $e");
  } finally {
    setState(() {
      isLoading = false;
    });
  }
}

  @override
  void initState() {
    super.initState();
    fetchVideos("cá"); 
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF49BBBD),
      appBar: AppBar(
        backgroundColor: const Color(0xFF49BBBD),
        elevation: 0,
        toolbarHeight: 80,

        // Logo bên trái
        leading: Padding(
          padding: const EdgeInsets.only(left: 12),
          child: Image.asset(
            'assets/img/SignSmart_Logo_TrongSuot.png',
            width: 200,
            height: 300,
          ),
        ),

        // Tiêu đề ở giữa
        title: const Text(
          "Sign-Smart",
          style: TextStyle(
            color: Colors.white,
            fontSize: 16,
            fontWeight: FontWeight.w500,
          ),
        ),

        // Quốc kỳ bên phải
        actions: [
          Padding(
            padding: const EdgeInsets.only(right: 12),
            child: CircleAvatar(
              radius: 18,
              backgroundImage: AssetImage('assets/img/logoVietNam.png'),
            ),
          ),
        ],
      ),

      body: Container(
        width: double.infinity,
        decoration: const BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.only(
            topLeft: Radius.circular(24),
            topRight: Radius.circular(24),
          ),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const SizedBox(height: 30),

            // Ô tìm kiếm
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16.0),
              child: Container(
                decoration: BoxDecoration(
                  color: const Color(0xFFF3F6FF),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: TextField(
                  controller: _searchController,
                  decoration: InputDecoration(
                    contentPadding: const EdgeInsets.symmetric(
                      horizontal: 16,
                      vertical: 14,
                    ),
                    hintText: "Nhập ngôn ngữ kí hiệu",
                    border: InputBorder.none,
                    suffixIcon: IconButton(
                      icon: const Icon(Icons.search, color: Colors.teal),
                      onPressed: () {
                        if (_searchController.text.isNotEmpty) {
                          fetchVideos(_searchController.text);
                        }
                      },
                    ),
                  ),
                ),
              ),
            ),

            const SizedBox(height: 24),

            Expanded(
              child: isLoading
                  ? const Center(child: CircularProgressIndicator())
                  : videos.isEmpty
                      ? const Center(child: Text("Không tìm thấy ngôn ngữ kí hiệu"))
                      : ListView.builder(
                          itemCount: videos.length,
                          itemBuilder: (context, index) {
                            final video = videos[index];
                            final wordName = video["wordName"];
                            final wordMeaning = video["wordMeaning"];
                            final videoUrl = video["videoUrl"];

                            return Card(
                              margin: const EdgeInsets.symmetric(
                                  horizontal: 16, vertical: 8),
                              shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(16)),
                              elevation: 6,
                              child: InkWell(
                                onTap: () {
                                  Navigator.push(
                                    context,
                                    MaterialPageRoute(
                                      builder: (_) =>
                                          VideoPlayerScreen(videoUrl: videoUrl),
                                    ),
                                  );
                                },
                                child: Padding(
                                  padding: const EdgeInsets.all(12),
                                  child: Column(
                                    crossAxisAlignment:
                                        CrossAxisAlignment.start,
                                    children: [
                                      Text(
                                        wordName ?? "Không có tên",
                                        style: const TextStyle(
                                          fontSize: 16,
                                          fontWeight: FontWeight.bold,
                                        ),
                                      ),
                                      const SizedBox(height: 6),
                                      Text(
                                        wordMeaning ?? "Không có nghĩa",
                                        style: const TextStyle(
                                            color: Colors.black54),
                                      ),
                                      const SizedBox(height: 6),
                                      Row(
                                        children: const [
                                          Icon(Icons.play_circle_fill,
                                              color: Colors.orange, size: 18),
                                          SizedBox(width: 4),
                                          Text("Xem video"),
                                        ],
                                      ),
                                    ],
                                  ),
                                ),
                              ),
                            );
                          },
                        ),
            ),
          ],
        ),
      ),

      bottomNavigationBar: BottomNavigationBar(
        items: [
          BottomNavigationBarItem(icon: Icon(Icons.search), label: 'Tìm kiếm'),
          BottomNavigationBarItem(
            icon: IconButton(
              icon: Icon(Icons.chat),
              onPressed: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(builder: (context) => ChatScreen(token: widget.token,)),
                );
              },
            ),
            label: "Giao tiếp",
          ),
          BottomNavigationBarItem(
              icon: IconButton(
                icon: Icon(Icons.settings),
                onPressed: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(builder: (context) => SettingScreen(token: widget.token)),
                  );
                },
              ),
              label: 'Cài đặt'),
        ],
      ),
    );
  }
}

/// Màn hình xem video
class VideoPlayerScreen extends StatefulWidget {
  final String videoUrl;
  const VideoPlayerScreen({super.key, required this.videoUrl});

  @override
  State<VideoPlayerScreen> createState() => _VideoPlayerScreenState();
}

class _VideoPlayerScreenState extends State<VideoPlayerScreen> {
  late VideoPlayerController _controller;
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _controller = VideoPlayerController.networkUrl(Uri.parse(widget.videoUrl))
      ..initialize().then((_) {
        setState(() {
          _isLoading = false;
        });
        _controller.play();
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
      appBar: AppBar(title: const Text("Xem Video")),
      backgroundColor: Colors.black,
      body: Center(
        child: _isLoading
            ? const CircularProgressIndicator()
            : AspectRatio(
                aspectRatio: _controller.value.aspectRatio,
                child: VideoPlayer(_controller),
              ),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () {
          setState(() {
            _controller.value.isPlaying
                ? _controller.pause()
                : _controller.play();
          });
        },
        child: Icon(
          _controller.value.isPlaying ? Icons.pause : Icons.play_arrow,
        ),
      ),
    );
  }
}
