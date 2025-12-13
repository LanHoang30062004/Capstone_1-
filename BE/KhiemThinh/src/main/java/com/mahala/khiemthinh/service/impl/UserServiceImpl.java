package com.mahala.khiemthinh.service.impl;

import com.mahala.khiemthinh.dto.request.AdminDTO;
import com.mahala.khiemthinh.dto.request.UserDTO;
import com.mahala.khiemthinh.dto.response.PageResponse;
import com.mahala.khiemthinh.exception.NotFoundException;
import com.mahala.khiemthinh.model.Role;
import com.mahala.khiemthinh.model.User;
import com.mahala.khiemthinh.repository.RoleRepository;
import com.mahala.khiemthinh.repository.UserRepository;
import com.mahala.khiemthinh.service.UserService;
import com.mahala.khiemthinh.util.JWTToken;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.Instant;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
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
    private final JavaMailSender javaMailSender ;
    private static final char[] SPECIAL_CHARS = {
            '!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '-', '_', '+', '='
    };

    private static final SecureRandom secureRandom = new SecureRandom();

    private static String generatePassword(String email) {
        if (email == null || email.trim().isEmpty()) {
            throw new IllegalArgumentException("Email không được để trống");
        }

        char special = SPECIAL_CHARS[secureRandom.nextInt(SPECIAL_CHARS.length)];

        DateTimeFormatter fmt = DateTimeFormatter.ofPattern("yyyyMMddHHmmss")
                .withZone(ZoneId.of("Asia/Ho_Chi_Minh"));
        String timestamp = fmt.format(Instant.now());

        return email + special + timestamp;
    }

    private void sendSimpleEmail(String to , String password) throws MessagingException, NotFoundException {
        MimeMessage mimeMessage = this.javaMailSender.createMimeMessage() ;
        MimeMessageHelper mimeMessageHelper = new MimeMessageHelper(mimeMessage, true);
        mimeMessageHelper.setTo(to);
        mimeMessageHelper.setSubject("NEW PASSWORD");
        mimeMessageHelper.setText("Password : " + password, true);
        javaMailSender.send(mimeMessage);
    }
    @Override
    public void save(UserDTO userDTO) throws Exception {
        User user = this.userRepository.findByEmail(userDTO.getEmail()).orElse(null);
        Role role = this.roleRepository.findById(1L).orElse(null);
        if (user != null) {
            throw new Exception("Người dùng đã tồn tại");
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
            throw new UsernameNotFoundException("Không tìm thấy người dùng");
        }
        if (!this.passwordEncoder.matches(password, user.getPassword())) {
            throw new BadCredentialsException("Sai mật khẩu");
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
                return criteriaBuilder.like(criteriaBuilder.lower(root.get("fullName")), searchPattern);
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
        User user = this.userRepository.findById(id).orElseThrow(() -> new Exception("Không tìm thấy người dùng với ID : " + id));
        UserDTO result = UserDTO.builder()
                .id(user.getId())
                .email(user.getEmail())
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
        User user = this.userRepository.findByEmail(email).orElseThrow(() -> new Exception("Không tìm thấy người dùng với email : " + email));
        UserDTO result = UserDTO.builder()
                .id(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .dateOfBirth(user.getDateOfBirth())
                .gender(user.getGender())
                .phone(user.getPhone())
                .address(user.getAddress())
                .build();
        return result;
    }

    @Override
    public void updateUser(String email , UserDTO userDTO) throws Exception {
        User userOld = this.userRepository.findByEmail(email).orElseThrow(() -> new Exception("Không tìm thấy người dùng với email : " + email));
        userOld.setFullName(userDTO.getFullName());
        userOld.setDateOfBirth(userDTO.getDateOfBirth());
        userOld.setGender(userDTO.getGender());
        userOld.setPhone(userDTO.getPhone());
        userOld.setAddress(userDTO.getAddress());
        this.userRepository.save(userOld);
    }

    @Override
    public void deleteUser(Long id) throws Exception {
        User userOld = this.userRepository.findById(id).orElseThrow(() -> new Exception("Không tìm thấy người dùng với ID : " + id));
        this.userRepository.delete(userOld);
    }

    @Override
    public void addNewAdmin(AdminDTO adminDTO) throws Exception {
        Role role = this.roleRepository.findByRoleName("ADMIN").orElseThrow(() -> new NotFoundException("Không thể tìm thấy vai trò")) ;
        User admin = this.userRepository.findByEmail(adminDTO.getEmail()).orElse(null) ;
        User newAdmin = new User() ;
        if (admin != null) {
            throw new Exception("Admin đã tồn tại với email này :" + adminDTO.getEmail());
        }
        newAdmin.setEmail(adminDTO.getEmail());
        newAdmin.setFullName(adminDTO.getFullName());
        newAdmin.setDateOfBirth(adminDTO.getDateOfBirth());
        newAdmin.setGender(adminDTO.getGender());
        newAdmin.setPhone(adminDTO.getPhone());
        newAdmin.setAddress(adminDTO.getAddress());
        newAdmin.setRole(role);
        String password = generatePassword(adminDTO.getEmail());
        newAdmin.setPassword(this.passwordEncoder.encode(password));
        this.userRepository.save(newAdmin) ;
        this.sendSimpleEmail(adminDTO.getEmail(),password);

    }

}
