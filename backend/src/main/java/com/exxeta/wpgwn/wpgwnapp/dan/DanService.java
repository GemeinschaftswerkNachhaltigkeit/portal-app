package com.exxeta.wpgwn.wpgwnapp.dan;

import java.io.File;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeFormatterBuilder;
import java.util.HashSet;
import java.util.Iterator;
import java.util.LinkedList;
import java.util.List;
import java.util.Set;

import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.Point;
import org.springframework.stereotype.Service;

import lombok.extern.slf4j.Slf4j;

import com.exxeta.wpgwn.wpgwnapp.activity.model.Activity;
import com.exxeta.wpgwn.wpgwnapp.shared.model.Contact;
import com.exxeta.wpgwn.wpgwnapp.shared.model.Location;
import com.exxeta.wpgwn.wpgwnapp.shared.model.Period;
import com.exxeta.wpgwn.wpgwnapp.shared.model.ThematicFocus;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.dataformat.xml.XmlMapper;

@Service
@Slf4j
public class DanService {

    private String[] goal1List = {"Beteiligung", "Engagement"};
    private String[] goal2List = {"Bildung", "Wissenschaft"};
    private String[] goal3List = {"Biodiversität"};
    private String[] goal4List = {"Demokratie", "Menschenrechte"};
    private String[] goal5List = {"Diversität", "Inklusion"};
    private String[] goal6List = {"Frieden", "Sicherheit"};
    private String[] goal7List = {"Internationale Verantwortung"};
    private String[] goal8List = {"Klimaschutz", "Energiewende", "saubere Energie"};
    private String[] goal9List = {"Kreislaufwirtschaft"};
    private String[] goal10List = {"Kultur", "Soziale Innovation"};
    private String[] goal11List = {"Landwirtschaft", "Ernährung"};
    private String[] goal12List = {"Mobilität", "Verkehrswende"};
    private String[] goal13List = {"Nachhaltige Beschaffung"};
    private String[] goal14List = {"Nachhaltige Finanzen"};
    private String[] goal15List = {"Nachhaltiger Konsum", "Verantwortungsvoller Konsum"};
    private String[] goal16List = {"Nachhaltiges Bauen", "Nachhaltiges Wohnen"};
    private String[] goal17List = {"Nachhaltiges Wirtschaften"};
    private String[] goal18List = {"Nachhaltigkeitsgovernance"};
    private String[] goal19List = {"Soziale Gerechtigkeit", "Keine Armut", "Weniger Ungleichheit", "Keine Ungleichheit"};
    private String[] goal20List = {"Sport"};
    //Hier nochmal Prüfen
    private String[] goal21List =
            {"Entwicklung von Stadt und Land", "Entwicklung von Land", "Entwicklung von Stadt", "Nachhaltige Städte",
                    "Nachhaltige Stadt", "Nachhaltige Gemeinden"};
    private String[] goal22List = {"Tourismus"};

    private String[][] goalList =
            {goal1List, goal2List, goal3List, goal4List, goal5List, goal6List, goal7List, goal8List, goal9List,
                    goal10List, goal11List, goal12List, goal13List, goal14List, goal15List, goal16List, goal17List,
                    goal18List, goal19List,
                    goal20List, goal21List, goal22List};

