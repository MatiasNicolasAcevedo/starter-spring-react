package com.example.starter.reference;

import static org.assertj.core.api.Assertions.assertThat;

import com.example.starter.TestcontainersConfiguration;
import com.example.starter.security.OidcHttpBrowser;
import com.example.starter.security.OidcHttpProvider;
import java.net.http.HttpResponse;
import java.util.Map;
import java.util.UUID;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.context.annotation.Import;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.json.JsonMapper;

@ActiveProfiles("test")
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_CLASS)
@Import(TestcontainersConfiguration.class)
@SpringBootTest(
        webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT,
        properties = {"APP_PUBLIC_URL=http://127.0.0.1:5173", "server.forward-headers-strategy=framework"})
class ReferenceItemIT {
    private static final String PATH = "/api/v1/reference-items";
    private static final OidcHttpProvider PROVIDER = new OidcHttpProvider();
    private static final JsonMapper JSON = JsonMapper.builder().build();

    @DynamicPropertySource
    static void properties(DynamicPropertyRegistry registry) {
        registry.add("starter.oidc.local-issuer", PROVIDER::issuer);
    }

    @AfterAll
    static void closeProvider() {
        PROVIDER.close();
    }

    @LocalServerPort
    private int port;

    @Autowired
    private JdbcTemplate jdbc;

    @AfterEach
    void cleanupOwnHttpWrites() {
        jdbc.update(
                "DELETE FROM reference_item WHERE owner_id IN (SELECT id FROM app_user WHERE issuer=?)",
                PROVIDER.issuer());
        jdbc.update("DELETE FROM app_user WHERE issuer=?", PROVIDER.issuer());
    }

    private OidcHttpBrowser login() throws Exception {
        var browser = new OidcHttpBrowser(port);
        assertThat(browser.callback(browser.authorize(browser.start())).statusCode())
                .isEqualTo(302);
        assertThat(browser.get("/api/v1/auth/csrf").statusCode()).isEqualTo(204);
        return browser;
    }

    private HttpResponse<String> mutate(OidcHttpBrowser browser, String path, String method, String body)
            throws Exception {
        return browser.request(
                path,
                method,
                Map.of("Content-Type", "application/json", "X-XSRF-TOKEN", browser.cookie("XSRF-TOKEN")),
                body);
    }

    private JsonNode checked(HttpResponse<String> response, int status) {
        assertThat(response.statusCode()).isEqualTo(status);
        assertThat(response.headers().firstValue("Cache-Control").orElseThrow()).contains("no-store");
        return JSON.readTree(response.body());
    }

