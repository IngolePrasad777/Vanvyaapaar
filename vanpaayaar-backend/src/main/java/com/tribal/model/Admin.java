package com.tribal.model;

import jakarta.persistence.Entity;
import jakarta.persistence.PrimaryKeyJoinColumn;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

@Entity
@Getter
@Setter
@NoArgsConstructor
//@AllArgsConstructor
@SuperBuilder
@Table(name = "admins")
@PrimaryKeyJoinColumn(name = "user_id")
public class Admin extends Base {

}
