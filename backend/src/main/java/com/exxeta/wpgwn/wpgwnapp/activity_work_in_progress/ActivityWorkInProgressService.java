package com.exxeta.wpgwn.wpgwnapp.activity_work_in_progress;

import javax.persistence.EntityNotFoundException;
import java.io.IOException;
import java.util.Objects;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import com.exxeta.wpgwn.wpgwnapp.activity.model.Activity;
import com.exxeta.wpgwn.wpgwnapp.files.FileStorageService;
import com.exxeta.wpgwn.wpgwnapp.organisation.model.Organisation;
import com.exxeta.wpgwn.wpgwnapp.organisation_work_in_progress.OrganisationWorkInProgress;
import com.exxeta.wpgwn.wpgwnapp.shared.model.Contact;
import com.exxeta.wpgwn.wpgwnapp.shared.model.ContactWorkInProgress;

import com.querydsl.core.types.Predicate;

@Service
@RequiredArgsConstructor
@Slf4j
public class ActivityWorkInProgressService {

    private final ActivityWorkInProgressRepository workInProgressRepository;

    private final FileStorageService fileStorageService;

    public Optional<ActivityWorkInProgress> maybeFindByRandomUniqueId(UUID randomUniqueId) {
        return workInProgressRepository.findByRandomUniqueId(randomUniqueId);
    }

    public ActivityWorkInProgress findByRandomUniqueId(UUID randomUniqueId) {
        return workInProgressRepository.findByRandomUniqueId(randomUniqueId)
                .orElseThrow(() -> new EntityNotFoundException(
                        String.format("Entity [%s] with id [%s] not found", "ActivityWorkInProgress",
                                randomUniqueId)));
    }

    public Page<ActivityWorkInProgress> findByOrganisation(Organisation organisation, Pageable pageable) {
        return workInProgressRepository.findAllByOrganisation(organisation, pageable);
    }

    public Page<ActivityWorkInProgress> findByPredicate(Predicate predicate, Pageable pageable) {
        return workInProgressRepository.findAll(predicate, pageable);
    }

    public ActivityWorkInProgress save(ActivityWorkInProgress activityWorkInProgress) {
        return workInProgressRepository.save(activityWorkInProgress);
    }

    public void delete(ActivityWorkInProgress activityWorkInProgress) {
        try {
            deleteActivityLogo(activityWorkInProgress);
            deleteActivityImage(activityWorkInProgress);
            deleteActivityContactImage(activityWorkInProgress);
        } catch (IOException e) {
            log.warn("Unexpected error deleting images", e);
        }

        workInProgressRepository.delete(activityWorkInProgress);
    }

    public ActivityWorkInProgress saveActivityLogo(ActivityWorkInProgress activityWorkInProgress, MultipartFile file)
            throws IOException {
        final String filename = fileStorageService.saveFile(file);
        final String logo = activityWorkInProgress.getLogo();
        if (Objects.isNull(activityWorkInProgress.getActivity())
                || !Objects.equals(activityWorkInProgress.getActivity().getLogo(), logo)) {
            fileStorageService.deleteFileIfPresent(logo);
        }
        activityWorkInProgress.setLogo(filename);
        return workInProgressRepository.save(activityWorkInProgress);
    }

    public ActivityWorkInProgress deleteActivityLogo(ActivityWorkInProgress activityWorkInProgress)
            throws IOException {
        final String logo = activityWorkInProgress.getLogo();
        if (Objects.isNull(activityWorkInProgress.getActivity())
                || !Objects.equals(activityWorkInProgress.getActivity().getLogo(), logo)) {
            fileStorageService.deleteFileIfPresent(logo);
        }
        activityWorkInProgress.setLogo(null);
        return workInProgressRepository.save(activityWorkInProgress);
    }