    public static String sendeHTTPGet(String url) {
        String body = "";
        try {
            var request = HttpRequest.newBuilder()
                    .uri(URI.create(url))
                    .header("Content-Type", "application/json")
                    .GET()
                    .build();
            var client = HttpClient.newHttpClient();
            var response = client.send(request, HttpResponse.BodyHandlers.ofString());
            body = response.body();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return body;
    }

    public Activity parseDanIntoActivity(CampaignData campaignsData) {
        Activity activity = new Activity();

        activity.setExternalId(campaignsData.getId());
        activity.setName(campaignsData.getName());
        activity.setDescription(campaignsData.getDetailtext());

        Contact contact = new Contact();
        contact.setLastName(campaignsData.getOrganizer());
        contact.setEmail(campaignsData.getOrganizerEmail());
        contact.setPhone(campaignsData.getOrganizerTel());
        activity.setContact(contact);

        Location location = new Location();
        location.setUrl(campaignsData.getOrganizerWebsite());
        String locationString = campaignsData.getVenue();
        Boolean onlineBool = locationString.isEmpty();
        location.setOnline(onlineBool);

        activity.setImage(campaignsData.getImages().getImage());

        Period period = new Period();
        Instant startTime = parseStringIntoInstant(campaignsData.getDateStart());
        period.setStart(startTime);
        Instant endTime = parseStringIntoInstant(campaignsData.getDateEnd());
        period.setEnd(endTime);
        activity.setPeriod(period);

        if (campaignsData.getVenue() != null && !(campaignsData.getVenue().equals(""))) {
            Point point = getPointFromStrings(campaignsData.getLatitude(), campaignsData.getLongitude());
            location.setCoordinate(point);
            activity.setLocation(location);
            Point coordinatesFromAddressString = getCoordinatesFromAddressString(campaignsData.getVenue());
        }

        activity = parseGoals(activity, campaignsData);

        log.debug(activity.toString());
        log.debug(activity.getPeriod().getStart().toString());
        log.debug(activity.getPeriod().getEnd().toString());
        return activity;
    }

    private Instant parseStringIntoInstant(String string) {
        DateTimeFormatter dateTimeFormatter2 = new DateTimeFormatterBuilder().appendPattern("yyyy-MM-dd HH:mm:ss")
                .toFormatter();
        LocalDateTime localDateTime = LocalDateTime.parse(string, dateTimeFormatter2);
        ZoneId zoneId = ZoneId.of("Europe/Paris");
        ZonedDateTime zonedDateTime = localDateTime.atZone(zoneId);
        return zonedDateTime.toInstant();
    }

    public List<Activity> importXMLFromFile(String path) {
        String importedString;
        List<Activity> activityList = new LinkedList<>();
        try {
            File xmlFile = new File(path);

            XmlMapper xmlMapper = new XmlMapper();
            DanDataList value = xmlMapper.readValue(xmlFile, DanDataList.class);
            importedString = value.toString();
            log.debug(importedString);

            Activity activity = parseDanIntoActivity(value.getCampaigns().get(0));
            activityList.add(activity);
        } catch (Exception e) {
            e.printStackTrace();
        }

        return activityList;
    }

    public Point getPointFromStrings(String latitude, String longitude) {
        if (!longitude.equals("") && !latitude.equals("")) {
            try {
                GeometryFactory geometryFactory = new GeometryFactory();
                double longitudeDouble = Double.parseDouble(longitude);
                double latitudeDouble = Double.parseDouble(latitude);
                Coordinate coordinate = new Coordinate(latitudeDouble, longitudeDouble);
                return geometryFactory.createPoint(coordinate);
            } catch (Exception e) {
                return null;
            }
        } else {
            return null;
        }
    }

    public JsonNode getJsonFromNominatum(String address) {
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            String url = "https://nominatim.openstreetmap.org/search?q=" + address + "&format=json&adressdetails=1&limit=1&polygon_svg=1";
            log.debug(url);
            String response = sendeHTTPGet(url);
            log.debug(response);

            return objectMapper.readTree(response);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    public Point getCoordinatesFromAddressString(String address) {
        try {
            address = address.replace(" ", "%20");
            JsonNode jsonNode = getJsonFromNominatum(address);
            if (jsonNode.get(0) == null) {
                address = address.split(",%20")[1];
                jsonNode = getJsonFromNominatum(address);
            }
            if (jsonNode.get(0) != null) {
                String latitude = jsonNode.get(0).get("lat").asText();
                String longitude = jsonNode.get(0).get("lon").asText();
                return getPointFromStrings(latitude, longitude);
            } else {
                return null;
            }
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    public Activity parseGoals(Activity startActivity, CampaignData campaignsData) {
        String category = campaignsData.getCategory();
        Set<Integer> intSet = new HashSet<>();

        for (int i = 1; i < goalList.length; i++) {
            for (int j = 0; j < goalList[i].length; j++) {
                if (category.contains(goalList[i][j])) {
                    intSet.add(i);
                }
            }
        }

        for (Iterator<Integer> iterator = intSet.iterator(); iterator.hasNext();) {
            int i = iterator.next();
            Set<ThematicFocus> thematicFocus = startActivity.getThematicFocus();
            thematicFocus.add(ThematicFocus.getById(i++));
        }

        return startActivity;
    }

}
