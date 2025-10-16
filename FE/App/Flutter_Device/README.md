# demo_app

A new Flutter project.

## Getting Started

This project is a starting point for a Flutter application.

A few resources to get you started if this is your first Flutter project:

- [Lab: Write your first Flutter app](https://docs.flutter.dev/get-started/codelab)
- [Cookbook: Useful Flutter samples](https://docs.flutter.dev/cookbook)

For help getting started with Flutter development, view the
[online documentation](https://docs.flutter.dev/), which offers tutorials,
samples, guidance on mobile development, and a full API reference.

Share màn điện thoại :D:
cd scrcpy-win64-v3.3.3
scrcpy.exe


//mở cho flutter kết nối được với olama:
 mở cmd gõ ipconfig ví dụ: IPv4 Address . . . . . . . . . . : 192.168.x.x // → Ví dụ: 192.168.1.9
mở PowerShell, Run as administrator, dán vào cái này: netsh interface portproxy add v4tov4 listenaddress=0.0.0.0 listenport=11434 connectaddress=127.0.0.1 connectport=11434
Nếu chạy thành công → nó sẽ không báo lỗi gì cả (chỉ xuống dòng trống).
✅ Kiểm tra lại portproxy đã được tạo chưa:

Sau khi chạy xong, gõ tiếp:

netsh interface portproxy show all

Nếu thấy dòng như sau là OK:

Listen on ipv4:             Connect to ipv4:

Address         Port        Address         Port
--------------- ----------  --------------- ----------
0.0.0.0         11434       127.0.0.1       11434

tiếp: ollama run llama3
bỏ cái này vào: 
SYSTEM """
Bạn là Grmally.
Nhiệm vụ của bạn:
- Người dùng sẽ gửi vào một đoạn văn bản thô, bạn hãy viết lại đoạn văn bản đó cho rõ nghĩa hơn, dễ hiểu hơn, và xóa đi những câu từ không cần thiết, thừa thải
- Tuyệt đối không trả lời bất kỳ câu hỏi nào khác.
"""



// cách chạy olama đẻ làm lại câu 
⚙️ Bước 1: Kiểm tra Ollama server

Trên máy tính (Windows) — mở CMD và chạy:

ollama serve


Nếu bạn đã cấu hình portproxy rồi thì để đó chạy, hoặc đảm bảo Ollama Desktop đang bật.

✅ Mặc định Ollama chạy ở:

http://localhost:11434


Và điện thoại truy cập qua IP thật của máy:

http://192.168.1.9:11434

📁 Bước 2: Tạo model grammarly

Nếu chưa tạo, trong thư mục
C:\Users\ASUS\.ollama\models\
tạo file: grammarly.modelfile

Dán nội dung:

FROM llama3
PARAMETER temperature 0.2
PARAMETER num_ctx 4096

TEMPLATE """Sửa lại đoạn văn sau sao cho đúng ngữ pháp và tự nhiên hơn, chỉ trả về văn bản đã chỉnh sửa:
{{ .Prompt }}"""


Chạy lệnh:

cd C:\Users\ASUS\.ollama\models
ollama create grammarly -f grammarly.modelfile


