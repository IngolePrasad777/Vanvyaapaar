package com.tribal.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "complaints")
public class Complaint {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String fromType; // BUYER or SELLER
    private String message;
    private String status = "OPEN";
    private LocalDateTime createdAt = LocalDateTime.now();

    // Getters and Setters
}