    @Test
    void realOidcTwoOwnersCrudDenialsAndInjectionsPreserveDataAndCounts() throws Exception {
        var a = login();
        var b = login();
        String owner = a.me().get("id").asString();
        assertThat(b.me().get("id").asString()).isNotEqualTo(owner);
        var created = checked(mutate(a, PATH, "POST", "{\"title\":\"  Título \",\"description\":\" Texto \"}"), 201);
        String id = created.get("id").asString();
        assertThat(UUID.fromString(id).version()).isEqualTo(7);
        assertThat(created.propertyStream().map(Map.Entry::getKey))
                .containsExactlyInAnyOrder("id", "title", "description", "createdAt", "updatedAt");
        assertThat(created.get("title").asString()).isEqualTo("Título");
        assertThat(created.get("description").asString()).isEqualTo("Texto");
        assertThat(created.get("createdAt").asString())
                .isEqualTo(created.get("updatedAt").asString());
        assertThat(checked(a.get(PATH + "/" + id), 200)).isEqualTo(created);
        assertThat(checked(b.get(PATH), 200).get("totalElements").asInt()).isZero();
        checked(mutate(b, PATH, "POST", "{\"title\":\"B privado\",\"description\":\"\"}"), 201);
        assertThat(checked(a.get(PATH), 200).get("totalElements").asInt()).isEqualTo(1);
        String absent = UUID.randomUUID().toString();
        for (String method : new String[] {"GET", "PUT", "DELETE"}) {
            var foreign = checked(
                    mutate(
                            b,
                            PATH + "/" + id,
                            method,
                            method.equals("PUT") ? "{\"title\":\"Ataque\",\"description\":\"\"}" : ""),
                    404);
            var missing = checked(
                    mutate(
                            b,
                            PATH + "/" + absent,
                            method,
                            method.equals("PUT") ? "{\"title\":\"Ataque\",\"description\":\"\"}" : ""),
                    404);
            assertThat(foreign.get("detail")).isEqualTo(missing.get("detail"));
            assertThat(foreign.get("detail").asString()).isEqualTo("No se encontró el elemento.");
        }
        for (String field : new String[] {"owner", "ownerId", "owner_id", "id", "createdAt", "updatedAt", "unknown"}) {
            checked(
                    mutate(
                            b,
                            PATH,
                            "POST",
                            "{\"title\":\"x\",\"description\":\"\",\"" + field + "\":\"" + owner + "\"}"),
                    400);
            checked(
                    mutate(
                            a,
                            PATH + "/" + id,
                            "PUT",
                            "{\"title\":\"x\",\"description\":\"\",\"" + field + "\":\"INJECTED\"}"),
                    400);
        }
        assertThat(checked(a.get(PATH + "/" + id), 200)).isEqualTo(created);
        assertThat(checked(b.get(PATH), 200).get("totalElements").asInt()).isEqualTo(1);
        var updated = checked(mutate(a, PATH + "/" + id, "PUT", "{\"title\":\"Editado\",\"description\":\"\"}"), 200);
        assertThat(updated.get("id")).isEqualTo(created.get("id"));
        assertThat(updated.get("createdAt")).isEqualTo(created.get("createdAt"));
        assertThat(updated.get("updatedAt").asString())
                .isNotEqualTo(created.get("updatedAt").asString());
        assertThat(jdbc.queryForObject(
                        "SELECT owner_id::text FROM reference_item WHERE id=?", String.class, UUID.fromString(id)))
                .isEqualTo(owner);
        var deleted = mutate(a, PATH + "/" + id, "DELETE", "");
        assertThat(deleted.statusCode()).isEqualTo(204);
        assertThat(deleted.body()).isEmpty();
        checked(mutate(a, PATH + "/" + id, "DELETE", ""), 404);
        assertThat(checked(a.get(PATH), 200).get("totalElements").asInt()).isZero();
        assertThat(checked(b.get(PATH), 200).get("totalElements").asInt()).isEqualTo(1);
        assertThat(jdbc.queryForObject(
                        "SELECT count(*) FROM app_user WHERE issuer=?", Integer.class, PROVIDER.issuer()))
                .isEqualTo(2);
    }

    @Test
    void realCookieCsrfAndExactMethodsRemainDeniedWithoutDataChanges() throws Exception {
        var visitor = new OidcHttpBrowser(port);
        checked(visitor.get(PATH), 401);
        checked(visitor.get(PATH + "/" + UUID.randomUUID()), 401);
        assertThat(visitor.get("/api/v1/auth/csrf").statusCode()).isEqualTo(204);
        checked(mutate(visitor, PATH, "POST", "{\"title\":\"x\",\"description\":\"\"}"), 401);
        var a = login();
        var created = checked(mutate(a, PATH, "POST", "{\"title\":\"Conservado\",\"description\":\"\"}"), 201);
        String path = PATH + "/" + created.get("id").asString();
        for (String method : new String[] {"POST", "PUT", "DELETE"}) {
            String target = method.equals("POST") ? PATH : path;
            for (var headers : java.util.List.of(
                    Map.of("Content-Type", "application/json"),
                    Map.of("Content-Type", "application/json", "X-XSRF-TOKEN", "incorrect"))) {
                checked(a.request(target, method, headers, "{\"title\":\"Sin permiso\",\"description\":\"\"}"), 403);
            }
        }
        for (String method : new String[] {"HEAD", "OPTIONS", "PATCH", "PUT", "DELETE"}) {
            var rejected = mutate(a, PATH, method, "{}");
            assertThat(rejected.statusCode()).isEqualTo(403);
        }
        for (String method : new String[] {"HEAD", "OPTIONS", "PATCH", "POST"})
            assertThat(mutate(a, path, method, "{}").statusCode()).isEqualTo(403);
        for (String neighbour : new String[] {
            "/api/v1/reference/private", PATH + "/" + UUID.randomUUID() + "/extra", PATH + "/extra/child", PATH + "/"
        }) checked(a.get(neighbour), 403);
        assertThat(checked(a.get(path), 200)).isEqualTo(created);
        assertThat(checked(a.get(PATH), 200).get("totalElements").asInt()).isEqualTo(1);
    }

