import 'dart:convert';
import 'package:http/http.dart' as http;
import 'dart:io' show File; // Cho mobile


class GeminiService {
  final String apiKey;

  GeminiService(this.apiKey);

  Future<String> beautifyText(String input) async {
    final url = Uri.parse(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=$apiKey",
    );

    try {
      final response = await http.post(
        url,
        headers: {"Content-Type": "application/json"},
        body: jsonEncode({
          "contents": [
            {
              "parts": [
                {"text": "Hãy sửa câu này cho tự nhiên, dễ hiểu: $input"}
              ]
            }
          ]
        }),
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        final text =
            data["candidates"][0]["content"]["parts"][0]["text"] as String;
        return text.trim();
      } else {
        print("Lỗi API: ${response.statusCode} - ${response.body}");
        return "⚠️ Lỗi API (${response.statusCode})";
      }
    } catch (e) {
      print("Exception: $e");
      return "⚠️ Lỗi khi kết nối API: $e";
    }
  }
}
