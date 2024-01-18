package com.exxeta.wpgwn.wpgwnapp.activity.dto;

import jakarta.validation.constraints.NotNull;

import lombok.Data;

import com.exxeta.wpgwn.wpgwnapp.shared.model.ItemStatus;

@Data
public class ItemStatusChangeDto {

    @NotNull
    private ItemStatus status;

}
