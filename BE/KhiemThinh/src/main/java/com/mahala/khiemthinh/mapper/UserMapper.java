package com.mahala.khiemthinh.mapper;

import com.mahala.khiemthinh.dto.request.UserDTO;
import com.mahala.khiemthinh.model.User;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring") // để Spring quản lý Bean
public interface UserMapper {

    UserMapper INSTANCE = Mappers.getMapper(UserMapper.class);

    UserDTO toDTO(User user);
    User toEntity(UserDTO userDTO);
}
