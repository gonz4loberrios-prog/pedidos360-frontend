# 📦 Pedidos360 - Frontend (Angular SPA)

Interfaz de usuario del proyecto Pedidos360: una SPA en **Angular 17** que se autentica contra **Microsoft Entra ID (Azure AD)** mediante **MSAL** y consume las APIs protegidas del backend (BFF).

## 🏗️ Stack Tecnológico

| Capa | Tecnología |
|------|-----------|
| Framework | Angular 17 (standalone) |
| Autenticación | `@azure/msal-angular` + `@azure/msal-browser` |
| HTTP | `@angular/common/http` (con MSAL Interceptor) |
| Backend | Spring Boot (BFF) en `http://localhost:8080` |

## 🔐 Configuración de Seguridad (Azure AD / Entra ID)

La SPA está registrada en el portal de Microsoft Azure como aplicación de tipo *SPA*.

| Configuración | Valor (UUID) |
|---------------|--------------|
| Tenant ID | `933fff9c-10ab-4e02-8b55-7683ea857d4b` |
| Frontend Client ID (SPA) | `2ca505d9-b7d8-498c-a3ba-d7dadbfb0463` |
| Redirect URI | `http://localhost:4200` |
| Scope | `api://6f8c376e-3314-4fcf-a01d-97ba44c25721/access_as_user` |

### Flujo de Autenticación

```
[ Usuario ] ---> (1. Login Request) ---> [ Angular SPA ]
                                              |
                                     (2. Redirect Login)
                                              v
                                     [ Azure AD / Entra ]
                                              |
                                   (3. Retorna Token JWT)
                                              v
[ Backend Spring Boot ] <--- (4. HTTP + Bearer JWT) <--- [ Angular SPA ]
```

### Configuración (`src/environments/environment.ts`)

```ts
export const environment = {
  production: false,
  azure: {
    clientId: '2ca505d9-b7d8-498c-a3ba-d7dadbfb0463',
    tenantId: '933fff9c-10ab-4e02-8b55-7683ea857d4b',
    redirectUri: 'http://localhost:4200',
    scopes: ['api://6f8c376e-3314-4fcf-a01d-97ba44c25721/access_as_user']
  },
  apiGatewayUrl: 'http://localhost:8080'
};
```

El **MSAL Interceptor** adjunta automáticamente el token de acceso a las peticiones dirigidas a `apiGatewayUrl`, por lo que no es necesario gestionar el header `Authorization` de forma manual.

## 🧭 Estructura y Rutas

La aplicación es **standalone** con routing:

| Ruta | Componente | Protección |
|------|-----------|-----------|
| `/` | `components/home/home.component.ts` | Pública (login con Azure AD) |
| `/pedidos` | `components/pedidos/pedidos.component.ts` | **`MsalGuard`** (requiere sesión) |

- **AppComponent**: shell con `<router-outlet>`.
- **HomeComponent**: maneja el flujo de redirección de MSAL (`handleRedirectPromise`) y redirige a `/pedidos` al iniciar sesión.
- **PedidosComponent**: lee los **claims del token JWT** (`roles` y `scp`/scopes) mediante `acquireTokenSilent` + decodificación del payload, y consume `GET /api/pedidos`.

## ▶️ Ejecución

**Requisitos:** Node.js 18+, npm.

```bash
npm install
npm start
```

La aplicación queda disponible en `http://localhost:4200`. Asegúrate de que el backend esté corriendo en `http://localhost:8080` para consumir los pedidos.

## 🧑‍💻 Autores

- Gonzalo Berríos
- Cristian Cerda

**Asignatura:** Cloud Native