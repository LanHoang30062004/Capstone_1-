import os
import subprocess
import json
from tkinter import Tk, filedialog # Tkinter là thư viện chuẩn, không cần pip install

def get_video_duration(input_path):
    """Sử dụng FFprobe (đi kèm FFmpeg) để lấy tổng thời lượng (tính bằng giây)."""
    # Lệnh ffprobe để lấy thời lượng dưới dạng JSON
    command = [
        'ffprobe', 
        '-v', 'error', 
        '-select_streams', 'v:0', # Chỉ chọn luồng video
        '-show_entries', 'stream=duration', 
        '-of', 'json', 
        input_path
    ]
    try:
        # Chạy lệnh ffprobe và bắt lỗi nếu có
        result = subprocess.run(command, capture_output=True, text=True, check=True)
        data = json.loads(result.stdout)
        # Phân tích cú pháp JSON để lấy giá trị duration
        duration = float(data['streams'][0]['duration'])
        return int(duration)
    except Exception as e:
        print("----------------------------------------------------------------------")
        print("⚠️ LỖI: Không tìm thấy FFPROBE hoặc lỗi khi đọc thời lượng video.")
        print("Đảm bảo FFmpeg đã được cài đặt và nằm trong biến PATH.")
        print(f"Chi tiết lỗi: {e}")
        print("----------------------------------------------------------------------")
        return None

def split_video_ffmpeg(input_path, output_folder, chunk_length=5):
    """Tính toán các điểm cắt và chạy lệnh FFmpeg."""
    
    # 1. Lấy thời lượng
    duration = get_video_duration(input_path)
    if duration is None:
        return # Dừng nếu không lấy được thời lượng
        
    print(f"Thời lượng video: {duration} giây. Bắt đầu chia đoạn {chunk_length} giây.")

    if not os.path.exists(output_folder):
        os.makedirs(output_folder)
        
    file_list = []
    
    # 2. Vòng lặp chia đoạn
    for start in range(0, duration, chunk_length):
        end = min(start + chunk_length, duration)
        
        output_path = os.path.join(output_folder, f"video_{start}_{end}.mp4")
        
        # Lệnh FFmpeg để cắt nhanh không re-encode (-c copy)
        command = [
            'ffmpeg',
            '-i', input_path,
            '-ss', str(start),
            '-t', str(chunk_length),
            '-c', 'copy', 
            output_path
        ]
        
        # 3. Chạy lệnh
        print(f"Đang tạo đoạn: {output_path} (Từ {start}s đến {end}s)")
        # Tắt output của FFmpeg để console không bị rối
        subprocess.run(command, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        file_list.append(output_path)

    return file_list
