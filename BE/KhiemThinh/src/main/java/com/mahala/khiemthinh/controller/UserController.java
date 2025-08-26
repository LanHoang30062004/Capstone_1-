package com.mahala.khiemthinh.controller;

import com.mahala.khiemthinh.dto.request.AuthenDTO;
import com.mahala.khiemthinh.dto.request.UserDTO;
import com.mahala.khiemthinh.dto.response.PageResponse;
import com.mahala.khiemthinh.dto.response.ResponseData;
import com.mahala.khiemthinh.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("${api.prefix}/user")
@RequiredArgsConstructor
@Validated
@Slf4j
@Tag(name = "API cho user")
public class UserController {
    private final UserService userService;

    @GetMapping("")
    @Operation(summary = "Lay danh sach cac user" , description = "API co phan trang va tim kiem dua tren full name (optional)")
    public ResponseData<?> getUsers (@RequestParam(name = "page") int page,
                                     @RequestParam(name = "size") int size ,
                                     @RequestParam(required = false) String search
                                     ) {
        try {
            PageResponse result = this.userService.getUsers(page, size, search);
            log.info("Get all user successful");
            return new ResponseData<>(HttpStatus.OK.value(), "Get all user successful", result);
        }
        catch (Exception e){
            log.error("Get all user failed : {}" , e.getMessage());
            return new ResponseData<>(HttpStatus.INTERNAL_SERVER_ERROR.value(), e.getMessage(), null);
        }
    }

    @Operation(summary = "Dang nhap")
    @PostMapping("/login")
    public ResponseData<?> login(@Valid @RequestBody AuthenDTO userDTO) {
        try {
            return new ResponseData<>(HttpStatus.OK.value(), "Login successful", this.userService.login(userDTO.getEmail(), userDTO.getPassword()));
        } catch (Exception e) {
            log.error("Can not login : {}", e.getMessage());
            return new ResponseData<>(HttpStatus.UNAUTHORIZED.value(), "Can not login : " + e.getMessage());
        }
    }

    @PostMapping("/register")
    @Operation(summary = "Dang ky")
    public ResponseData<?> register(@Valid @RequestBody UserDTO userDTO) {
        try {
            this.userService.save(userDTO);
            log.info("User registered successfully");
            return new ResponseData<>(HttpStatus.OK.value(), "User registered successfully");

        } catch (Exception e) {
            log.error("Can not register : {}", e.getMessage());
            return new ResponseData<>(HttpStatus.UNAUTHORIZED.value(), e.getMessage());
        }
    }

    @PostMapping("")
    @Operation(summary = "Them moi admin")
    public ResponseData<?> addNewAdmin (@Valid @RequestBody UserDTO userDTO) {
        try{

        }
        catch (Exception e){

        }
        return null ;

    }
    @PatchMapping("/{id}")
    @Operation(summary = "Cap nhat user dua tren user id")
    public ResponseData<?> updateUser(@PathVariable("id") Long id, @Valid @RequestBody UserDTO userDTO) {
        try {

        }
        catch (Exception e){}
        return null ;
    }
    @DeleteMapping("/{id}")
    @Operation(summary = "Xoa user dua tren id user")
    public ResponseData<?> deleteUser(@PathVariable Long id) {
        try {

        }
        catch (Exception e){}
        return null ;
    }
}
