package com.mahala.khiemthinh.service;

import com.mahala.khiemthinh.dto.request.AdminDTO;
import com.mahala.khiemthinh.dto.request.LoginDTO;
import com.mahala.khiemthinh.dto.request.UserDTO;
import com.mahala.khiemthinh.dto.response.PageResponse;
import org.springframework.stereotype.Service;

@Service
public interface UserService {
    public void save(UserDTO user) throws Exception;

    public LoginDTO login(String email, String password) throws Exception;

    PageResponse<?> getUsers(int page , int size , String search) throws Exception;

    UserDTO getUserById(Long id) throws Exception;

    UserDTO getUserByEmail(String email) throws Exception;


    void updateUser(String email , UserDTO user) throws Exception;

    void deleteUser(Long id) throws Exception;

    void addNewAdmin (AdminDTO adminDTO) throws Exception;

}
