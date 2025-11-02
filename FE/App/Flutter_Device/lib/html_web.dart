// ignore: avoid_web_libraries_in_flutter
import 'dart:html' as html;

class HtmlHelper {
  static String createObjectUrlFromBytes(List<int> bytes) {
    final blob = html.Blob([bytes]);
    return html.Url.createObjectUrlFromBlob(blob);
  }
}
