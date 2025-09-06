package com.mahala.khiemthinh.service.impl;

import com.mahala.khiemthinh.dto.request.UserDTO;
import com.mahala.khiemthinh.dto.response.PageResponse;
import com.mahala.khiemthinh.model.Role;
import com.mahala.khiemthinh.model.User;
import com.mahala.khiemthinh.repository.RoleRepository;
import com.mahala.khiemthinh.repository.UserRepository;
import com.mahala.khiemthinh.service.UserService;
import com.mahala.khiemthinh.util.JWTToken;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final AuthenticationManager authenticationManager;
    private final JWTToken jwtToken;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void save(UserDTO userDTO) throws Exception {
        User user = this.userRepository.findByEmail(userDTO.getEmail()).orElse(null);
        Role role = this.roleRepository.findById(1L).orElse(null);
        if (user != null) {
            throw new Exception("User is exist");
        }
        User newUser = User.builder()
                .address(userDTO.getAddress())
                .role(role)
                .email(userDTO.getEmail())
                .password(passwordEncoder.encode(userDTO.getPassword()))
                .fullName(userDTO.getFullName())
                .dateOfBirth(userDTO.getDateOfBirth())
                .gender(userDTO.getGender())
                .phone(userDTO.getPhone())
                .build();
        this.userRepository.save(newUser);
    }

    @Override
    public String login(String email, String password) throws Exception {
        User user = this.userRepository.findByEmail(email).orElse(null);
        if (user == null) {
            throw new UsernameNotFoundException("User not found");
        }
        if (!this.passwordEncoder.matches(password, user.getPassword())) {
            throw new BadCredentialsException("Wrong password");
        }
        UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(user.getEmail(), password, user.getAuthorities());
        this.authenticationManager.authenticate(authenticationToken);
        String token = this.jwtToken.generateToken(user);
        return token;
    }

    @Override
    public PageResponse<?> getUsers(int page, int size, String search) throws Exception {
        page = page > 0 ? page - 1 : 0;
        Pageable pageable = PageRequest.of(page , size) ;
        Specification<User> specification = (root, query, criteriaBuilder) -> {
            if (search != null && !search.trim().isEmpty()) {
                String searchPattern = "%" + search.toLowerCase() + "%";
                return criteriaBuilder.equal(criteriaBuilder.lower(root.get("fullName")), searchPattern);
            }
            return criteriaBuilder.conjunction();
        } ;
        Page<User> pages = this.userRepository.findAll(specification, pageable);
        List<UserDTO> result = pages.getContent().stream().map(item -> UserDTO.builder()
                .id(item.getId())
                .email(item.getEmail())
                .fullName(item.getFullName())
                .dateOfBirth(item.getDateOfBirth())
                .gender(item.getGender())
                .phone(item.getPhone())
                .address(item.getAddress())
                .build()).collect(Collectors.toList()) ;
        return PageResponse.builder()
                .totalPages(pages.getTotalPages())
                .pageNo(page + 1)
                .pageSize(size)
                .items(result)
                .build();
    }

    @Override
    public UserDTO getUserById(Long id) throws Exception {
        User user = this.userRepository.findById(id).orElseThrow(() -> new Exception("User not found with id : " + id));
        UserDTO result = UserDTO.builder()
                .fullName(user.getFullName())
                .dateOfBirth(user.getDateOfBirth())
                .gender(user.getGender())
                .phone(user.getPhone())
                .address(user.getAddress())
                .build();
        return result;
    }

    @Override
    public UserDTO getUserByEmail(String email) throws Exception {
        User user = this.userRepository.findByEmail(email).orElseThrow(() -> new Exception("User not found with email : " + email));
        UserDTO result = UserDTO.builder()
                .fullName(user.getFullName())
                .dateOfBirth(user.getDateOfBirth())
                .gender(user.getGender())
                .phone(user.getPhone())
                .address(user.getAddress())
                .build();
        return result;
    }

    @Override
    public void updateUser(Long id ,UserDTO userDTO) throws Exception {
        User userOld = this.userRepository.findById(id).orElseThrow(() -> new Exception("User not found with id : " + id));
        userOld.setFullName(userDTO.getFullName());
        userOld.setDateOfBirth(userDTO.getDateOfBirth());
        userOld.setGender(userDTO.getGender());
        userOld.setPhone(userDTO.getPhone());
        userOld.setAddress(userDTO.getAddress());
        this.userRepository.save(userOld);
    }

    @Override
    public void deleteUser(Long id) throws Exception {
        User userOld = this.userRepository.findById(id).orElseThrow(() -> new Exception("User not found with id : " + id));
        this.userRepository.delete(userOld);
    }
}
