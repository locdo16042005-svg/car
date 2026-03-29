package com.tanloc.carmanagement.controller;

import com.tanloc.carmanagement.service.UploadService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/upload")
public class UploadController {

    private final UploadService uploadService;

    public UploadController(UploadService uploadService) {
        this.uploadService = uploadService;
    }

    @PostMapping("/image")
    public ResponseEntity<Map<String, Object>> uploadImage(
            @RequestParam("file") MultipartFile file) throws IOException {
        String url = uploadService.uploadImage(file);
        return ResponseEntity.ok(Map.of("success", true, "data", Map.of("url", url)));
    }

    @PostMapping("/images")
    public ResponseEntity<Map<String, Object>> uploadImages(
            @RequestParam("files") List<MultipartFile> files) throws IOException {
        List<String> urls = uploadService.uploadImages(files);
        return ResponseEntity.ok(Map.of("success", true, "data", Map.of("urls", urls)));
    }
}
