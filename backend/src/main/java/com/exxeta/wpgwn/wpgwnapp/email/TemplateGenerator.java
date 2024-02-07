package com.exxeta.wpgwn.wpgwnapp.email;

import jakarta.validation.constraints.NotBlank;

public interface TemplateGenerator<T> {
    @NotBlank
    String getTemplate(T entity);
}
