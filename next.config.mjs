/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        KEYCLOAK_BASE_URL: process.env.KEYCLOAK_BASE_URL,
        KEYCLOAK_REALM: process.env.KEYCLOAK_REALM,
        KEYCLOAK_ADMIN_USERNAME: process.env.KEYCLOAK_ADMIN_USERNAME,
        KEYCLOAK_ADMIN_PASSWORD: process.env.KEYCLOAK_ADMIN_PASSWORD,
        KEYCLOAK_ADMIN_CLIENT_ID: process.env.KEYCLOAK_ADMIN_CLIENT_ID,
        KEYCLOAK_CLIENT_ID: process.env.KEYCLOAK_CLIENT_ID,
        KEYCLOAK_CLIENT_SECRET: process.env.KEYCLOAK_CLIENT_SECRET,

    
      },
};

export default nextConfig;
