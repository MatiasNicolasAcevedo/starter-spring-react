package com.example.starter.security;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.request;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.example.starter.TestcontainersConfiguration;
import java.time.Duration;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.system.CapturedOutput;
import org.springframework.boot.test.system.OutputCaptureExtension;
import org.springframework.context.annotation.Import;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.web.context.WebApplicationContext;
import org.testcontainers.postgresql.PostgreSQLContainer;

/** Real fresh PostgreSQL: readiness must fail on outage while liveness stays independent. */
@ActiveProfiles("test")
@Import(TestcontainersConfiguration.class)
@SpringBootTest
@ExtendWith(OutputCaptureExtension.class)
class ReadinessIT {
    @Autowired
    private WebApplicationContext context;

    @Autowired
    private PublicOrigin origin;

    @Autowired
    private PostgreSQLContainer postgres;

    @Autowired
    private JdbcTemplate jdbc;

    private MockMvc mockMvc;

    @BeforeEach
    void usePublicOrigin() {
        mockMvc = AuthOriginMockMvc.create(context, origin);
    }

    @Test
    void freshMigratedDatabaseGoesUpDownUpWithoutRestartingTheApplication(CapturedOutput output) throws Exception {
        assertThat(jdbc.queryForObject(
                        "SELECT count(*) FROM flyway_schema_history WHERE version = '1' AND success", Integer.class))
                .isEqualTo(1);
        assertUp();
        int previousOutput = output.getAll().length();
        // Stop/start reallocates Docker's dynamic host port; pause models a real DB outage at the same address.
        // The Compose/browser assay separately uses stop/start against the internal DB service.
        postgres.getDockerClient().pauseContainerCmd(postgres.getContainerId()).exec();
        try {
            long started = System.nanoTime();
            mockMvc.perform(get("/actuator/health/readiness").accept(MediaType.APPLICATION_JSON))
                    .andExpect(status().isServiceUnavailable())
                    .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
                    .andExpect(content().json("{\"status\":\"DOWN\"}", true));
            assertThat(Duration.ofNanos(System.nanoTime() - started)).isLessThan(Duration.ofSeconds(6));
            assertThat(output.getAll().substring(previousOutput))
                    .doesNotContain(
                            "jdbc:postgresql", "PSQLException", "DataSource health check failed", postgres.getHost());
            mockMvc.perform(get("/actuator/health/liveness").accept(MediaType.APPLICATION_JSON))
                    .andExpect(status().isOk())
                    .andExpect(content().json("{\"status\":\"UP\"}", true));
        } finally {
            postgres.getDockerClient()
                    .unpauseContainerCmd(postgres.getContainerId())
                    .exec();
            long deadline = System.nanoTime() + Duration.ofSeconds(20).toNanos();
            while (mockMvc.perform(get("/actuator/health/readiness").accept(MediaType.APPLICATION_JSON))
                            .andReturn()
                            .getResponse()
                            .getStatus()
                    != 200) {
                assertThat(System.nanoTime()).isLessThan(deadline);
                Thread.sleep(100);
            }
        }
        assertUp();
    }

    @Test
    void onlyExactInternalHealthGetsArePublic() throws Exception {
        for (String path : new String[] {
            "/actuator",
            "/actuator/env",
            "/actuator/metrics",
            "/actuator/configprops",
            "/actuator/health/readiness/extra",
            "/actuator/health/readiness-extra"
        }) {
            mockMvc.perform(get(path)).andExpect(status().isUnauthorized());
        }
        var csrf = mockMvc.perform(get("/api/v1/auth/csrf"))
                .andReturn()
                .getResponse()
                .getCookie("XSRF-TOKEN");
        assertThat(csrf).isNotNull();
        for (HttpMethod method : new HttpMethod[] {
            HttpMethod.HEAD, HttpMethod.OPTIONS, HttpMethod.POST, HttpMethod.PUT, HttpMethod.PATCH, HttpMethod.DELETE
        }) {
            mockMvc.perform(request(method, "/actuator/health/readiness")
                            .cookie(csrf)
                            .header("X-XSRF-TOKEN", csrf.getValue()))
                    .andExpect(status().isUnauthorized());
        }
    }

    private void assertUp() throws Exception {
        var result = mockMvc.perform(get("/actuator/health/readiness").accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
                .andExpect(content().json("{\"status\":\"UP\"}", true))
                .andReturn();
        assertThat(result.getRequest().getSession(false)).isNull();
        // The inherited CSRF handler materializes its anonymous cookie on every GET; no session/new cookie type.
        assertThat(result.getResponse().getHeaders("Set-Cookie")).allMatch(value -> value.startsWith("XSRF-TOKEN="));
    }
}
