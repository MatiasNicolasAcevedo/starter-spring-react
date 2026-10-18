package com.example.starter.reference.web;

import com.example.starter.reference.application.ReferenceItemInput;
import com.example.starter.reference.application.ReferenceItemPage;
import com.example.starter.reference.application.ReferenceItemService;
import com.example.starter.reference.application.ReferenceItemView;
import com.example.starter.security.AuthOpenApi;
import com.example.starter.security.LocalOidcUser;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import java.net.URI;
import java.util.UUID;
import org.springframework.http.CacheControl;
import org.springframework.http.ProblemDetail;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.InsufficientAuthenticationException;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/reference-items")
@Tag(
        name = "Referencia",
        description = "Elementos privados removibles; dueño exclusivo de la sesión, respuestas no-store")
@SecurityRequirement(name = AuthOpenApi.SESSION_COOKIE)
@ApiResponse(
        responseCode = "400",
        description = "Solicitud inválida",
        content =
                @Content(
                        mediaType = "application/problem+json",
                        schema = @Schema(implementation = ProblemDetail.class)))
@ApiResponse(
        responseCode = "401",
        description = "Sin sesión",
        content =
                @Content(
                        mediaType = "application/problem+json",
                        schema = @Schema(implementation = ProblemDetail.class)))
@ApiResponse(
        responseCode = "403",
        description = "Operación rechazada",
        content =
                @Content(
                        mediaType = "application/problem+json",
                        schema = @Schema(implementation = ProblemDetail.class)))
@ApiResponse(
        responseCode = "404",
        description = "Elemento no disponible",
        content =
                @Content(
                        mediaType = "application/problem+json",
                        schema = @Schema(implementation = ProblemDetail.class)))
public class ReferenceItemController {
    private final ReferenceItemService service;

    public ReferenceItemController(ReferenceItemService service) {
        this.service = service;
    }

    @GetMapping
    @Operation(
            summary = "Lista privada paginada",
            description = "Orden fijo createdAt DESC, id DESC; páginas desde cero, defaults 0/20.")
    public ResponseEntity<ReferenceItemPage> list(
            Authentication authentication,
            @Parameter(description = "Página desde cero", schema = @Schema(defaultValue = "0", minimum = "0"))
                    @RequestParam(defaultValue = "0")
                    @Min(0) int page,
            @Parameter(
                            description = "Tamaño 1…100",
                            schema = @Schema(defaultValue = "20", minimum = "1", maximum = "100"))
                    @RequestParam(defaultValue = "20")
                    @Min(1) @Max(100) int size) {
        return ResponseEntity.ok()
                .cacheControl(CacheControl.noStore())
                .body(service.list(owner(authentication), page, size));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Consulta un elemento propio")
    public ResponseEntity<ReferenceItemView> get(Authentication authentication, @PathVariable UUID id) {
        return ResponseEntity.ok().cacheControl(CacheControl.noStore()).body(service.get(owner(authentication), id));
    }

    @PostMapping
    @Operation(summary = "Crea un elemento privado")
    @SecurityRequirement(name = AuthOpenApi.CSRF_HEADER)
    @ApiResponse(responseCode = "201", description = "Creado; Location relativa al recurso")
    public ResponseEntity<ReferenceItemView> create(
            Authentication authentication, @Valid @RequestBody ReferenceItemInput input) {
        var created = service.create(owner(authentication), input);
        return ResponseEntity.created(URI.create("/api/v1/reference-items/" + created.id()))
                .cacheControl(CacheControl.noStore())
                .body(created);
    }

    @PutMapping("/{id}")
    @Operation(
            summary = "Reemplaza título y descripción propios",
            description = "Sin upsert; conserva propiedad y fecha de creación. Última escritura confirmada.")
    @SecurityRequirement(name = AuthOpenApi.CSRF_HEADER)
    public ResponseEntity<ReferenceItemView> update(
            Authentication authentication, @PathVariable UUID id, @Valid @RequestBody ReferenceItemInput input) {
        return ResponseEntity.ok()
                .cacheControl(CacheControl.noStore())
                .body(service.update(owner(authentication), id, input));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Borra solo el elemento propio")
    @SecurityRequirement(name = AuthOpenApi.CSRF_HEADER)
    @ApiResponse(responseCode = "204", description = "Borrado, sin cuerpo")
    public ResponseEntity<Void> delete(Authentication authentication, @PathVariable UUID id) {
        service.delete(owner(authentication), id);
        return ResponseEntity.noContent().cacheControl(CacheControl.noStore()).build();
    }

    private UUID owner(Authentication authentication) {
        if (authentication == null || !(authentication.getPrincipal() instanceof LocalOidcUser user)) {
            throw new InsufficientAuthenticationException("Se requiere iniciar sesión.");
        }
        return user.identity().id();
    }
}
