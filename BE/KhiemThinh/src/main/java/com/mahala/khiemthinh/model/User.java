package com.mahala.khiemthinh.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "user")
@Data
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id ;

    @Column(name = "username")
    private String username ;

    @Column(name = "password")
    private String password ;

    @Column(name = "full_name")
    private String fullName ;

    @Column(name = "phone")
    private String phone ;

    @Column(name = "address")
    private String address ;

    @Column(name = "gender")
    private String gender ;

    @Column(name = "date_of_birth")
    private LocalDate dateOfBirth ;

    @ManyToMany
    @JoinTable(
            name = "user_role" ,
            joinColumns = @JoinColumn(name = "user_id") ,
            inverseJoinColumns = @JoinColumn(name = "role_id")
    )
    private List<Role> roles ;

    @ManyToMany(mappedBy = "users")
    private List<Word> words ;
}
