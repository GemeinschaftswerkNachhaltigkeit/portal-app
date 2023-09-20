package com.exxeta.wpgwn.wpgwnapp.util;

import javax.mail.BodyPart;
import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.Multipart;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;
import javax.mail.internet.MimeMultipart;
import java.io.IOException;
import java.io.InputStream;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

import org.hamcrest.Matchers;
import org.springframework.util.StreamUtils;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import static com.exxeta.wpgwn.wpgwnapp.util.HtmlMatcher.htmlEqualToFile;
import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.containsInAnyOrder;
import static org.hamcrest.Matchers.equalTo;

/**
 * Bietet Hilfsmehtoden zum Prüfen von E-Mail Inhalten.<br>
 * <br>
 *
 * @author dubowskl
 */
@Slf4j
public class MailVerifyUtil {

    /**
     * Prüft einen Anhang einer E-Mail, ob der Inhalt, der Inhaltstyp und der Dateiname passt.
     *
     * @param content     erwarter Inhalt
     * @param fileName    Dateiname
     * @param contentType Inhaltstyp
     * @param bodyPart    zu prüfende Body-Teil der E-Mail
     * @throws IOException        wenn die Datei nicht gefunden werden kann
     * @throws MessagingException wenn beim Auslesen des Body-Teil Fehler auftreten
     */
    public static void verifyAttachment(byte[] content, String fileName, String contentType, BodyPart bodyPart)
            throws IOException, MessagingException {
        final InputStream binaryStream = bodyPart.getInputStream();
        final byte[] actualPdfBinary = StreamUtils.copyToByteArray(binaryStream);

        assertThat(bodyPart.getFileName(), is(fileName));
        assertThat(actualPdfBinary, is(content));
        assertThat(bodyPart.getContentType(), is(contentType));
    }

    /**
     * Prüft einen Anhang einer E-Mail, ob der Inhalt, der Inhaltstyp und der Dateinamen passt.
     * Der erwartete Inhalt wird aus einer Datei geladen.
     *
     * @param expectedFilePath Datei mit erwarteten Inhalt
     * @param contentType      Inhaltstyp
     * @param bodyPart         zu prüfende Body-Teil der E-Mail
     * @throws IOException        wenn die Datei nicht gefunden werden kann
     * @throws MessagingException wenn beim Auslesen des Body-Teil Fehler auftreten
     */
    public static void verifyAttachment(String expectedFilePath, String contentType, BodyPart bodyPart)
            throws IOException, MessagingException {
        final byte[] expectedPdfBinary = FileUtils.readBytes(expectedFilePath);

        final String[] pathElements = expectedFilePath.split("/");
        final String fileName = pathElements[pathElements.length - 1];

        verifyAttachment(expectedPdfBinary, fileName, contentType, bodyPart);
    }

    /**
     * Verifiziert eine Mail. Über die Properties werden die Eigenschaften der Mail sowie optional der Anhänge übergeben.
     *
     * @param message    Mail, die überprüft werden soll
     * @param properties Eigenschaften, die die Mail besitzen soll
     * @throws MessagingException
     * @throws IOException
     */
    public static void verifySimpleMail(MimeMessage message, MailVerifyProperties properties)
            throws MessagingException, IOException {
        final String messageContent = (String) message.getContent();

        log.info("Message Content: \n\n" + messageContent);

        assertThat(message.getContentType(), is(properties.contentType.contentType));

        String actualContent = FileUtils.removeLineBreaks(messageContent);
        assertThat(actualContent, is(htmlEqualToFile(properties.contentFilePath, properties.args)));

        assertThat(stringList(message.getFrom()), containsInAnyOrder(properties.from));
        assertThat(stringList(message.getAllRecipients()), containsInAnyOrder(properties.recipients.toArray()));
        assertThat(message.getSubject(), Matchers.is(equalTo(properties.subject)));
    }

    /**
     * Verifiziert eine Mail. Über die Properties werden die Eigenschaften der Mail sowie optional der Anhänge übergeben.
     *
     * @param message    Mail, die überprüft werden soll
     * @param properties Eigenschaften, die die Mail besitzen soll
     * @throws MessagingException
     * @throws IOException
     */
    public static void verifyMultipartMail(MimeMessage message, MailVerifyProperties properties)
            throws MessagingException, IOException {
        final MimeMultipart messageContent = (MimeMultipart) message.getContent();
        assertThat(messageContent.getCount(), is(properties.attachments.size() + 1));

        final BodyPart mailTextContent = ((Multipart) messageContent.getBodyPart(0).getContent()).getBodyPart(0);
        assertThat(mailTextContent.getContentType(), is(properties.contentType.contentType));

        final String actualContent = FileUtils.removeLineBreaks((String) mailTextContent.getContent());
        assertThat(actualContent, is(htmlEqualToFile(properties.contentFilePath)));

        assertThat(stringList(message.getFrom()), containsInAnyOrder(properties.from));
        assertThat(stringList(message.getAllRecipients()), containsInAnyOrder(properties.recipients.toArray()));
        assertThat(message.getSubject(), Matchers.is(equalTo(properties.subject)));

        for (int i = 0; i < properties.attachments.size(); i++) {
            properties.attachments.get(i).verify(messageContent.getBodyPart(i + 1));
        }
    }


    public static void verifySubject(MimeMessage message, String expectedSubject) throws MessagingException {
        assertThat(message.getSubject(), Matchers.is(equalTo(expectedSubject)));
    }

    public static void verifyRecipient(MimeMessage message, String expectedRecipient,
                                       Message.RecipientType recipientType)
            throws MessagingException {
        verifyRecipients(message, Collections.singletonList(expectedRecipient), recipientType);
    }

