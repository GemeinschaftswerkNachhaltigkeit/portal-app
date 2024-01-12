package com.exxeta.wpgwn.wpgwnapp.action_page.process;

import com.exxeta.wpgwn.wpgwnapp.action_page.dto.ActionFromRequestDto;

public interface ActionPageRequestProcess {

    void validate(ActionFromRequestDto actionFromRequestDto);

}
