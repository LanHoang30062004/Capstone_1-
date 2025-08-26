package com.mahala.khiemthinh.model;

import jakarta.persistence.*;
import lombok.Data;

import java.util.List;

@Entity
@Table(name = "role")
@Data
public class Role {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id ;
    @Column(name = "role_name")
    private String roleName ;

    @OneToMany(fetch = FetchType.EAGER, mappedBy = "role")
    private List<User> users ;
}
