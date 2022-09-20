package org.example.auctionhouse.model;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.example.auctionhouse.enums.RoleTypes;

import javax.persistence.*;
import java.util.Set;

@Entity
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property="id")
@Table(name = "role")
@NoArgsConstructor
@Getter
@Setter
public class Role {
    @Id
    @GeneratedValue
    private Long id;

    @Enumerated
    @Column(nullable = false)
    private RoleTypes name;

    @JsonIgnore
    @OneToMany(targetEntity = User.class, mappedBy = "role", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private Set<User> users;

    public Role(RoleTypes name) {
        this.name = name;
    }
}