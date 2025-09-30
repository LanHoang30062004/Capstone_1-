import 'dart:convert';
import 'package:http/http.dart' as http;
import 'dart:io' show File; // Cho mobile


class OllamaService {
  final String baseUrl = "http://localhost:11434/api/generate";

  Future<String> generateText(String rawText) async {
    // Prompt rõ ràng hơn + phù hợp cho paraphrase
    final prompt = """
Chỉnh sửa câu sau cho đúng ngữ pháp, tự nhiên và rõ ràng hơn.
Không thay đổi ý nghĩa chính.
Chỉ trả về câu đã chỉnh sửa, không thêm gì khác:

$rawText
""";

    try {
      final response = await http.post(
        Uri.parse(baseUrl),
        headers: {
          "Content-Type": "application/json",
        },
        body: jsonEncode({
          "model": "mistral", // 🔥 Đổi từ llama3 sang mistral
          "prompt": prompt,
          "stream": false, // Không stream → trả về kết quả 1 lần
        }),
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        return data["response"] ?? "";
      } else {
        throw Exception("Ollama API error: ${response.body}");
      }
    } catch (e) {
      rethrow; // để hàm gọi nó handle
    }
  }
}
