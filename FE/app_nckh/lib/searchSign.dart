import 'dart:convert';
import 'package:app_nckh/chatScreen.dart';
import 'package:app_nckh/settingScreen.dart';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:video_player/video_player.dart';

class SearchSignScreen extends StatefulWidget {
  const SearchSignScreen({super.key});

  @override
  State<SearchSignScreen> createState() => _SearchSignScreenState();
}

class _SearchSignScreenState extends State<SearchSignScreen> {
  final String apiKey = "51875160-7c81ffd6d3dc4c9fc631e4aa1"; // key Pixabay
  final TextEditingController _searchController = TextEditingController();

  List<dynamic> videos = [];
  bool isLoading = false;

  /// Gọi API Pixabay
  Future<void> fetchVideos(String query) async {
    setState(() => isLoading = true);

    final url = Uri.parse(
      "https://pixabay.com/api/videos/?key=$apiKey&q=$query&per_page=10",
    );
    final response = await http.get(url);

    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      setState(() {
        videos = data["hits"];
        isLoading = false;
      });
    } else {
      setState(() => isLoading = false);
    }
  }

  @override
  void initState() {
    super.initState();
    // Khi vừa vào thì load video mặc định (vd: "hello")
    fetchVideos("hello");
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF03174C),
      appBar: AppBar(
        backgroundColor: const Color(0xFF03174C),
        elevation: 0,
        toolbarHeight: 80,

        // Logo bên trái
        leading: Padding(
          padding: const EdgeInsets.only(left: 12),
          child: Image.asset(
            'assets/img/logoMobile.png',
            width: 50, // chỉnh lại size cho phù hợp
            height: 100,

            // hoặc BoxFit.cover tùy bạn muốn
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
                  ? const Center(child: Text("Không có video nào"))
                  : ListView.builder(
                      itemCount: videos.length,
                      itemBuilder: (context, index) {
                        final video = videos[index];
                        final thumb = video["videos"]["tiny"]["thumbnail"];
                        final url = video["videos"]["large"]["url"];
                        final tags = video["tags"];
                        final duration = video["duration"];

                        return Card(
                          margin: const EdgeInsets.symmetric(
                            horizontal: 16,
                            vertical: 8,
                          ),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(16),
                          ),
                          elevation: 6,
                          clipBehavior: Clip.antiAlias, // bo góc cho cả ảnh
                          child: InkWell(
                            onTap: () {
                              Navigator.push(
                                context,
                                MaterialPageRoute(
                                  builder: (_) =>
                                      VideoPlayerScreen(videoUrl: url),
                                ),
                              );
                            },
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                // Thumbnail + duration overlay
                                Stack(
                                  children: [
                                    Image.network(
                                      thumb,
                                      width: double.infinity,
                                      height: 180,
                                      fit: BoxFit.cover,
                                    ),
                                    Positioned(
                                      bottom: 8,
                                      right: 8,
                                      child: Container(
                                        padding: const EdgeInsets.symmetric(
                                          horizontal: 8,
                                          vertical: 4,
                                        ),
                                        decoration: BoxDecoration(
                                          color: Colors.black.withOpacity(0.7),
                                          borderRadius: BorderRadius.circular(
                                            8,
                                          ),
                                        ),
                                        child: Text(
                                          "$duration s",
                                          style: const TextStyle(
                                            color: Colors.white,
                                            fontWeight: FontWeight.bold,
                                          ),
                                        ),
                                      ),
                                    ),
                                  ],
                                ),
                                // Nội dung bên dưới
                                Padding(
                                  padding: const EdgeInsets.all(12),
                                  child: Column(
                                    crossAxisAlignment:
                                        CrossAxisAlignment.start,
                                    children: [
                                      Text(
                                        tags,
                                        maxLines: 1,
                                        overflow: TextOverflow.ellipsis,
                                        style: const TextStyle(
                                          fontSize: 16,
                                          fontWeight: FontWeight.bold,
                                        ),
                                      ),
                                      const SizedBox(height: 6),
                                      Row(
                                        children: const [
                                          Icon(
                                            Icons.play_circle_fill,
                                            color: Colors.orange,
                                            size: 18,
                                          ),
                                          SizedBox(width: 4),
                                          Text(
                                            "Xem video",
                                            style: TextStyle(
                                              fontSize: 14,
                                              color: Colors.black54,
                                            ),
                                          ),
                                        ],
                                      ),
                                    ],
                                  ),
                                ),
                              ],
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
        items:  [
          BottomNavigationBarItem(icon: Icon(Icons.search), label: 'Tìm kiếm'),
          BottomNavigationBarItem(
            icon: IconButton(
              icon: Icon(Icons.chat),
              onPressed: () {
                Navigator.push(context,
                  MaterialPageRoute(builder: (context) => ChatScreen()),
                );
              },
            ),
            label: "Giao tiếp",
          ),
          BottomNavigationBarItem(icon: IconButton(
              icon: Icon(Icons.settings),
              onPressed: () {
                Navigator.push(context,
                  MaterialPageRoute(builder: (context) => SettingScreen()),
                );
              },
            ), label: 'Cài đặt'),
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
