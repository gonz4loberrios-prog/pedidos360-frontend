📦 Proyecto Pedidos360 - Arquitectura Cloud Native & Azure ADBienvenido al repositorio del proyecto Pedidos360. Esta solución implementa un patrón de arquitectura BFF (Backend for Frontend) desacoplado, combinando una interfaz SPA en Angular con un servicio backend en Spring Boot, autenticados mediante Microsoft Azure Active Directory (Entra ID).📋 Resumen EjecutivoEl objetivo principal del proyecto es proporcionar un sistema centralizado de gestión de pedidos seguro, moderno y preparado para la nube. La aplicación delega la autenticación y emisión de tokens de seguridad a la plataforma de identidad de Microsoft Azure, garantizando el cumplimiento de estándares como OAuth 2.0 y OpenID Connect (OIDC).🏗️ Arquitectura de la SoluciónLa solución sigue un enfoque de capas independientes:Frontend (Angular SPA):Interfaz de usuario interactiva.Integración con la librería oficial MSAL (Microsoft Authentication Library).Gestión del flujo de inicio de sesión y obtención de tokens JWT.Backend (Spring Boot BFF):Actúa como Resource Server OAuth2.Valida la firma, emisor y audiencia del Token JWT enviado desde la SPA.Expone endpoints protegidos para la lógica de negocio de pedidos.Persistencia (H2 Database):Base de datos relacional en memoria (jdbc:h2:mem:pedidosdb) gestionada con Spring Data JPA para pruebas integradas.🔐 Configuración de Seguridad e Identidad (Azure AD)El sistema utiliza las siguientes identidades registradas en el portal de Microsoft Azure:ConfiguraciónIdentificador (UUID) / ValorTenant ID933fff9c-10ab-4e02-8b55-7683ea857d4bBackend Client ID (API)6f8c376e-3314-4fcf-a01d-97ba44c25721Frontend Client ID (SPA)2ca505d9-b7d8-498c-a3ba-d7dadbfb0463Backend Audienceapi://6f8c376e-3314-4fcf-a01d-97ba44c25721Frontend Scopeapi://6f8c376e-3314-4fcf-a01d-97ba44c25721/access_as_userFlujo de Autenticación[ Usuario ] ---> (1. Login Request) ---> [ Angular SPA ]
                                             |
                                    (2. Redirect Login)
                                             v
                                     [ Azure AD / Entra ]
                                             |
                                   (3. Retorna Token JWT)
                                             v
[ Backend Spring Boot ] <--- (4. HTTP + Bearer JWT) <--- [ Angular SPA ]
          |
  (5. Valida Issuer & Audience)
          v
[ Respuesta 200 OK / Datos ]
⚙️ Detalles de ImplementaciónBackend (application.yml)server:
  port: 8080

spring:
  datasource:
    url: jdbc:h2:mem:pedidosdb
    driverClassName: org.h2.Driver
    username: sa
    password: 
  jpa:
    database-platform: org.hibernate.dialect.H2Dialect
    hibernate:
      ddl-auto: update
  security:
    oauth2:
      resourceserver:
        jwt:
          issuer-uri: https://login.microsoftonline.com/933fff9c-10ab-4e02-8b55-7683ea857d4b/v2.0
          audiences: api://6f8c376e-3314-4fcf-a01d-97ba44c25721
Frontend (environment.ts)export const environment = {
  production: false,
  azure: {
    clientId: '2ca505d9-b7d8-498c-a3ba-d7dadbfb0463',
    tenantId: '933fff9c-10ab-4e02-8b55-7683ea857d4b',
    redirectUri: 'http://localhost:4200',
    scopes: ['api://6f8c376e-3314-4fcf-a01d-97ba44c25721/access_as_user']
  },
  apiGatewayUrl: 'http://localhost:8080'
};
Autores: Gonzalo Berríos, Cristian Cerda
Asignatura: Cloud Native