package com.example.demo.visit;

import com.example.demo.appuser.AppUser;
import com.example.demo.service.SingleService;
import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import javax.persistence.*;
import java.sql.Date;
import java.time.LocalDateTime;
import java.util.Collection;
import java.util.Collections;

@Getter
@Setter
@EqualsAndHashCode
@NoArgsConstructor
@Entity
public class Visit {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private LocalDateTime startTime;

    @ManyToOne
    @JoinColumn(nullable = false, name = "client")
    private AppUser client;

    @ManyToOne
    @JoinColumn(nullable = false, name = "employee")
    private AppUser employee;

    @ManyToOne
    @JoinColumn(nullable = false, name = "service")
    private SingleService service;

    @JsonCreator
    public Visit(@JsonProperty("startTime") LocalDateTime startTime, @JsonProperty("client") AppUser client, @JsonProperty("employee") AppUser employee, @JsonProperty("service")  SingleService service) {
        this.startTime = startTime;
        this.client = client;
        this.employee = employee;
        this.service = service;
    }


    public LocalDateTime getStartTime() {
        return startTime;
    }

    public void setStartTime(LocalDateTime startTime) {
        this.startTime = startTime;
    }

    public AppUser getClient() {
        return client;
    }

    public void setClient(AppUser client) {
        this.client = client;
    }

    public AppUser getEmployee() {
        return employee;
    }

    public void setEmployee(AppUser employee) {
        this.employee = employee;
    }

    public SingleService getService() {
        return service;
    }

    public void setService(SingleService service) {
        this.service = service;
    }


}
