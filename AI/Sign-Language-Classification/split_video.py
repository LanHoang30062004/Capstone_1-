import os
import subprocess
import cv2
import tempfile
import shutil


def get_video_duration(video_path):
    """Lấy thời lượng video sử dụng OpenCV"""
    try:
        cap = cv2.VideoCapture(video_path)
        if not cap.isOpened():
            return None

        fps = cap.get(cv2.CAP_PROP_FPS)
        frame_count = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))

        if fps > 0:
            duration = frame_count / fps
        else:
            duration = 0

        cap.release()
        return duration

    except Exception as e:
        print(f"Lỗi khi lấy thời lượng video: {e}")
        return None


def create_chunk_reencode(input_path, output_path, start, end):
    """Tạo chunk bằng re-encode (chính xác nhưng chậm)"""
    try:
        command = [
            "ffmpeg",
            "-y",
            "-i",
            input_path,
            "-ss",
            str(start),
            "-to",
            str(end),
            "-c:v",
            "libx264",
            "-c:a",
            "aac",
            "-avoid_negative_ts",
            "make_zero",
            output_path,
        ]
        subprocess.run(
            command, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL
        )

        # Verify chunk
        cap = cv2.VideoCapture(output_path)
        frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
        fps = cap.get(cv2.CAP_PROP_FPS)
        duration = frames / fps if fps > 0 else 0
        cap.release()

        expected_duration = end - start
        if frames > 10 and abs(duration - expected_duration) <= 1.0:
            print(f"✅ Re-encode thành công: {frames} frames, {duration:.2f}s")
            return True
        else:
            print(f"❌ Re-encode thất bại: chỉ {frames} frames, {duration:.2f}s")
            if os.path.exists(output_path):
                os.remove(output_path)
            return False

    except Exception as e:
        print(f"❌ Lỗi re-encode: {e}")
        if os.path.exists(output_path):
            os.remove(output_path)
        return False


def split_video_ffmpeg_accurate(input_path, output_folder, chunk_length=5):
    """Tạo chunks với 2-pass seeking (nhanh)"""
    duration = get_video_duration(input_path)
    if duration is None:
        return []

    file_list = []
    start = 0

    while start < duration:
        end = min(start + chunk_length, duration)
        output_path = os.path.join(output_folder, f"video_{int(start)}_{int(end)}.mp4")

        # 2-pass seeking cho độ chính xác cao hơn
        command = [
            "ffmpeg",
            "-y",
            "-ss",
            str(start),  # Input seeking
            "-i",
            input_path,
            "-to",
            str(end - start),  # Duration
            "-c",
            "copy",
            "-avoid_negative_ts",
            "make_zero",
            output_path,
        ]

        print(f"  Đang tạo (copy): {start}s → {end}s")
        try:
            subprocess.run(
                command,
                check=True,
                stdout=subprocess.DEVNULL,
                stderr=subprocess.DEVNULL,
            )

            # Verify chunk quality
            cap = cv2.VideoCapture(output_path)
            chunk_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
            chunk_fps = cap.get(cv2.CAP_PROP_FPS)
            chunk_duration = chunk_frames / chunk_fps if chunk_fps > 0 else 0
            cap.release()

            expected_duration = end - start
            expected_min_frames = (
                expected_duration * 0.7
            ) * 24  # Ít nhất 70% frames mong đợi

            if (
                chunk_frames >= expected_min_frames
                and abs(chunk_duration - expected_duration) <= 1.0
            ):
                file_list.append(output_path)
                print(
                    f"  ✅ Copy thành công: {chunk_frames} frames, {chunk_duration:.2f}s"
                )
            else:
                print(
                    f"  ⚠️ Copy không đạt: {chunk_frames} frames, {chunk_duration:.2f}s (mong đợi: {expected_duration:.2f}s)"
                )
                # Đánh dấu để re-encode sau
                file_list.append(None)  # Dùng None để đánh dấu chunk cần re-encode
                if os.path.exists(output_path):
                    os.remove(output_path)

        except Exception as e:
            print(f"  ❌ Lỗi copy: {e}")
            file_list.append(None)  # Đánh dấu cần re-encode
            if os.path.exists(output_path):
                os.remove(output_path)

        start = end

    return file_list


