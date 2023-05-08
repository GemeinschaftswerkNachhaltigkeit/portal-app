package com.exxeta.wpgwn.wpgwnapp.index;

import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.servlet.View;
import org.springframework.web.servlet.view.InternalResourceView;

import static com.exxeta.wpgwn.wpgwnapp.utils.ProfileService.PROD_PROFILE;

/**
 * Controller für die Anwendung, die nur im Profile "prod" aktiv ist.
 */
@Profile(PROD_PROFILE)
@Controller
public class IndexController {

    /**
     * Endpunkt zum Ausliefern der Index.html für alle nicht explizit definierten Endpunkte.
     * Mit dem Update auf Spring Boot 2.6 ist es nicht mehr möglich, Pfade anzugeben,
     * bei denen nach einem '**' noch weitere Segmente gematcht werden
     * (siehe <a href="https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/web/util/pattern/PathPattern.html">hier</a>).
     * Daher werden hier nun explizit die verschiedenen Ebenen aufgelistet.
     *
     * @return den View index.html der Single Page Applikation
     */
    @GetMapping({"{path:[^.]*}",
            "/*/{path:[^.]+}",
            "/*/*/{path:[^.]+}",
            "/*/*/*/{path:[^.]+}",
            "/*/*/*/*/{path:[^.]+}",
            "/*/*/*/*/*/{path:[^.]+}",
            "/*/*/*/*/*/*/{path:[^.]+}",
            "/*/*/*/*/*/*/*/{path:[^.]+}"
    })
    public View forward() {
        return new InternalResourceView("/index.html");
    }

}
