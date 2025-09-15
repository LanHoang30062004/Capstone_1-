import 'dart:convert';
import 'package:http/http.dart' as http;

class OllamaService {
  final String baseUrl = "http://localhost:11434/api/generate";

  Future<String> generateText(String rawText) async {
    final prompt =
        "Chỉnh sửa câu sau cho đúng ngữ pháp, tự nhiên và rõ ràng hơn."
        "Không thay đổi ý nghĩa chính."
        "Chỉ trả về câu đã chỉnh sửa [Text], không thêm gì khác: $rawText";

    final request = http.Request("POST", Uri.parse(baseUrl));
    request.headers["Content-Type"] = "application/json";
    request.body = jsonEncode({
      "model": "llama3",
      "prompt": prompt,
      "stream": false, 
    });

    final response = await request.send();
    final body = await response.stream.bytesToString();

    if (response.statusCode == 200) {
      final data = jsonDecode(body);
      return data["response"] ?? "";
    } else {
      throw Exception("Ollama API error: $body");
    }
  }
}
