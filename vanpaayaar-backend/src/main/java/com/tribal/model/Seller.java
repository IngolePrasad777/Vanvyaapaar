package com.tribal.model;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;


@Entity
@Table(name = "sellers")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@PrimaryKeyJoinColumn(name = "user_id")
public class Seller extends Base {

    @Column(length = 100)
    protected String tribeName;

    @Column(length = 100)
    protected String artisanCategory;

    @Column(length = 150)
    protected String region;

    @Lob
    protected String bio;

    @Column(length = 30)
    protected String bankAccountNumber;

    @Column(length = 20)
    protected String ifscCode;

    @Column(length = 30)
    protected String panNumber;

    @Column(nullable = false)
    protected boolean termsAccepted = false;

    @Column(nullable = false)
    protected boolean consentAccepted = false;

    @Column(length = 20)
    private String adminApprovalStatus = "PENDING"; // PENDING / APPROVED / REJECTED

    @PrePersist
    public void prePersist() {
        if (this.adminApprovalStatus == null) {
            this.adminApprovalStatus = "PENDING";
        }
    }
}


