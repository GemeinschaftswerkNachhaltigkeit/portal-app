package com.exxeta.wpgwn.wpgwnapp.email_opt_out;

import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

import com.exxeta.wpgwn.wpgwnapp.email_opt_out.dto.EmailOptOutEntryDto;
import com.exxeta.wpgwn.wpgwnapp.email_opt_out.model.EmailOptOutEntry;

@Mapper(unmappedTargetPolicy = ReportingPolicy.ERROR)
public abstract class OptOutMapper {

    public abstract EmailOptOutEntryDto optOutEntryToDto(EmailOptOutEntry optOutEntry);

}