    public static void verifyRecipients(MimeMessage message, List<String> expectedRecipients,
                                        Message.RecipientType recipientType)
            throws MessagingException {
        final List<String> receivedRecipients = Arrays.stream(message.getRecipients(recipientType))
                .map(InternetAddress.class::cast)
                .map(InternetAddress::getAddress)
                .collect(Collectors.toList());

        assertThat(receivedRecipients.size(), Matchers.is(equalTo(expectedRecipients.size())));
        assertThat(receivedRecipients, containsInAnyOrder(expectedRecipients.toArray()));
    }

    public static void verifyContent(MimeMessage message, String expectedContentPath)
            throws MessagingException, IOException {
        final BodyPart mailTextContent =
                ((Multipart) ((Multipart) message.getContent()).getBodyPart(0).getContent()).getBodyPart(0);
        final String actualContent = (String) mailTextContent.getContent();

        assertThat(actualContent, is(htmlEqualToFile(expectedContentPath)));
    }

    private static <T> List<String> stringList(T[] array) {
        return Arrays.stream(array).map(Objects::toString).collect(Collectors.toList());
    }

    /**
     * Mögliche Content-Typen, die eine E-Mail haben kann
     */
    public enum ContentType {
        PLAIN("text/plain"),
        HTML("text/html;charset=UTF-8");

        private final String contentType;

        ContentType(String contentType) {
            this.contentType = contentType;
        }
    }

    /**
     * Eigenschaften einer Mail, die getestet werden sollen.
     */
    @AllArgsConstructor
    public static class MailVerifyProperties {
        String contentFilePath;
        ContentType contentType;
        String from;
        List<String> recipients;
        String subject;
        List<MailVerifyAttachment> attachments;
        Map<String, String> args;

        public MailVerifyProperties(String contentFilePath, ContentType contentType, String from,
                                    List<String> recipients, String subject) {
            this.contentFilePath = contentFilePath;
            this.contentType = contentType;
            this.from = from;
            this.recipients = recipients;
            this.subject = subject;
            this.attachments = Collections.emptyList();
            this.args = Collections.emptyMap();
        }

        public MailVerifyProperties(String contentFilePath, ContentType contentType, String from,
                                    List<String> recipients, String subject, List<MailVerifyAttachment> attachments) {
            this.contentFilePath = contentFilePath;
            this.contentType = contentType;
            this.from = from;
            this.recipients = recipients;
            this.subject = subject;
            this.attachments = attachments;
            this.args = Collections.emptyMap();
        }
    }

    /**
     * Eigenschaften eines Anhangs, die überprüft werden sollen
     */
    @AllArgsConstructor
    public abstract static class MailVerifyAttachment {
        String contentType;
        String dataHandlerContentType;
        String fileName;

        /**
         * Überprüft die Eigenschaften des Anhangs
         *
         * @param bodyPart Anhang
         * @throws MessagingException
         * @throws IOException
         */
        abstract void verify(BodyPart bodyPart) throws MessagingException, IOException;
    }


    /**
     * Anhang, dessen Content als Datei zur Verfügung gestellt wird
     */
    public static class MailVerifyInByteArrayFileAttachment extends MailVerifyAttachment {

        private final byte[] payload;

        public MailVerifyInByteArrayFileAttachment(byte[] payload, String dataHandlerContentType, String fileName) {
            super(dataHandlerContentType, dataHandlerContentType, fileName);
            this.payload = payload;
        }

        @Override
        void verify(BodyPart bodyPart) throws MessagingException, IOException {
            verifyAttachment(payload, fileName, getContentType(), bodyPart);
            assertThat(bodyPart.getDataHandler().getContentType(), Matchers.is(equalTo(getDataHandlerContentType())));
        }

        private String getContentType() {
            if (fileName == null) {
                return contentType;
            }
            return contentType + "; name=" + fileName;
        }

        private String getDataHandlerContentType() {
            if (fileName == null) {
                return dataHandlerContentType;
            }
            return dataHandlerContentType + "; name=" + fileName;
        }

    }

    /**
     * Anhang, dessen Content als Datei zur Verfügung gestellt wird
     */
    public static class MailVerifyFileAttachment extends MailVerifyAttachment {
        String contentFilePath;

        public MailVerifyFileAttachment(String contentFilePath, String contentType, String dataHandlerContentType,
                                        String fileName) {
            super(contentType, dataHandlerContentType, fileName);
            this.contentFilePath = contentFilePath;
        }

        public MailVerifyFileAttachment(String contentFilePath, String contentType, String dataHandlerContentType) {
            this(contentFilePath, contentType, dataHandlerContentType, null);
        }

        @Override
        void verify(BodyPart bodyPart) throws MessagingException, IOException {
            verifyAttachment(contentFilePath, getContentType(), bodyPart);
            assertThat(bodyPart.getDataHandler().getContentType(), Matchers.is(equalTo(getDataHandlerContentType())));
        }

        private String getContentType() {
            if (fileName == null) {
                return contentType;
            }
            return contentType + "; name=" + fileName;
        }

        private String getDataHandlerContentType() {
            if (fileName == null) {
                return dataHandlerContentType;
            }
            return dataHandlerContentType + "; name=" + fileName;
        }
    }

    /**
     * Anhang, dessen Content als Byte-Array zur Verfügung gestellt wird
     */
    public static class MailVerifyInlineAttachment extends MailVerifyAttachment {
        byte[] content;

        public MailVerifyInlineAttachment(byte[] content, String contentType, String dataHandlerContentType,
                                          String fileName) {
            super(contentType, dataHandlerContentType, fileName);
            this.content = content;
        }

        @Override
        void verify(BodyPart bodyPart) throws MessagingException, IOException {
            verifyAttachment(content, fileName, contentType, bodyPart);

        }
    }
}
