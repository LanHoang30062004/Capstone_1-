package com.mahala.khiemthinh.config;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class CloudinaryConfig {
    @Bean
    public Cloudinary cloudinary() {
        return new Cloudinary(ObjectUtils.asMap(
                "cloud_name", "di8gdbmwp",
                "api_key", "964183676982221",
                "api_secret", "jl1PxNNQW_sCaZusorsNahIfruk",
                "secure", true
        ));
    }
}
