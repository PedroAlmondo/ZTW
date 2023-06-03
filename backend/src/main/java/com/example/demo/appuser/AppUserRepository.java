package com.example.demo.appuser;

import com.example.demo.visit.Visit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Repository
@Transactional(readOnly = true)
public interface AppUserRepository
        extends JpaRepository<AppUser, Long> {

    Optional<AppUser> findByEmail(String email);

    @Transactional
    @Modifying
    @Query("UPDATE AppUser a " +
            "SET a.enabled = TRUE WHERE a.email = ?1")
    int enableAppUser(String email);

    @Query("SELECT a FROM AppUser a WHERE a.id = :id AND a.appUserRole = :role")
    AppUser findByEmployeeId(@Param("id") Long id, @Param("role") AppUserRole role);

    @Query("SELECT a FROM AppUser a WHERE a.appUserRole = :role")
    List<AppUser> findAllWorkers(@Param("role") AppUserRole role);

}
