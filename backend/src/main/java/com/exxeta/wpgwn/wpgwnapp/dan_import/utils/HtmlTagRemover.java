package com.exxeta.wpgwn.wpgwnapp.dan_import.utils;

import lombok.experimental.UtilityClass;

import org.apache.commons.text.StringEscapeUtils;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.safety.Safelist;

import static org.springframework.util.StringUtils.hasText;


@UtilityClass
public class HtmlTagRemover {

    public static String removeHtmlTags(String htmlString) {
        if (!hasText(htmlString)) {
            return htmlString;
        }
        while (htmlString.contains("&amp;")) {
            htmlString = htmlString.replaceAll("&amp;", "&");
        }
        htmlString = normalizeHtml(htmlString);
        Document doc = Jsoup.parse(htmlString);
        Safelist safelist = Safelist.none();
        String cleanedText = Jsoup.clean(doc.body().html(), safelist);
        cleanedText = cleanedText.replaceAll("&amp;", "&");
        cleanedText = cleanedText.replaceAll("&nbsp;", " ");
        return cleanedText;
    }

    private static String normalizeHtml(String htmlString) {
        if (isHtmlEncoded(htmlString)) {
            htmlString = StringEscapeUtils.unescapeHtml4(htmlString);
        }
        return htmlString;
    }

    private static boolean isHtmlEncoded(String htmlString) {
        return htmlString.contains("&") || htmlString.contains("&lt;") || htmlString.contains("&gt;")
                || htmlString.contains("&quot;") || htmlString.contains("&apos;")
                || htmlString.contains("&#");
    }
}
