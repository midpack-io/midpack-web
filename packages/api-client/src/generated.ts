// Hand-written subset of the midpack-server OpenAPI schema, matching
// app/auth/schemas.py. Regenerate the full file from the live backend with:
//   pnpm --filter @midpack/api-client generate
// (openapi-typescript http://localhost:8000/openapi.json -o src/generated.ts)
export interface components {
  schemas: {
    ClientType: "app" | "admin";

    UserResponse: {
      id: string;
      email: string | null;
      name: string | null;
      avatar_url: string | null;
      auth_methods: string[];
      email_verified: boolean;
      is_saas_admin: boolean;
      created_at: string;
    };

    TokenResponse: {
      access_token: string;
      refresh_token?: string | null;
      token_type?: string;
    };

    AuthResponse: {
      user: components["schemas"]["UserResponse"];
      tokens: components["schemas"]["TokenResponse"];
    };

    EmailLoginRequest: {
      email: string;
      password: string;
    };

    EmailRegisterRequest: {
      email: string;
      password: string;
      name?: string | null;
      client_type?: components["schemas"]["ClientType"];
    };

    OAuthRequest: {
      code?: string | null;
      id_token?: string | null;
      access_token?: string | null;
    };

    RequestPasswordResetRequest: {
      email: string;
      client_type?: components["schemas"]["ClientType"];
    };

    ResetPasswordRequest: {
      token: string;
      new_password: string;
    };

    VerifyEmailRequest: {
      token: string;
      client_type?: components["schemas"]["ClientType"];
    };

    ResendVerificationRequest: {
      email: string;
      client_type?: components["schemas"]["ClientType"];
    };

    MessageResponse: {
      message: string;
    };
  };
}
