import 'dart:convert';
import 'package:http/http.dart' as http;
import 'dart:io' show File; // Cho mobile
import 'fileConfiguration.dart';

class OllamaService {
  final String baseUrl =
      "http://" + Fileconfiguration.ip + ":11434/api/generate";

  Future<String> generateText(String rawText) async {
    try {
      final response = await http.post(
        Uri.parse(baseUrl),
        headers: {"Content-Type": "application/json"},
        body: jsonEncode({
          "model": "grammarly",
          "prompt": rawText,
          "stream": false,
        }),
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        return data["response"] ?? "";
      } else {
        throw Exception("Ollama API error: ${response.body}");
      }
    } catch (e) {
      rethrow;
    }
  }
}
