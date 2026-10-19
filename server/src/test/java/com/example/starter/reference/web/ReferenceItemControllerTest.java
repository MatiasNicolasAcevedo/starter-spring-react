package com.example.starter.reference.web;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.oidcLogin;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.example.starter.identity.IdentityService;
import com.example.starter.reference.application.*;
import com.example.starter.security.*;
import java.time.Instant;
import java.util.List;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.core.oidc.OidcIdToken;
import org.springframework.security.oauth2.core.oidc.user.DefaultOidcUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

@ActiveProfiles("test")
@WebMvcTest(ReferenceItemController.class)
@Import(SecurityConfig.class)
class ReferenceItemControllerTest {
    private static final String PATH = "/api/v1/reference-items";
    private static final UUID OWNER = UUID.randomUUID();
    private static final UUID ID = UUID.randomUUID();

    @Autowired
    private MockMvc mvc;

    @MockitoBean
    private ReferenceItemService service;

    @MockitoBean
    private IdentityService identities;

    private LocalOidcUser user() {
        var token = OidcIdToken.withTokenValue("fictitious")
                .subject("fictitious")
                .issuedAt(Instant.parse("2026-10-18T12:00:00Z"))
                .expiresAt(Instant.parse("2026-10-18T13:00:00Z"))
                .build();
        return new LocalOidcUser(
                new DefaultOidcUser(List.of(new SimpleGrantedAuthority("OIDC_USER")), token),
                new AuthMeResponse(OWNER, null, null, false));
    }

    @Test
    void derivesOnlyLocalSessionOwnerAndEmitsDtoLocationAndNoStore() throws Exception {
        var now = Instant.parse("2026-10-18T12:00:00Z");
        var view = new ReferenceItemView(ID, "Título", "", now, now);
        when(service.create(eq(OWNER), any())).thenReturn(view);
        var cookie = mvc.perform(get("/api/v1/auth/csrf").with(request -> {
                    request.setServerName("127.0.0.1");
                    request.setServerPort(5173);
                    return request;
                }))
                .andReturn()
                .getResponse()
                .getCookie("XSRF-TOKEN");
        assertThat(cookie).isNotNull();
        mvc.perform(post(PATH)
                        .with(oidcLogin().oidcUser(user()))
                        .cookie(cookie)
                        .header("X-XSRF-TOKEN", cookie.getValue())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"title\":\" Título \",\"description\":\" \"}"))
                .andExpect(status().isCreated())
                .andExpect(header().string("Location", PATH + "/" + ID))
                .andExpect(header().string("Cache-Control", "no-store"))
                .andExpect(jsonPath("$.ownerId").doesNotExist());
        verify(service).create(OWNER, new ReferenceItemInput("Título", ""));
    }

    @Test
    void sortedFieldErrorsAndStrictFeatureBodyRejectWithoutCallingService() throws Exception {
        var cookie = mvc.perform(get("/api/v1/auth/csrf").with(request -> {
                    request.setServerName("127.0.0.1");
                    request.setServerPort(5173);
                    return request;
                }))
                .andReturn()
                .getResponse()
                .getCookie("XSRF-TOKEN");
        mvc.perform(post(PATH)
                        .with(oidcLogin().oidcUser(user()))
                        .cookie(cookie)
                        .header("X-XSRF-TOKEN", cookie.getValue())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"title\":\"  \"}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errors[0].field").value("description"))
                .andExpect(jsonPath("$.errors[1].field").value("title"));
        for (String body : new String[] {
            "{",
            "[]",
            "{\"title\":1,\"description\":\"\"}",
            "{\"title\":\"x\",\"description\":\"\",\"ownerId\":\"INJECTED\"}",
            "{\"title\":\"x\",\"description\":false}"
        }) {
            var response = mvc.perform(post(PATH)
                            .with(oidcLogin().oidcUser(user()))
                            .cookie(cookie)
                            .header("X-XSRF-TOKEN", cookie.getValue())
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(body))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.detail").value("La solicitud tiene datos inválidos."))
                    .andReturn()
                    .getResponse()
                    .getContentAsString();
            assertThat(response).doesNotContain("INJECTED", "Exception", "SQL", "cause");
        }
        verifyNoInteractions(service);
    }

    @Test
    void rejectsInvalidPaginationAndUuidWithoutLeakingRejectedValues() throws Exception {
        for (String suffix :
                new String[] {"?page=-1", "?size=0", "?size=101", "?page=1.5", "?size=PRIVATE_INPUT", "/PRIVATE_INPUT"
                }) {
            var response = mvc.perform(get(PATH + suffix).with(oidcLogin().oidcUser(user())))
                    .andExpect(status().isBadRequest())
                    .andReturn()
                    .getResponse()
                    .getContentAsString();
            assertThat(response).doesNotContain("PRIVATE_INPUT", "Exception");
        }
        verifyNoInteractions(service);
    }
}
