package com.exxeta.wpgwn.wpgwnapp.user_account;

import java.io.Serializable;

import lombok.Value;

@Value
public class UserDto implements Serializable {

    private String userId;
    private String firstName;
    private String lastName;

}