    @Test
    void stablePaginationBoundsDuplicatesAndValidationUseRealPersistence() throws Exception {
        var a = login();
        for (int index = 0; index < 3; index++)
            checked(mutate(a, PATH, "POST", "{\"title\":\"Duplicado\",\"description\":\"\"}"), 201);
        var defaults = checked(a.get(PATH), 200);
        assertThat(defaults.get("page").asInt()).isZero();
        assertThat(defaults.get("size").asInt()).isEqualTo(20);
        String owner = a.me().get("id").asString();
        var expected = jdbc.queryForList(
                "SELECT id::text FROM reference_item WHERE owner_id=? ORDER BY created_at DESC,id DESC",
                String.class,
                UUID.fromString(owner));
        for (int page = 0; page < 3; page++) {
            var result = checked(a.get(PATH + "?page=" + page + "&size=1"), 200);
            assertThat(result.get("totalElements").asInt()).isEqualTo(3);
            assertThat(result.get("totalPages").asInt()).isEqualTo(3);
            assertThat(result.get("content").get(0).get("id").asString()).isEqualTo(expected.get(page));
        }
        var outside = checked(a.get(PATH + "?page=100&size=1"), 200);
        assertThat(outside.get("content").size()).isZero();
        assertThat(outside.get("totalElements").asInt()).isEqualTo(3);
        for (String suffix : new String[] {"?page=-1", "?size=0", "?size=101", "?page=1.5", "/INVALID_PRIVATE_VALUE"}) {
            var response = checked(a.get(PATH + suffix), 400);
            assertThat(response.toString()).doesNotContain("INVALID_PRIVATE_VALUE", "Exception", "SQL");
        }
        for (String body : new String[] {
            "{",
            "[]",
            "{}",
            "{\"title\":null,\"description\":null}",
            "{\"title\":\"   \",\"description\":\"\"}",
            "{\"title\":12,\"description\":\"\"}",
            JSON.writeValueAsString(Map.of("title", "x".repeat(121), "description", "")),
            JSON.writeValueAsString(Map.of("title", "x", "description", "x".repeat(2001)))
        }) checked(mutate(a, PATH, "POST", body), 400);
        checked(
                mutate(
                        a,
                        PATH,
                        "POST",
                        JSON.writeValueAsString(Map.of("title", "x".repeat(120), "description", "x".repeat(2000)))),
                201);
        assertThat(checked(a.get(PATH), 200).get("totalElements").asInt()).isEqualTo(4);
    }

    @ParameterizedTest
    @CsvSource({"100,20", "107374182,20", "107374183,20", "2147483647,1", "2147483647,100"})
    void validPagesAcrossJpaOffsetLimitReturnEmptyWithRealOwnerCounts(int page, int size) throws Exception {
        var a = login();
        var b = login();
        var empty = login();
        checked(mutate(a, PATH, "POST", "{\"title\":\"A propio\",\"description\":\"\"}"), 201);
        for (int index = 0; index < 2; index++)
            checked(mutate(b, PATH, "POST", "{\"title\":\"B privado\",\"description\":\"\"}"), 201);
        var browsers = java.util.List.of(a, b, empty);
        for (int index = 0; index < browsers.size(); index++) {
            var browser = browsers.get(index);
            int count = new int[] {1, 2, 0}[index];
            var result = checked(browser.get(PATH + "?page=" + page + "&size=" + size), 200);
            assertThat(result.get("content").size()).isZero();
            assertThat(result.get("page").asInt()).isEqualTo(page);
            assertThat(result.get("size").asInt()).isEqualTo(size);
            assertThat(result.get("totalElements").asInt()).isEqualTo(count);
            assertThat(result.get("totalPages").asInt()).isEqualTo((count + size - 1) / size);
            var first = checked(browser.get(PATH), 200);
            assertThat(first.get("content").size()).isEqualTo(count);
            assertThat(first.get("totalElements").asInt()).isEqualTo(count);
            var owner = UUID.fromString(browser.me().get("id").asString());
            assertThat(jdbc.queryForObject(
                            "SELECT count(*) FROM reference_item WHERE owner_id=?", Integer.class, owner))
                    .isEqualTo(count);
        }
        assertThat(jdbc.queryForObject(
                        "SELECT count(*) FROM reference_item WHERE owner_id IN (SELECT id FROM app_user WHERE issuer=?)",
                        Integer.class,
                        PROVIDER.issuer()))
                .isEqualTo(3);
    }
}
