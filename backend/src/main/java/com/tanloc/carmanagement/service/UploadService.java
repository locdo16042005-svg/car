package com.tanloc.carmanagement.service;

import com.tanloc.carmanagement.exception.BusinessException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@Service
public class UploadService {

    private static final Set<String> ALLOWED_CONTENT_TYPES = Set.of(
            "image/jpeg", "image/png", "image/webp"
    );
    private static final long MAX_FILE_SIZE = 5L * 1024 * 1024; // 5MB
    private static final int MAX_FILES = 10;

    @Value("${app.upload.dir:./uploads}")
    private String uploadDir;

    public String uploadImage(MultipartFile file) throws IOException {
        validateFile(file);
        return saveFile(file);
    }

    public List<String> uploadImages(List<MultipartFile> files) throws IOException {
        if (files == null || files.isEmpty()) {
            throw new BusinessException("Không có file nào được gửi lên", "NO_FILES", HttpStatus.UNPROCESSABLE_ENTITY);
        }
        if (files.size() > MAX_FILES) {
            throw new BusinessException(
                    "Tối đa " + MAX_FILES + " file mỗi lần tải lên",
                    "TOO_MANY_FILES",
                    HttpStatus.valueOf(422)
            );
        }
        for (MultipartFile file : files) {
            validateFile(file);
        }
        List<String> urls = new ArrayList<>();
        for (MultipartFile file : files) {
            urls.add(saveFile(file));
        }
        return urls;
    }

    private void validateFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new BusinessException("File không được để trống", "EMPTY_FILE", HttpStatus.BAD_REQUEST);
        }
        String contentType = file.getContentType();
        if (contentType == null || !ALLOWED_CONTENT_TYPES.contains(contentType)) {
            throw new BusinessException(
                    "Định dạng file không hợp lệ. Chỉ chấp nhận JPG, PNG, WEBP",
                    "INVALID_FILE_TYPE",
                    HttpStatus.UNSUPPORTED_MEDIA_TYPE
            );
        }
        if (file.getSize() > MAX_FILE_SIZE) {
            throw new BusinessException(
                    "Kích thước file vượt quá 5MB",
                    "FILE_TOO_LARGE",
                    HttpStatus.valueOf(413)
            );
        }
    }

    private String saveFile(MultipartFile file) throws IOException {
        LocalDate now = LocalDate.now();
        String year = String.valueOf(now.getYear());
        String month = String.format("%02d", now.getMonthValue());

        Path dirPath = Paths.get(uploadDir, year, month);
        Files.createDirectories(dirPath);

        String originalFilename = file.getOriginalFilename();
        String extension = "";
        if (originalFilename != null && originalFilename.contains(".")) {
            extension = originalFilename.substring(originalFilename.lastIndexOf("."));
        } else {
            // Fallback extension from content type (contentType is validated non-null before this point)
            String ct = file.getContentType();
            extension = switch (ct != null ? ct : "image/jpeg") {
                case "image/png" -> ".png";
                case "image/webp" -> ".webp";
                default -> ".jpg";
            };
        }

        String filename = UUID.randomUUID() + extension;
        Path filePath = dirPath.resolve(filename);
        Files.copy(file.getInputStream(), filePath);

        return "/uploads/" + year + "/" + month + "/" + filename;
    }
}
