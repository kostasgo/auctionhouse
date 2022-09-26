package org.example.auctionhouse.controller;

import org.apache.commons.io.FilenameUtils;
import org.springframework.core.io.ClassPathResource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StreamUtils;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@RequestMapping("/media")
@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
public class ImageController {

    @GetMapping("/auction/{filepath}")
    public ResponseEntity<byte[]> getImage(@PathVariable String filepath)  throws IOException {

        var imgFile = new ClassPathResource("auction/" + filepath);

        String extension = FilenameUtils.getExtension(filepath);
        MediaType type;
        switch(extension) {
            case "png":
                type = MediaType.IMAGE_PNG;
                break;
            case "jpeg":
                type = MediaType.IMAGE_JPEG;
                break;
            case "gif":
                type = MediaType.IMAGE_GIF;
                break;
            default:
                type = MediaType.IMAGE_JPEG;
        }
        byte[] bytes = StreamUtils.copyToByteArray(imgFile.getInputStream());

        return ResponseEntity
                .ok()
                .contentType(type)
                .body(bytes);
    }
}
