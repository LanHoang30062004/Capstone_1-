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




/////////////////olama
✅ Bước 1. Xóa cấu hình portproxy gây lỗi

Chạy CMD với quyền Administrator, nhập lệnh:

netsh interface portproxy delete v4tov4 listenport=11434 listenaddress=0.0.0.0
netsh interface portproxy delete v4tov4 listenport=11434 listenaddress=0.0.0.0


Nếu bạn muốn chắc chắn xoá tất cả cấu hình portproxy (an toàn nếu bạn không dùng port forwarding đặc biệt nào khác), chạy thêm:

netsh interface portproxy reset

✅ Bước 2. Kiểm tra lại

Xem lại cấu hình portproxy đã bị xoá chưa:

netsh interface portproxy show all


Kết quả mong muốn:

Listen on ipv4:             Connect to ipv4:

Address         Port        Address         Port
--------------- ----------  --------------- ----------


👉 tức là trống hoàn toàn.

✅ Bước 3. Kiểm tra lại cổng 11434
netstat -ano | findstr 11434


Nếu không có dòng nào → cổng đã được giải phóng ✅

✅ Bước 4. Khởi động lại Ollama

Giờ bạn chỉ cần chạy:

ollama serve


Bạn sẽ thấy:

Listening on 127.0.0.1:11434

✅ Bước 5. Tạo lại model

Khi server đã chạy ổn định:

cd C:\Users\ASUS\.ollama\models
ollama create grammarly -f grammarly.modelfile


🎯 Tóm lại:
Nguyên nhân = Windows portproxy đang chiếm cổng 11434
Giải pháp = Xoá cấu hình portproxy → giải phóng cổng → chạy lại Ollama

Sau khi bạn xoá xong, gửi mình kết quả của:

netsh interface portproxy show all

Giờ bạn chỉ cần mở lại Command Prompt (Administrator) và chạy:

ollama serve


Nếu mọi thứ ổn, bạn sẽ thấy:

Listening on 127.0.0.1:11434

💡 Sau đó kiểm tra thêm:

Mở trình duyệt và vào:

http://127.0.0.1:11434

⚙️ Giờ bạn có thể kiểm tra lại model:
ollama list


hoặc chạy thử:

ollama run grammarly


Nếu bạn thấy dòng như:

>>> 


thì model đã sẵn sàng để bạn nhập prompt và nhận phản hồi.

💡 Gợi ý sử dụng

Ví dụ, bạn có thể thử:

ollama run grammarly "Viết lại câu sau cho tự nhiên hơn: Tôi đang học tiếng Anh mỗi ngày để cải thiện kỹ năng giao tiếp."


👉 Tóm lại:

Trạng thái	Mô tả
🧱 Portproxy lỗi	Đã xoá thành công
⚙️ Ollama server	Đang chạy ổn định
🧩 Model Grammarly	Đã tạo thành công
🚀 Sẵn sàng sử dụng	Bạn có thể run hoặc pull, create thêm model khác

Bạn có muốn mình hướng dẫn luôn cách tích hợp model grammarly này vào ứng dụng Python hoặc web local (để gọi API Ollama từ code) không?


ở cmd run as admin
1: netsh interface portproxy add v4tov4 listenaddress=0.0.0.0 listenport=11434 connectaddress=127.0.0.1 connectport=11434
Nếu chạy thành công → nó sẽ không báo lỗi gì cả (chỉ xuống dòng trống).
2: netsh interface portproxy show all
        Nếu thấy dòng như sau là OK:
        Listen on ipv4:             Connect to ipv4:

        Address         Port        Address         Port
        --------------- ----------  --------------- ----------
        0.0.0.0         11434       127.0.0.1       11434
3: ollama serve        
4: Chạy lệnh:
cd C:\Users\ASUS\.ollama\models
ollama create grammarly -f grammarly.modelfile// ********k cần create
ollama run grammarly


