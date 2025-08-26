import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;

class SearchScreen extends StatefulWidget {
  const SearchScreen({super.key});

  @override
  State<SearchScreen> createState() => _SearchScreenState();
}

class _SearchScreenState extends State<SearchScreen> {
  List<dynamic> _data = [];
  bool _loading = false;
  final TextEditingController _controller = TextEditingController();

  Future<void> _fetchData(String query) async {
    setState(() => _loading = true);

    try {
      // ví dụ API test (bạn đổi sang API của mình nhé)
      final url = Uri.parse("https://jsonplaceholder.typicode.com/posts");
      final response = await http.get(url);

      if (response.statusCode == 200) {
        final List<dynamic> result = json.decode(response.body);
        // filter theo query (tìm trong title)
        setState(() {
          _data = result
              .where((item) =>
                  item['title'].toString().toLowerCase().contains(query.toLowerCase()))
              .toList();
        });
      } else {
        throw Exception("Lỗi: ${response.statusCode}");
      }
    } catch (e) {
      debugPrint("Error: $e");
    } finally {
      setState(() => _loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Search API Demo")),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            // ô search
            Row(
              children: [
                Expanded(
                  child: TextField(
                    controller: _controller,
                    decoration: const InputDecoration(
                      hintText: "Nhập từ khóa...",
                      border: OutlineInputBorder(),
                    ),
                  ),
                ),
                const SizedBox(width: 8),
                ElevatedButton(
                  onPressed: () {
                    _fetchData(_controller.text);
                  },
                  child: const Text("Search"),
                ),
              ],
            ),
            const SizedBox(height: 20),

            // hiển thị kết quả
            _loading
                ? const Center(child: CircularProgressIndicator())
                : Expanded(
                    child: ListView.builder(
                      itemCount: _data.length,
                      itemBuilder: (context, index) {
                        final item = _data[index];
                        return Card(
                          child: ListTile(
                            title: Text(item['title']),
                            subtitle: Text(item['body']),
                          ),
                        );
                      },
                    ),
                  ),
          ],
        ),
      ),
    );
  }
}
