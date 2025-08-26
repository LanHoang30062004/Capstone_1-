package com.mahala.khiemthinh.service.impl;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.mahala.khiemthinh.model.Word;
import com.mahala.khiemthinh.repository.WordRepository;
import com.mahala.khiemthinh.service.TranslateService;
import lombok.RequiredArgsConstructor;
import org.apache.commons.io.FileUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.File;
import java.io.IOException;
import java.io.PrintWriter;
import java.net.URL;
import java.util.*;

@Service
@Transactional
@RequiredArgsConstructor
public class TranslateServiceImpl implements TranslateService {

    private final WordRepository wordRepository;
    private final Cloudinary cloudinary;

    private Map<String, String> loadAvailableVideoNames() {
        Map<String, String> result = new HashMap<>();
        for (Word word : wordRepository.findAll()) {
            result.put(word.getWordName().toLowerCase(), word.getVideoUrl());
        }
        return result;
    }

    private List<String> greedyMatch(String input, Set<String> dict) {
        List<String> result = new ArrayList<>();
        String[] words = input.split("\\s+");
        int i = 0;
        while (i < words.length) {
            boolean matched = false;
            for (int j = words.length; j > i; j--) {
                String phrase = String.join(" ", Arrays.copyOfRange(words, i, j));
                if (dict.contains(phrase)) {
                    result.add(phrase);
                    i = j;
                    matched = true;
                    break;
                }
            }
            if (!matched) {
                i++;
            }
        }
        return result;
    }

    @Override
    public String translate(String inputText) {
        File tempDir = null;
        try {
            inputText = inputText.trim().toLowerCase();

            // B1: Lấy map từ DB (word_name → video_url)
            Map<String, String> videoMap = loadAvailableVideoNames();

            // B2: Greedy match
            List<String> matchedPhrases = greedyMatch(inputText, videoMap.keySet());

            // B3: Lấy danh sách video url
            List<String> videoUrls = new ArrayList<>();
            for (String phrase : matchedPhrases) {
                videoUrls.add(videoMap.get(phrase));
            }
            if (videoUrls.isEmpty()) {
                return null; // hoặc throw exception tùy bạn
            }

            String uuid = UUID.randomUUID().toString();
            tempDir = new File(System.getProperty("java.io.tmpdir"), "translate_" + uuid);
            if (!tempDir.exists()) {
                tempDir.mkdirs();
            }

            // B5: Download video vào thư mục tạm
            List<File> downloadedFiles = new ArrayList<>();
            for (int i = 0; i < videoUrls.size(); i++) {
                File file = new File(tempDir, "video_" + i + ".mp4");
                FileUtils.copyURLToFile(new URL(videoUrls.get(i)), file);
                downloadedFiles.add(file);
            }

            // B6: Merge video
            File mergedFile = new File(tempDir, "merged_output.mp4");
            mergeVideos(downloadedFiles, mergedFile);

            // B7: Upload lên Cloudinary
            Map uploadResult = cloudinary.uploader().upload(mergedFile, ObjectUtils.asMap(
                    "resource_type", "video",
                    "folder", "Capstone1"
            ));

            return (String) uploadResult.get("secure_url");

        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Translate failed", e);

        } finally {
            if (tempDir != null && tempDir.exists()) {
                try {
                    FileUtils.deleteDirectory(tempDir);
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }
    }


    // Hàm merge video bằng ffmpeg
    private void mergeVideos(List<File> inputFiles, File outputFile) throws IOException, InterruptedException {
        // Tạo file list.txt chứa danh sách video input
        File listFile = new File("list.txt");
        try (PrintWriter writer = new PrintWriter(listFile)) {
            for (File f : inputFiles) {
                writer.println("file '" + f.getAbsolutePath() + "'");
            }
        }

        // Gọi lệnh ffmpeg
        ProcessBuilder pb = new ProcessBuilder("ffmpeg", "-f", "concat", "-safe", "0",
                "-i", listFile.getAbsolutePath(), "-c", "copy", outputFile.getAbsolutePath());
        pb.inheritIO();
        Process process = pb.start();
        process.waitFor();
    }
}