def split_video_ffmpeg_hybrid(input_path, output_folder, chunk_length=5):
    """
    Hybrid approach: Thử copy trước (nhanh), nếu không được thì re-encode (chính xác)

    Args:
        input_path: Đường dẫn video input
        output_folder: Thư mục output
        chunk_length: Độ dài mỗi chunk (giây)

    Returns:
        List đường dẫn đến các chunk đã tạo
    """
    # 1. Lấy thời lượng video
    duration = get_video_duration(input_path)
    if duration is None:
        print("❌ Không thể lấy thời lượng video")
        return []

    print(f"🎬 Thời lượng video: {duration:.2f} giây")
    print(f"🔪 Bắt đầu chia thành các đoạn {chunk_length} giây...")

    # Tạo output folder
    if not os.path.exists(output_folder):
        os.makedirs(output_folder)

    # 2. Tạo temp directory cho copy chunks
    temp_dir = tempfile.mkdtemp()
    print(f"📁 Temp directory: {temp_dir}")

    # 3. Thử tạo chunks bằng copy (nhanh)
    print("\n🔄 Giai đoạn 1: Thử tạo chunks bằng copy (nhanh)...")
    copy_chunks = split_video_ffmpeg_accurate(input_path, temp_dir, chunk_length)

    # 4. Xử lý kết quả copy và re-encode nếu cần
    print("\n🔄 Giai đoạn 2: Xử lý các chunks không đạt yêu cầu...")
    final_chunks = []
    successful_copy = 0
    need_reencode = 0

    for i, chunk_info in enumerate(copy_chunks):
        start_time = i * chunk_length
        end_time = min((i + 1) * chunk_length, duration)
        final_path = os.path.join(
            output_folder, f"video_{int(start_time)}_{int(end_time)}.mp4"
        )

        if chunk_info is not None and os.path.exists(chunk_info):
            # Copy chunk thành công đến output folder
            shutil.copy2(chunk_info, final_path)
            final_chunks.append(final_path)
            successful_copy += 1
            print(f"  ✅ Chunk {i} ({start_time}s-{end_time}s): Copy thành công")
        else:
            # Cần re-encode chunk này
            print(f"  🔄 Chunk {i} ({start_time}s-{end_time}s): Đang re-encode...")
            success = create_chunk_reencode(
                input_path, final_path, start_time, end_time
            )
            if success:
                final_chunks.append(final_path)
                need_reencode += 1
                print(f"  ✅ Chunk {i}: Re-encode thành công")
            else:
                print(f"  ❌ Chunk {i}: Re-encode thất bại")
                # Vẫn thêm path nhưng chunk này sẽ bị bỏ qua khi xử lý
                final_chunks.append(final_path)

    # 5. Cleanup temp directory
    print("\n🧹 Đang dọn dẹp temp files...")
    for chunk in copy_chunks:
        if chunk is not None and os.path.exists(chunk):
            os.remove(chunk)
    try:
        os.rmdir(temp_dir)
    except:
        pass

    # 6. Thống kê kết quả
    total_chunks = len(final_chunks)
    valid_chunks = [chunk for chunk in final_chunks if os.path.exists(chunk)]

    print(f"\n📊 KẾT QUẢ CHIA ĐOẠN:")
    print(f"   • Tổng số chunks: {total_chunks}")
    print(f"   • Copy thành công: {successful_copy}")
    print(f"   • Re-encode thành công: {need_reencode}")
    print(f"   • Chunks valid: {len(valid_chunks)}/{total_chunks}")

    # Verify từng chunk cuối cùng
    print(f"\n🔍 Kiểm tra chất lượng chunks cuối cùng:")
    for i, chunk_path in enumerate(valid_chunks):
        cap = cv2.VideoCapture(chunk_path)
        frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
        fps = cap.get(cv2.CAP_PROP_FPS)
        duration = frames / fps if fps > 0 else 0
        cap.release()

        status = "✅" if frames >= 50 else "⚠️"  # Ít nhất 50 frames cho 5s chunk
        print(
            f"   {status} Chunk {i}: {frames} frames, {duration:.2f}s - {os.path.basename(chunk_path)}"
        )

    return valid_chunks
