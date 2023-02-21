package com.exxeta.wpgwn.wpgwnapp.email_opt_out;

import javax.persistence.EntityNotFoundException;
import javax.validation.constraints.NotNull;
import java.time.Clock;
import java.time.Instant;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;
import org.springframework.web.util.UriTemplate;

import lombok.RequiredArgsConstructor;

import com.exxeta.wpgwn.wpgwnapp.configuration.properties.WpgwnProperties;
import com.exxeta.wpgwn.wpgwnapp.email_opt_out.dto.EmailOptOutEntryDto;
import com.exxeta.wpgwn.wpgwnapp.email_opt_out.model.EmailOptOutEntry;

@Service
@RequiredArgsConstructor
public class EmailOptOutService {

    private final Clock clock;
    private final WpgwnProperties wpgwnProperties;
    private final EmailOptOutRepository emailOptOutRepository;

    /**
     * Lädt den Eintrag aus der Datenbank oder erstellt und speichert einen neuen Eintrag in der Datenbank.
     * Es wird immer gespeichert, weil die UUID für eine E-Mail immer fest sein muss, wenn die UUID in einer E-Mail
     * versendet wird.
     */
    public EmailOptOutEntry getByEmailAndCreateIfNotExists(@NonNull String email) {
        return emailOptOutRepository.findByEmail(email.toLowerCase())
                .orElseGet(() -> emailOptOutRepository.save(createNewEmailOptOutEntry(email)));
    }

    public EmailOptOutEntry getEmailOptOutOptionsForUUIDAndEmail(@NonNull UUID uuid, @NonNull String email) {
        final Optional<EmailOptOutEntry> potentialEntry =
                emailOptOutRepository.findByRandomUniqueIdAndEmail(uuid, email.toLowerCase());
        return potentialEntry.orElseThrow(() -> new EntityNotFoundException(
                String.format("Entity [%s] with uuid [%s] not found", "EmailOptOutOption", uuid)));
    }

    public EmailOptOutEntry setEmailOptOutOptionsForEmail(@NonNull String email,
                                                          @NonNull EmailOptOutEntryDto optOutEntryDto) {
        final EmailOptOutEntry entry = getByEmailAndCreateIfNotExists(email.toLowerCase());
        final Set<EmailOptOutOption> emailOptOutOptions = entry.getEmailOptOutOptions();
        emailOptOutOptions.clear();
        emailOptOutOptions.addAll(getOptOutableOptions(optOutEntryDto));
        return emailOptOutRepository.save(entry);
    }

    public EmailOptOutEntry setEmailOptOutOptionsForUUID(@NonNull UUID uuid,
                                                         @NonNull EmailOptOutEntryDto optOutEntryDto) {
        final EmailOptOutEntry entry = getEmailOptOutOptionsForUUIDAndEmail(uuid, optOutEntryDto.getEmail().toLowerCase());
        final Set<EmailOptOutOption> emailOptOutOptions = entry.getEmailOptOutOptions();
        emailOptOutOptions.clear();
        emailOptOutOptions.addAll(getOptOutableOptions(optOutEntryDto));
        return emailOptOutRepository.save(entry);
    }

    private EmailOptOutEntry createNewEmailOptOutEntry(@NonNull String email) {
        final EmailOptOutEntry result = new EmailOptOutEntry();
        result.setEmail(email.toLowerCase());
        result.setRandomUniqueId(UUID.randomUUID());
        result.setRandomIdGenerationTime(Instant.now(clock));
        return result;
    }

    private Set<EmailOptOutOption> getOptOutableOptions(EmailOptOutEntryDto optOutEntryDto) {
        return optOutEntryDto.getEmailOptOutOptions().stream()
                .filter(EmailOptOutOption::isOptOutable)
                .collect(Collectors.toSet());
    }

    public boolean sendEMail(String email, @NotNull EmailOptOutOption optOutOption) {
        return !emailOptOutRepository.existsByEmailAndEmailOptOutOptionsContaining(email.toLowerCase(), optOutOption);
    }

    public String getOptOutLink(@NonNull String email) {
        return new UriTemplate(wpgwnProperties.getOptOutUrl())
                .expand(getByEmailAndCreateIfNotExists(email).getRandomUniqueId(), email.toLowerCase())
                .toString();
    }
}
