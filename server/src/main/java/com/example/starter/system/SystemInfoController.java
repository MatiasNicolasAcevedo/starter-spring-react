package com.example.starter.system;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Endpoint público de referencia: la SPA lo usa para comprobar la llamada real navegador → client → server. Es la
 * única excepción anónima de {@code /api/**} (ver {@code SecurityConfig}).
 */
@RestController
@RequestMapping("/api/v1/system")
class SystemInfoController {

    static final String APPLICATION_NAME = "Starter";

    private final SystemInfoResponse info;

    SystemInfoController(@Value("${starter.version}") String version) {
        this.info = new SystemInfoResponse(APPLICATION_NAME, version);
    }

    @GetMapping("/info")
    SystemInfoResponse info() {
        return info;
    }
}
