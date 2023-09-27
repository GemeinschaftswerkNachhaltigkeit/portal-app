package com.exxeta.wpgwn.wpgwnapp.email_opt_out;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.querydsl.QuerydslPredicateExecutor;

import com.exxeta.wpgwn.wpgwnapp.email_opt_out.model.EmailOptOutEntry;

public interface EmailOptOutRepository extends JpaRepository<EmailOptOutEntry, Long>,
        QuerydslPredicateExecutor<EmailOptOutEntry> {

    Optional<EmailOptOutEntry> findByEmail(String email);

    Optional<EmailOptOutEntry> findByRandomUniqueIdAndEmail(UUID uuid, String email);

    boolean existsByEmailAndEmailOptOutOptionsContaining(String email, EmailOptOutOption emailOptOutOption);
}
