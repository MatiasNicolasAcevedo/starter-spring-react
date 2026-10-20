// Explicit write/rename allowlist. New source files require an intentional inventory update.
// AGENTS common rules are read from the root; starter-only instructions are excluded on reset.
// Templates/protocols stay canonical and are preserved, not generated as divergent copies.
export const JAVA_FILES = {
  "main": [
    "ServerApplication.java",
    "identity/AppUser.java",
    "identity/AppUserRepository.java",
    "identity/IdentityProfile.java",
    "identity/IdentityService.java",
    "reference/application/ReferenceItemInput.java",
    "reference/application/ReferenceItemNotFoundException.java",
    "reference/application/ReferenceItemPage.java",
    "reference/application/ReferenceItemService.java",
    "reference/application/ReferenceItemView.java",
    "reference/persistence/ReferenceItem.java",
    "reference/persistence/ReferenceItemRepository.java",
    "reference/web/ReferenceExceptionHandler.java",
    "reference/web/ReferenceItemController.java",
    "reference/web/ReferenceOpenApi.java",
    "security/ApiDocsAccess.java",
    "security/ApiDocsConfiguration.java",
    "security/AuthController.java",
    "security/AuthMeResponse.java",
    "security/AuthOpenApi.java",
    "security/GoogleAuthorizationRequestResolver.java",
    "security/HeaderOnlySpaCsrfTokenRequestHandler.java",
    "security/LocalOidcUser.java",
    "security/LocalOidcUserService.java",
    "security/OidcConfiguration.java",
    "security/PublicOrigin.java",
    "security/PublicOriginFilter.java",
    "security/SecurityConfig.java",
    "security/SecurityExceptionHandler.java",
    "shared/error/ApiExceptionHandler.java",
    "shared/error/FieldErrorResponse.java",
    "shared/time/TimeConfiguration.java",
    "system/SystemInfoController.java",
    "system/SystemInfoResponse.java"
  ],
  "test": [
    "ServerApplicationIT.java",
    "TestServerApplication.java",
    "TestcontainersConfiguration.java",
    "identity/AppUserRepositoryIT.java",
    "identity/IdentityServiceIT.java",
    "identity/IdentityServiceTest.java",
    "reference/ReferenceItemIT.java",
    "reference/application/ReferenceItemServiceTest.java",
    "reference/persistence/ReferenceItemMigrationIT.java",
    "reference/persistence/ReferenceItemRepositoryIT.java",
    "reference/web/ReferenceItemControllerTest.java",
    "security/ApiDocsAccessTest.java",
    "security/ApiDocsDisabledIT.java",
    "security/ApiDocsEnabledIT.java",
    "security/AuthControllerTest.java",
    "security/AuthFixtures.java",
    "security/AuthOriginMockMvc.java",
    "security/HttpsAuthCookieTest.java",
    "security/LocalOidcUserServiceTest.java",
    "security/OidcFailureIT.java",
    "security/OidcHttpBrowser.java",
    "security/OidcHttpProvider.java",
    "security/OidcLoginIT.java",
    "security/OidcProfileTest.java",
    "security/OpenApiContractIT.java",
    "security/PublicOriginDiagnosticIT.java",
    "security/PublicOriginIT.java",
    "security/ReadinessIT.java",
    "security/SecurityConfigTest.java",
    "security/SessionCookieIT.java",
    "shared/error/ApiExceptionHandlerTest.java",
    "system/SystemInfoControllerTest.java"
  ]
};
export const REMOVE_FILES = ["docs/tasks/T-005-generic-baseline.md"];
export const TEXT_FILES = [
  "server/pom.xml",
  "server/Dockerfile",
  "server/src/main/resources/application.yaml",
  "docker-compose.yml",
  "e2e/tests/system.spec.ts",
  "e2e/tests/swagger.spec.ts",
  "e2e/tests/auth.spec.ts",
  "server/AGENTS.md",
  "docs/ARCHITECTURE.md",
  "docs/REFERENCE.md",
  "docs/TESTING.md",
  "docs/specs/S-002-local-stack.md",
  "docs/specs/S-003-reference-security.md",
  "LICENSE",
  "client/src/project-identity.json"
];
export const RESET_FILES = [
  "README.md",
  "PROJECT_CONTEXT.md",
  "AGENTS.md",
  "CONTRIBUTING.md",
  "docs/PROJECT.md",
  "docs/ROADMAP.md",
  "docs/STATUS.md",
  "docs/BACKLOG.md",
  "docs/HANDOFF.md",
  "docs/AUTONOMY.md",
  "docs/ORCHESTRATION.md",
  "docs/tasks/T-000-adoption.md"
];
export const IDENTITY_FILE = 'project-identity.json';

// Read-only compatibility guards: the known destinations must remain outside versioned ignores.
export const GUARD_FILES = {
  ".gitignore": "7a5629ec60118823a53f729a1f3b1fb605fd57ca93e297e1865694f96298c05c",
  "server/.gitignore": "089382e4d7944ab6cb6900a1269678ebff93c00d441ada788cd05a8da182b22b",
  "client/.gitignore": "fe718e7babb14f3cbad2d97f08889b9ce5215ed3fe0e43b2b8cfbfb3b9b844e8"
};
