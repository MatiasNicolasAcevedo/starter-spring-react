package com.example.starter.reference.web;

import com.example.starter.security.AuthOpenApi;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import java.util.List;
import org.springdoc.core.customizers.OpenApiCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration(proxyBeanMethods = false)
public class ReferenceOpenApi {
    @Bean
    OpenApiCustomizer referenceOpenApiCustomizer() {
        return api -> {
            var collection = api.getPaths().get("/api/v1/reference-items");
            var item = api.getPaths().get("/api/v1/reference-items/{id}");
            for (var operation : List.of(collection.getPost(), item.getPut(), item.getDelete())) {
                // Both protections are required together, never alternative authentication schemes.
                operation.setSecurity(List.of(new SecurityRequirement()
                        .addList(AuthOpenApi.SESSION_COOKIE)
                        .addList(AuthOpenApi.CSRF_HEADER)));
            }
        };
    }
}