    public ActivityWorkInProgress saveActivityImage(ActivityWorkInProgress activityWorkInProgress, MultipartFile file)
            throws IOException {
        final String filename = fileStorageService.saveFile(file);
        final String image = activityWorkInProgress.getImage();

        if (Objects.isNull(activityWorkInProgress.getActivity())
                || !Objects.equals(activityWorkInProgress.getActivity().getImage(), image)) {
            fileStorageService.deleteFileIfPresent(image);
        }

        activityWorkInProgress.setImage(filename);
        return workInProgressRepository.save(activityWorkInProgress);
    }

    public ActivityWorkInProgress deleteActivityImage(ActivityWorkInProgress activityWorkInProgress)
            throws IOException {
        final String image = activityWorkInProgress.getImage();
        if (Objects.isNull(activityWorkInProgress.getActivity())
                || !Objects.equals(activityWorkInProgress.getActivity().getImage(), image)) {
            fileStorageService.deleteFileIfPresent(image);
        }
        activityWorkInProgress.setImage(null);
        return workInProgressRepository.save(activityWorkInProgress);
    }

    public ActivityWorkInProgress saveActivityContactImage(ActivityWorkInProgress activityWorkInProgress,
                                                           MultipartFile file) throws IOException {
        final String filename = fileStorageService.saveFile(file);
        final ContactWorkInProgress activityWorkInProgressContactWorkInProgress =
                cleanAndGetContactWorkInProgress(activityWorkInProgress);

        activityWorkInProgressContactWorkInProgress.setImage(filename);
        return workInProgressRepository.save(activityWorkInProgress);
    }

    public ActivityWorkInProgress deleteActivityContactImage(ActivityWorkInProgress activityWorkInProgress)
            throws IOException {
        final ContactWorkInProgress activityWorkInProgressContactWorkInProgress =
                cleanAndGetContactWorkInProgress(activityWorkInProgress);
        activityWorkInProgressContactWorkInProgress.setImage(null);
        return workInProgressRepository.save(activityWorkInProgress);
    }

    @NonNull
    private ContactWorkInProgress cleanAndGetContactWorkInProgress(ActivityWorkInProgress activityWorkInProgress)
            throws IOException {
        final ContactWorkInProgress activityWorkInProgressContactWorkInProgress =
                getContactWorkInProgress(activityWorkInProgress);
        final String contactImage = activityWorkInProgressContactWorkInProgress.getImage();
        if (Objects.isNull(activityWorkInProgress.getActivity())
                || !Objects.equals(Optional.of(activityWorkInProgress)
                .map(ActivityWorkInProgress::getActivity)
                .map(Activity::getContact)
                .map(Contact::getImage).orElse(null), contactImage)) {
            fileStorageService.deleteFileIfPresent(contactImage);
        }
        return activityWorkInProgressContactWorkInProgress;
    }

    private ContactWorkInProgress getContactWorkInProgress(ActivityWorkInProgress activityWorkInProgress) {
        return Optional.ofNullable(activityWorkInProgress.getContactWorkInProgress())
                .orElseGet(() -> {
                    final ContactWorkInProgress contactWorkInProgress = new ContactWorkInProgress();
                    activityWorkInProgress.setContactWorkInProgress(contactWorkInProgress);
                    return contactWorkInProgress;
                });
    }

    @Transactional
    public void deleteByActivity(Activity activity) {

        workInProgressRepository.findAllByActivity(activity).forEach(activityWorkInProgress -> {
            try {
                deleteActivityImage(activityWorkInProgress);
                deleteActivityLogo(activityWorkInProgress);
                deleteActivityContactImage(activityWorkInProgress);
            } catch (IOException e) {
                log.warn("Unexpected error while trying to delete image", e);
            }
            workInProgressRepository.delete(activityWorkInProgress);
        });
    }

    @Transactional
    public void deleteAllForOrganisation(Organisation organisation) {
        workInProgressRepository.deleteAllByOrganisation(organisation);
    }

    @Transactional
    public void deleteAllForOrganisationWorkInProgress(OrganisationWorkInProgress orgWip) {
        workInProgressRepository.deleteAllByOrganisationWorkInProgress(orgWip);
    }
}
