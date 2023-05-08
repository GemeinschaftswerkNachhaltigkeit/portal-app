package com.exxeta.wpgwn.wpgwnapp.shared;

import java.time.Instant;
import java.util.LinkedHashSet;
import java.util.Objects;
import java.util.Optional;
import java.util.Set;

import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.Named;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.mapstruct.ReportingPolicy;
import org.springframework.beans.factory.annotation.Autowired;

import com.exxeta.wpgwn.wpgwnapp.shared.dto.AddressDto;
import com.exxeta.wpgwn.wpgwnapp.shared.dto.ContactDto;
import com.exxeta.wpgwn.wpgwnapp.shared.dto.LocationDto;
import com.exxeta.wpgwn.wpgwnapp.shared.dto.PeriodDto;
import com.exxeta.wpgwn.wpgwnapp.shared.model.Address;
import com.exxeta.wpgwn.wpgwnapp.shared.model.Contact;
import com.exxeta.wpgwn.wpgwnapp.shared.model.ContactWorkInProgress;
import com.exxeta.wpgwn.wpgwnapp.shared.model.Location;
import com.exxeta.wpgwn.wpgwnapp.shared.model.LocationWorkInProgress;
import com.exxeta.wpgwn.wpgwnapp.shared.model.Period;
import com.exxeta.wpgwn.wpgwnapp.utils.converter.DateMapper;
import com.exxeta.wpgwn.wpgwnapp.zip_code_mapping.ZipCode;
import com.exxeta.wpgwn.wpgwnapp.zip_code_mapping.ZipCodeService;

@Mapper(unmappedTargetPolicy = ReportingPolicy.ERROR)
public abstract class SharedMapper {

    private static final Instant PERMANENT_START = Instant.parse("1970-01-01T00:00:00Z");
    private static final Instant PERMANENT_END = Instant.parse("9999-12-31T00:00:00Z");
    @Autowired
    private ZipCodeService zipCodeService;

    @Autowired
    private DateMapper dateMapper;

    @Mapping(target = "image", ignore = true)
    public abstract ContactWorkInProgress mapContactDtoToContactWip(ContactDto value);

    @Mapping(target = "image", ignore = true)
    public abstract Contact mapContactDtoToContact(ContactDto value);

    public abstract Contact mapContactWipToContact(ContactWorkInProgress value);

    public abstract ContactWorkInProgress mapContactToContactWip(Contact value);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    public abstract ContactWorkInProgress map(ContactDto value, @MappingTarget
    ContactWorkInProgress contactWorkInProgress);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    public abstract Contact map(ContactDto value, @MappingTarget
    Contact contact);

    public abstract ContactDto map(ContactWorkInProgress value);

    public abstract ContactDto map(Contact value);

    public abstract LocationWorkInProgress mapLocationDtoToLocationWip(LocationDto value);

    public abstract Location mapLocationDtoToLocation(LocationDto value);

    public abstract LocationDto mapLocationToLocationDto(Location value);

    public Period mapPeriodDtoToPeriod(PeriodDto value) {
        if (Objects.isNull(value)) {
            return null;
        }

        final Period period = new Period();
        if (Boolean.TRUE.equals(value.getPermanent())) {
            period.setStart(PERMANENT_START);
            period.setEnd(PERMANENT_END);
        } else {
            period.setStart(dateMapper.map(value.getStart()));
            period.setEnd(dateMapper.map(value.getEnd()));
        }

        return period;
    }

    public PeriodDto mapPeriodToPeriodDto(Period value) {
        if (Objects.isNull(value)) {
            return null;
        }

        PeriodDto periodDto = new PeriodDto();
        if (Objects.equals(value.getStart(), PERMANENT_START) && Objects.equals(value.getEnd(), PERMANENT_END)) {
            periodDto.setPermanent(true);
        } else {
            periodDto.setStart(dateMapper.convert(value.getStart()));
            periodDto.setEnd(dateMapper.convert(value.getEnd()));
            periodDto.setPermanent(false);
        }
        return periodDto;
    }

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    public abstract LocationWorkInProgress map(LocationDto value,
                                               @MappingTarget LocationWorkInProgress locationWorkInProgress);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    public abstract Location map(LocationDto value, @MappingTarget Location location);

    @Mapping(target = "state", source = "zipCode", qualifiedByName = "zipCodeToState")
    abstract Address mapAddressDto(AddressDto addressDto);

    @Named("zipCodeToState")
    String mapZipcodeToState(String zipCode) {
        return zipCodeService.get(zipCode).map(ZipCode::getState).orElse(null);
    }

    public Set<Long> mapLongSet(Set<Long> set) {
        if (Objects.isNull(set)) {
            return null;
        }

        LinkedHashSet<Long> result = new LinkedHashSet<>();
        set.stream().sorted().forEach(result::add);
        return result;
    }

    public <T> Optional<T> map(T value) {
        return Optional.ofNullable(value);
    }

    public <T> T map(Optional<T> value) {
        return value.orElse(null);
    }
}
