# FIMAZ — Plataforma de Gestión de Eventos Universitarios
## Documentación de Tesis — Marco Metodológico y Técnico

> **Proyecto:** FIMAZ — Sistema Web para la Gestión y Descubrimiento de Eventos Universitarios  
> **Tecnologías principales:** React 18 · TypeScript · Express.js · PostgreSQL · Drizzle ORM · WebSockets  
> **Versión del documento:** 1.0

---

## Tabla de Contenidos

1. [Capítulo 1 — Fundamentos del Proyecto](#capítulo-1--fundamentos-del-proyecto)
   - 1.1 Planteamiento del Problema
   - 1.2 Justificación
   - 1.3 Objetivos
   - 1.4 Alcance del Sistema
2. [Capítulo 2 — Marco Teórico y Tecnológico](#capítulo-2--marco-teórico-y-tecnológico)
   - 2.1 Arquitectura del Sistema
   - 2.2 Justificación del Stack Tecnológico
   - 2.3 Conceptos Clave
3. [Capítulo 3 — Marco Metodológico](#capítulo-3--marco-metodológico)
   - 3.1 Tipo y Diseño de Investigación
   - 3.2 Metodología de Desarrollo de Software
   - 3.3 Fases del Proyecto
   - 3.4 Herramientas y Tecnologías Utilizadas
   - 3.5 Diseño de la Base de Datos
   - 3.6 Arquitectura del Sistema
   - 3.7 Diseño de la Interfaz de Usuario
4. [Capítulo 4 — Diseño del Sistema](#capítulo-4--diseño-del-sistema)
   - 4.1 Modelo Entidad-Relación
   - 4.2 Diagrama de Arquitectura
   - 4.3 Casos de Uso
   - 4.4 Flujo de Autenticación
5. [Capítulo 5 — Implementación por Módulos](#capítulo-5--implementación-por-módulos)
   - 5.1 Módulo de Autenticación
   - 5.2 Módulo de Eventos
   - 5.3 Módulo Social
   - 5.4 Módulo de Chat en Tiempo Real
   - 5.5 Módulo de Notificaciones
   - 5.6 Panel de Administración
6. [Capítulo 6 — Pruebas y Resultados](#capítulo-6--pruebas-y-resultados)
   - 6.1 Pruebas Funcionales por Endpoint
   - 6.2 Requerimientos No Funcionales y Validación
7. [Capítulo 7 — Conclusiones y Trabajo Futuro](#capítulo-7--conclusiones-y-trabajo-futuro)
   - 7.1 Conclusiones
   - 7.2 Trabajo Futuro
   - 7.3 Referencias Bibliográficas

---

## Capítulo 1 — Fundamentos del Proyecto

### 1.1 Planteamiento del Problema

Las instituciones universitarias generan una gran cantidad de eventos académicos, culturales y deportivos de manera continua. Sin embargo, la difusión de estos eventos suele realizarse de forma fragmentada y descentralizada: se publican en murales físicos, grupos de WhatsApp, redes sociales generales o mediante correo electrónico. Este enfoque presenta las siguientes problemáticas:

- **Fragmentación de la información:** Un estudiante debe consultar múltiples fuentes para conocer los eventos disponibles.
- **Falta de interacción:** Los medios tradicionales no permiten confirmar asistencia, dar retroalimentación ni generar conversación en torno a los eventos.
- **Nula personalización:** No existe un mecanismo que filtre eventos por categoría, fecha o interés personal del estudiante.
- **Gestión administrativa ineficiente:** Los administradores no cuentan con herramientas que les permitan crear, editar, archivar eventos ni visualizar métricas de participación en un solo lugar.

Este escenario pone de manifiesto la necesidad de una plataforma digital unificada, diseñada específicamente para el ecosistema universitario, que centralice la gestión y el descubrimiento de eventos al mismo tiempo que fomente la participación activa de la comunidad estudiantil.

---

### 1.2 Justificación

El desarrollo de FIMAZ se justifica en tres dimensiones:

**Dimensión tecnológica:** El avance de las tecnologías web modernas (aplicaciones de una sola página, comunicación en tiempo real, bases de datos relacionales tipadas) permite construir plataformas altamente interactivas con menor costo de desarrollo. Adoptar este tipo de herramientas en el contexto universitario representa un avance significativo respecto a los métodos actuales.

**Dimensión social:** La participación estudiantil en eventos universitarios contribuye directamente al desarrollo integral del alumno. Una plataforma que facilite el descubrimiento de eventos y que genere comunidad en torno a ellos tiene impacto directo en la vida académica y social de los estudiantes.

**Dimensión administrativa:** La centralización de la gestión de eventos en un panel de administración con métricas en tiempo real permite a los organizadores tomar decisiones informadas sobre la programación de actividades, la popularidad de categorías y el nivel de participación.

---

### 1.3 Objetivos

#### Objetivo General

Desarrollar una plataforma web de gestión y descubrimiento de eventos universitarios que integre características sociales, comunicación en tiempo real y un panel de administración con métricas, con el fin de centralizar y dinamizar la participación de la comunidad universitaria.

#### Objetivos Específicos

1. Diseñar e implementar un sistema de autenticación seguro con roles diferenciados (administrador y estudiante).
2. Desarrollar un módulo de gestión de eventos que permita crear, editar, archivar y eliminar eventos clasificados por categoría.
3. Implementar características sociales que permitan a los usuarios dar "me gusta", comentar y confirmar asistencia a eventos.
4. Desarrollar un sistema de mensajería en tiempo real entre usuarios mediante WebSockets.
5. Diseñar un módulo de notificaciones automáticas que informe a los usuarios sobre eventos relevantes y actividad social.
6. Construir un panel de administración con métricas visuales, gestión de usuarios y herramientas de moderación de contenido.
7. Asegurar que la plataforma sea responsiva y accesible desde dispositivos móviles, tabletas y computadoras de escritorio.

---

### 1.4 Alcance del Sistema

#### Lo que incluye el sistema

| Área | Funcionalidades incluidas |
|------|--------------------------|
| Autenticación | Registro inicial (bootstrap), inicio de sesión, cierre de sesión, control de acceso por roles |
| Eventos | Listado, filtrado por categoría y tiempo, detalle, creación, edición, archivado y eliminación |
| Interacción social | Me gusta, comentarios, confirmación de asistencia, seguimiento de usuarios |
| Comunicación | Chat directo entre usuarios con mensajería en tiempo real (WebSockets) |
| Notificaciones | Notificaciones automáticas por actualizaciones de eventos, nuevos comentarios, nuevos seguidores y mensajes |
| Administración | Dashboard con métricas, gestión de usuarios (crear, bloquear, cambiar rol), moderación de comentarios |
| Interfaz | Diseño responsivo para móvil, tableta y escritorio |

#### Lo que NO incluye el sistema (fuera de alcance)

- Notificaciones push nativas (web push / FCM)
- Aplicación móvil nativa (iOS / Android)
- Integración con sistemas académicos institucionales (SIIA, ERP, etc.)
- Pago en línea o registro pagado a eventos
- Transmisión en vivo de eventos
- Carga de archivos adjuntos (documentos, presentaciones)

---

## Capítulo 2 — Marco Teórico y Tecnológico

### 2.1 Arquitectura del Sistema

El sistema sigue el **patrón arquitectónico Cliente-Servidor** de tres capas:

```
┌─────────────────────────────────────────┐
│          CAPA DE PRESENTACIÓN           │
│   React 18 + TypeScript + Vite          │
│   Tailwind CSS + Radix UI               │
│   React Query (estado del servidor)     │
│   Wouter (enrutamiento cliente)         │
└─────────────────┬───────────────────────┘
                  │ HTTP / REST
                  │ WebSocket (ws://)
┌─────────────────▼───────────────────────┐
│           CAPA DE NEGOCIO               │
│   Express.js 4 + Node.js                │
│   Middleware: express-session, bcrypt   │
│   Validación: Zod                       │
│   WebSocket Server (ws)                 │
└─────────────────┬───────────────────────┘
                  │ SQL
┌─────────────────▼───────────────────────┐
│           CAPA DE DATOS                 │
│   PostgreSQL (base de datos relacional) │
│   Drizzle ORM (acceso tipado a datos)   │
└─────────────────────────────────────────┘
```

**Comunicación REST:** La mayor parte de las operaciones (CRUD de eventos, gestión de usuarios, notificaciones) se realiza a través de una API REST con rutas bajo el prefijo `/api/`. Cada respuesta es en formato JSON.

**Comunicación WebSocket:** El módulo de chat en tiempo real utiliza el protocolo WebSocket mediante la biblioteca `ws`. Cuando un usuario envía un mensaje, el servidor lo retransmite al destinatario sin necesidad de que el cliente realice polling.

**Código compartido:** El directorio `shared/` contiene el esquema de la base de datos y los tipos TypeScript, que son consumidos tanto por el cliente como por el servidor, garantizando consistencia de tipos en toda la aplicación.

---

### 2.2 Justificación del Stack Tecnológico

#### Frontend

| Tecnología | Versión | Justificación |
|-----------|---------|---------------|
| **React** | 18.3 | Biblioteca de componentes reutilizables con ecosistema maduro. Su modelo de componentes funcionales y hooks simplifica la gestión del estado de la UI. Se eligió sobre Angular por su menor curva de aprendizaje y sobre Vue por su mayor adopción en el mercado. |
| **TypeScript** | 5.6 | Superset de JavaScript que añade tipado estático. Permite detectar errores en tiempo de compilación, mejora el autocompletado del IDE y facilita el mantenimiento del código a largo plazo. |
| **Vite** | 5.4 | Herramienta de construcción de nueva generación que utiliza ES modules nativos en desarrollo, resultando en tiempos de arranque casi instantáneos. Se eligió sobre Create React App (obsoleto) y Webpack por su mayor velocidad. |
| **Tailwind CSS** | 3.4 | Framework CSS de utilidades que elimina la necesidad de escribir CSS personalizado para la mayoría de los casos. Permite un desarrollo de UI rápido y consistente. Su integración con Vite es nativa. |
| **Radix UI** | múltiples | Biblioteca de componentes accesibles y sin estilos. Provee los comportamientos de accesibilidad (ARIA, navegación por teclado) en componentes como diálogos, menús desplegables y tooltips, eliminando la necesidad de implementarlos manualmente. |
| **TanStack Query** | 5.60 | Gestión de estado del servidor. Maneja el caché, la sincronización y las invalidaciones de datos remotos de forma declarativa. Se eligió sobre Redux Toolkit Query por su menor boilerplate y su API más intuitiva. |
| **Wouter** | 3.3 | Enrutador cliente ligero (< 2KB) que cubre los casos de uso de la aplicación sin la complejidad de React Router v6. |
| **Recharts** | 2.15 | Biblioteca de gráficas construida sobre D3 con una API declarativa para React. Utilizada en el panel de métricas del administrador. |
| **Framer Motion** | 11.13 | Biblioteca de animaciones declarativas para React. Utilizada para transiciones de página y animaciones sutiles de componentes. |
| **Zod** | 3.24 | Biblioteca de validación de esquemas con inferencia de tipos TypeScript. Se usa en el frontend para validar formularios y en el backend para validar cuerpos de solicitudes HTTP. |

#### Backend

| Tecnología | Versión | Justificación |
|-----------|---------|---------------|
| **Express.js** | 4.21 | Framework web minimalista para Node.js. Se eligió sobre Fastify por su mayor ecosistema de middleware y sobre NestJS por su simplicidad para una aplicación de este tamaño. |
| **Node.js** | LTS | Permite utilizar JavaScript/TypeScript en el servidor, unificando el lenguaje en toda la aplicación (frontend + backend + esquema compartido). |
| **PostgreSQL** | latest | Base de datos relacional robusta con soporte para tipos avanzados, transacciones ACID e integridad referencial. Se eligió sobre MySQL por sus características avanzadas y sobre MongoDB por la naturaleza relacional de los datos. |
| **Drizzle ORM** | 0.39 | ORM TypeScript-first que genera queries SQL con inferencia de tipos estáticos. Se eligió sobre Prisma por su menor overhead en tiempo de ejecución y porque no requiere un paso de generación de código separado. |
| **bcrypt** | 6.0 | Algoritmo de hashing de contraseñas con sal incorporada. Estándar de la industria para el almacenamiento seguro de contraseñas. |
| **express-session + connect-pg-simple** | 1.18 / 10.0 | Gestión de sesiones del servidor almacenadas en PostgreSQL. Más seguro que las sesiones basadas en JWT para aplicaciones con necesidad de invalidación inmediata de sesiones. |
| **ws** | 8.18 | Implementación de WebSocket de bajo nivel para Node.js. Se eligió sobre Socket.io por su menor peso y ausencia de dependencias adicionales, dado que solo se requiere mensajería unidireccional simple. |

---

### 2.3 Conceptos Clave

**SPA (Single Page Application):** Aplicación web que carga una única página HTML y actualiza dinámicamente el contenido mediante JavaScript, sin recargas completas de página. React y Vite permiten construir SPAs con un rendimiento percibido superior al de las aplicaciones web tradicionales multi-página.

**ORM (Object-Relational Mapper):** Capa de abstracción que permite interactuar con la base de datos usando el lenguaje de programación del proyecto en lugar de SQL puro. Drizzle ORM traduce operaciones TypeScript a consultas SQL optimizadas, reduciendo errores de escritura manual de queries.

**Autenticación por sesiones:** Mecanismo en el que el servidor genera un identificador de sesión único al iniciar sesión, lo almacena en la base de datos y lo envía al cliente como una cookie. En cada solicitud subsecuente, el cliente envía esta cookie y el servidor verifica la sesión en la base de datos. Es más seguro que JWT para casos donde se requiere invalidación inmediata.

**WebSockets:** Protocolo de comunicación bidireccional y full-duplex sobre TCP. Permite al servidor enviar datos al cliente sin que este los solicite (push), lo que es fundamental para la mensajería en tiempo real. Se establece mediante un handshake HTTP y luego mantiene la conexión abierta.

**Drizzle Schema como fuente de verdad:** En FIMAZ, el archivo `shared/schema.ts` define tanto el esquema de la base de datos (tablas, columnas, relaciones) como los tipos TypeScript que se usan en todo el proyecto. Esto garantiza que el modelo de datos sea consistente entre la capa de base de datos, el servidor y el cliente.

---

## Capítulo 3 — Marco Metodológico

### 3.1 Tipo y Diseño de Investigación

El presente trabajo corresponde a una **investigación aplicada** del tipo **proyecto de desarrollo tecnológico**. No se busca generar nuevo conocimiento teórico, sino aplicar conocimiento existente en ciencias de la computación e ingeniería de software para construir un artefacto tecnológico que resuelva un problema real: la centralización y dinamización de la gestión de eventos universitarios.

El enfoque es **cuantitativo-descriptivo** en lo que respecta a la medición de funcionalidades implementadas y endpoints disponibles, y **cualitativo** en lo que respecta a las decisiones de diseño de experiencia de usuario.

---

### 3.2 Metodología de Desarrollo de Software

Se adoptó una metodología de **desarrollo iterativo-incremental**, inspirada en los principios del Manifiesto Ágil, adaptada a un equipo de desarrollo pequeño. Esta metodología fue seleccionada por las siguientes razones:

1. **Los requerimientos evolucionan:** Al tratarse de un producto nuevo, no era posible definir todos los requerimientos con precisión al inicio. El enfoque iterativo permitió incorporar retroalimentación en cada ciclo.
2. **Entregables funcionales frecuentes:** Cada iteración produce un incremento funcional del software que puede ser evaluado.
3. **Flexibilidad ante el cambio:** El diseño modular del sistema (módulos independientes de autenticación, eventos, chat, etc.) facilita la adición de nuevas funcionalidades sin reescribir el sistema.

**Ciclo de vida utilizado: Prototipado Evolutivo**

```
  Análisis inicial
       ↓
  Prototipo básico  ←──────────────┐
       ↓                           │
  Evaluación y feedback            │
       ↓                           │
  ¿Cumple expectativas? ──No──────→┘
       ↓ Sí
  Refinamiento y entrega
```

El desarrollo se organizó en **sprints informales** de aproximadamente una semana cada uno, con los siguientes entregables:

| Sprint | Módulo | Entregable |
|--------|--------|-----------|
| 1 | Infraestructura | Proyecto configurado, BD conectada, servidor Express corriendo |
| 2 | Autenticación | Login, sesiones, roles, middleware de protección |
| 3 | Eventos | CRUD completo de eventos, categorías, filtros |
| 4 | Social | Likes, comentarios, asistencias, seguidores |
| 5 | Chat | WebSockets, mensajería en tiempo real |
| 6 | Notificaciones | Sistema de notificaciones automáticas |
| 7 | Admin | Dashboard, métricas, moderación, gestión de usuarios |
| 8 | UI/UX | Diseño responsivo, pulido visual, accesibilidad |

---

### 3.3 Fases del Proyecto

#### 3.3.1 Análisis de Requerimientos

En esta fase se identificaron los actores del sistema y sus necesidades:

**Actores del sistema:**
- **Estudiante:** Usuario registrado que descubre eventos, interactúa con la comunidad y se comunica con otros usuarios.
- **Administrador:** Usuario con privilegios elevados que gestiona el contenido de la plataforma.
- **Sistema:** Actor que ejecuta procesos automáticos como la generación de notificaciones.

**Requerimientos Funcionales:**

| ID | Descripción | Actor | Prioridad |
|----|-------------|-------|-----------|
| RF-01 | El sistema debe permitir el inicio de sesión con email y contraseña | Estudiante / Admin | Alta |
| RF-02 | El sistema debe permitir el cierre de sesión | Estudiante / Admin | Alta |
| RF-03 | El sistema debe mostrar el listado de eventos activos | Estudiante / Admin | Alta |
| RF-04 | El sistema debe permitir filtrar eventos por categoría (académico, cultural, deportivo) | Estudiante | Alta |
| RF-05 | El sistema debe mostrar el detalle completo de un evento | Estudiante / Admin | Alta |
| RF-06 | Los usuarios autenticados deben poder dar "me gusta" a un evento | Estudiante | Media |
| RF-07 | Los usuarios autenticados deben poder comentar en un evento | Estudiante | Media |
| RF-08 | Los usuarios autenticados deben poder confirmar asistencia a un evento | Estudiante | Alta |
| RF-09 | Los usuarios deben poder seguirse entre sí | Estudiante | Media |
| RF-10 | El sistema debe proveer mensajería en tiempo real entre usuarios | Estudiante | Alta |
| RF-11 | El sistema debe generar notificaciones automáticas | Sistema | Media |
| RF-12 | Los administradores deben poder crear, editar y eliminar eventos | Admin | Alta |
| RF-13 | Los administradores deben poder archivar eventos | Admin | Alta |
| RF-14 | Los administradores deben poder gestionar usuarios (crear, bloquear, cambiar rol) | Admin | Alta |
| RF-15 | Los administradores deben poder moderar comentarios | Admin | Media |
| RF-16 | El dashboard de administración debe mostrar métricas del sistema | Admin | Media |
| RF-17 | El sistema debe crear el primer usuario administrador mediante un proceso de bootstrap | Admin | Alta |

**Requerimientos No Funcionales:**

| ID | Categoría | Descripción |
|----|-----------|-------------|
| RNF-01 | Seguridad | Las contraseñas se almacenan con hash bcrypt (factor de coste 10) |
| RNF-02 | Seguridad | Las sesiones se almacenan en la base de datos con expiración de 7 días |
| RNF-03 | Seguridad | Las cookies de sesión son HttpOnly (no accesibles desde JavaScript) |
| RNF-04 | Seguridad | Los endpoints de administración requieren verificación de rol en el servidor |
| RNF-05 | Rendimiento | El tiempo de respuesta de la API debe ser menor a 2 segundos en condiciones normales |
| RNF-06 | Usabilidad | La interfaz debe ser responsiva y funcionar en pantallas desde 320px de ancho |
| RNF-07 | Usabilidad | Los elementos interactivos deben tener un área mínima de toque de 44×44px en móvil |
| RNF-08 | Escalabilidad | La arquitectura modular debe permitir añadir nuevos módulos sin modificar los existentes |
| RNF-09 | Mantenibilidad | El código base comparte tipos TypeScript entre cliente y servidor |
| RNF-10 | Accesibilidad | Los componentes interactivos deben incluir atributos ARIA correctos |

#### 3.3.2 Diseño del Sistema

En esta fase se produjeron los siguientes artefactos:

- Modelo Entidad-Relación de la base de datos (ver Capítulo 4)
- Diagrama de arquitectura del sistema (ver Capítulo 4)
- Casos de uso principales (ver Capítulo 4)
- Guía de diseño de la interfaz de usuario (`design_guidelines.md`)

Las decisiones de diseño más relevantes fueron:

1. **Esquema compartido:** Colocar el esquema de la BD en `shared/schema.ts` permite que cliente y servidor compartan tipos sin duplicación de código.
2. **Separación de roles en middleware:** Implementar `requireAuth` y `requireAdmin` como middleware independientes facilita proteger cualquier ruta con una sola línea.
3. **Toggle en lugar de insert/delete:** Las operaciones de like, asistencia y follow se implementaron como "toggle" (si existe → eliminar, si no existe → crear), simplificando la lógica del cliente.

#### 3.3.3 Implementación

La implementación siguió una estrategia **bottom-up** (de la capa de datos hacia la interfaz de usuario):

1. Definición del esquema de base de datos en Drizzle ORM
2. Implementación de la capa de acceso a datos (`storage.ts`)
3. Implementación de las rutas de la API (`routes.ts`)
4. Implementación de los componentes de la interfaz de usuario

Esta estrategia garantiza que cada capa tenga una base sólida antes de construir la siguiente.

#### 3.3.4 Pruebas

Las pruebas realizadas fueron principalmente **funcionales manuales**, verificando que cada endpoint devuelva los códigos HTTP correctos y los datos esperados. Ver Capítulo 6 para el detalle.

---

### 3.4 Herramientas y Tecnologías Utilizadas

#### 3.4.1 Entorno de Desarrollo

| Herramienta | Propósito |
|-------------|-----------|
| **Node.js** (LTS) | Entorno de ejecución JavaScript del servidor |
| **tsx** | Ejecución de TypeScript directamente sin compilación previa (desarrollo) |
| **ESBuild** | Bundler de alta velocidad para la compilación de producción del servidor |
| **Vite** | Servidor de desarrollo con HMR (Hot Module Replacement) para el cliente |
| **drizzle-kit** | Herramienta de línea de comandos para migraciones de base de datos (`db:push`) |
| **TypeScript** | Compilador y chequeador de tipos (`tsc --noEmit`) |
| **dotenv** | Carga de variables de entorno desde el archivo `.env` |

#### 3.4.2 Control de Versiones

El proyecto utiliza **Git** como sistema de control de versiones, alojado en **GitHub**. El historial de commits sirve como evidencia del desarrollo iterativo del proyecto.

Comandos de desarrollo:
```bash
npm run dev        # Inicia el servidor de desarrollo (cliente + servidor juntos)
npm run build      # Compila el proyecto para producción
npm start          # Inicia el servidor en modo producción
npm run check      # Verifica los tipos TypeScript
npm run db:push    # Sincroniza el esquema con la base de datos
```

#### 3.4.3 Stack Tecnológico (Resumen)

Ver justificación detallada en la Sección 2.2.

---

### 3.5 Diseño de la Base de Datos

El esquema fue definido mediante **Drizzle ORM** en el archivo `shared/schema.ts`. Se utilizaron los siguientes tipos de datos de PostgreSQL: `text`, `varchar`, `integer`, `timestamp`, `boolean` y `pgEnum` para los campos de tipo enumerado.

**Enumeraciones definidas:**

| Enum | Valores |
|------|---------|
| `role` | `admin`, `student` |
| `category` | `academico`, `cultural`, `deportivo` |
| `notification_type` | `event_update`, `new_comment`, `new_follower`, `new_message` |

**Descripción de entidades:**

| Tabla | Descripción | Campos clave |
|-------|-------------|--------------|
| `users` | Usuarios de la plataforma | `id`, `name`, `email`, `password` (hash), `role`, `isBlocked`, `createdAt` |
| `events` | Eventos universitarios | `id`, `title`, `description`, `category`, `eventDate`, `location`, `imageUrl`, `isArchived`, `views`, `createdBy` |
| `comments` | Comentarios de usuarios en eventos | `id`, `eventId`, `userId`, `content`, `createdAt` |
| `likes` | Registro de "me gusta" | `id`, `eventId`, `userId`, `createdAt` |
| `attendances` | Confirmaciones de asistencia a eventos | `id`, `eventId`, `userId`, `createdAt` |
| `followers` | Relaciones de seguimiento entre usuarios | `id`, `followerId`, `followingId`, `createdAt` |
| `chats` | Conversaciones entre dos usuarios | `id`, `user1Id`, `user2Id`, `createdAt`, `lastMessageAt` |
| `messages` | Mensajes dentro de una conversación | `id`, `chatId`, `senderId`, `content`, `createdAt`, `isRead` |
| `notifications` | Notificaciones del sistema para usuarios | `id`, `userId`, `type`, `referenceId`, `message`, `isRead`, `createdAt` |

**Relaciones principales:**
- `users` ← 1:N → `events` (un usuario crea muchos eventos)
- `events` ← 1:N → `comments`, `likes`, `attendances`
- `users` ← 1:N → `comments`, `likes`, `attendances`
- `users` ← N:M → `users` (tabla `followers` como tabla pivote)
- `users` ← 1:N → `chats` (como `user1` o `user2`)
- `chats` ← 1:N → `messages`
- `users` ← 1:N → `notifications`

> **Herramienta recomendada para diagrama ER:** [dbdiagram.io](https://dbdiagram.io) — gratuita, permite importar DDL y exportar como PNG.

---

### 3.6 Arquitectura del Sistema

```
┌──────────────────────────────────────────────────────────────┐
│                     CLIENTE (Browser)                        │
│                                                              │
│  ┌─────────────┐  ┌──────────────┐  ┌──────────────────┐   │
│  │  Wouter     │  │ TanStack     │  │  React           │   │
│  │  (Router)   │  │ Query        │  │  Components      │   │
│  │             │  │ (Cache)      │  │  (UI)            │   │
│  └──────┬──────┘  └──────┬───────┘  └────────┬─────────┘   │
│         └────────────────┴──────────────────┘              │
│                          │                                   │
│              ┌───────────▼──────────┐                       │
│              │   Vite / React App   │                       │
│              │   (SPA - index.html) │                       │
│              └───────────┬──────────┘                       │
└──────────────────────────┼───────────────────────────────────┘
                           │ HTTP/REST (fetch)
                           │ WebSocket (ws://)
┌──────────────────────────┼───────────────────────────────────┐
│                  SERVIDOR (Node.js)                          │
│                           │                                   │
│              ┌────────────▼──────────┐                       │
│              │     Express.js        │                       │
│              │  - Session middleware │                       │
│              │  - requireAuth        │                       │
│              │  - requireAdmin       │                       │
│              └────────────┬──────────┘                       │
│                           │                                   │
│         ┌─────────────────┼──────────────────┐              │
│         ▼                 ▼                  ▼              │
│   ┌──────────┐    ┌──────────────┐   ┌──────────────┐      │
│   │ routes.ts│    │  storage.ts  │   │  WebSocket   │      │
│   │ (API)    │───→│  (Business   │   │  Server (ws) │      │
│   │          │    │   Logic)     │   └──────────────┘      │
│   └──────────┘    └──────┬───────┘                         │
│                           │                                   │
│              ┌────────────▼──────────┐                       │
│              │     Drizzle ORM       │                       │
│              └────────────┬──────────┘                       │
└───────────────────────────┼───────────────────────────────────┘
                            │ SQL
┌───────────────────────────┼───────────────────────────────────┐
│                  BASE DE DATOS (PostgreSQL)                   │
│                           │                                   │
│  users · events · comments · likes · attendances             │
│  followers · chats · messages · notifications                 │
└───────────────────────────────────────────────────────────────┘
```

---

### 3.7 Diseño de la Interfaz de Usuario

El diseño de la interfaz de FIMAZ sigue un **sistema híbrido** que combina tres filosofías de diseño:

- **Linear:** Arquitectura de información limpia y jerarquía clara.
- **Instagram:** Patrones de interacción social (likes, comentarios, seguidores).
- **Notion:** Organización jerárquica del contenido.

**Sistema tipográfico:**

| Uso | Fuente | Tamaño | Peso |
|-----|--------|--------|------|
| Títulos de eventos | Inter | 2xl–3xl | Semibold |
| Encabezados de sección | Inter | xl | Semibold |
| Contenido de cuerpo | System UI | base | Normal |
| Metadatos y fechas | System UI | sm–xs | Normal |

**Paleta de colores y espaciado:**
- Unidades de espaciado Tailwind: 2, 4, 8, 12, 16
- Padding de componentes: p-4, p-6
- Espaciado entre secciones: gap-8, space-y-12

**Pantallas principales del sistema:**

| Pantalla | Descripción |
|----------|-------------|
| **Inicio de sesión** | Formulario centrado con email y contraseña |
| **Feed público** | Barra de navegación → Filtros de categoría → Grid de tarjetas de eventos (2 columnas en desktop) |
| **Detalle de evento** | Imagen hero → Información → Botón "Asistiré" → Descripción → Comentarios |
| **Perfil de usuario** | Datos del usuario → Eventos que le gustan → Eventos a los que asiste → Seguidores/Seguidos |
| **Chat** | Lista de conversaciones (izquierda) → Mensajes en tiempo real (derecha) |
| **Dashboard Admin** | Sidebar de navegación → Grid de métricas → Tablas de gestión |

**Diseño responsivo:**

| Breakpoint | Comportamiento |
|-----------|----------------|
| Móvil (< 768px) | Columna única, navegación inferior, filtros colapsables |
| Tableta (768–1024px) | Grid de 2 columnas, sidebar estrecho |
| Desktop (> 1024px) | Grid de 2–3 columnas, sidebar persistente en admin |

> Para más detalle sobre el sistema de diseño, ver el archivo [`design_guidelines.md`](./design_guidelines.md).

---

## Capítulo 4 — Diseño del Sistema

### 4.1 Modelo Entidad-Relación

A continuación se describe el modelo ER en formato textual. Para generar el diagrama visual, importar el siguiente código en [dbdiagram.io](https://dbdiagram.io):

```dbml
Table users {
  id integer [pk, increment]
  name text [not null]
  email text [not null, unique]
  password text [not null]
  role role_enum [not null, default: 'student']
  is_blocked boolean [not null, default: false]
  created_at timestamp [not null, default: 'now()']
}

Table events {
  id integer [pk, increment]
  title text [not null]
  description text [not null]
  category category_enum [not null]
  event_date timestamp [not null]
  location text [not null]
  image_url text
  is_archived boolean [not null, default: false]
  views integer [not null, default: 0]
  created_at timestamp [not null, default: 'now()']
  created_by integer [ref: > users.id]
}

Table comments {
  id integer [pk, increment]
  event_id integer [not null, ref: > events.id]
  user_id integer [not null, ref: > users.id]
  content text [not null]
  created_at timestamp [not null, default: 'now()']
}

Table likes {
  id integer [pk, increment]
  event_id integer [not null, ref: > events.id]
  user_id integer [not null, ref: > users.id]
  created_at timestamp [not null, default: 'now()']
}

Table attendances {
  id integer [pk, increment]
  event_id integer [not null, ref: > events.id]
  user_id integer [not null, ref: > users.id]
  created_at timestamp [not null, default: 'now()']
}

Table followers {
  id integer [pk, increment]
  follower_id integer [not null, ref: > users.id]
  following_id integer [not null, ref: > users.id]
  created_at timestamp [not null, default: 'now()']
}

Table chats {
  id integer [pk, increment]
  user1_id integer [not null, ref: > users.id]
  user2_id integer [not null, ref: > users.id]
  created_at timestamp [not null, default: 'now()']
  last_message_at timestamp [not null, default: 'now()']
}

Table messages {
  id integer [pk, increment]
  chat_id integer [not null, ref: > chats.id]
  sender_id integer [not null, ref: > users.id]
  content text [not null]
  created_at timestamp [not null, default: 'now()']
  is_read boolean [not null, default: false]
}

Table notifications {
  id integer [pk, increment]
  user_id integer [not null, ref: > users.id]
  type notification_type_enum [not null]
  reference_id integer
  message text [not null]
  is_read boolean [not null, default: false]
  created_at timestamp [not null, default: 'now()']
}
```

---

### 4.2 Diagrama de Arquitectura

Ver diagrama ASCII en la Sección 3.6.

Para el diagrama visual, se recomienda utilizar [draw.io](https://draw.io) o [Lucidchart](https://lucidchart.com) con tres capas diferenciadas:
1. **Capa de Presentación** (azul): React, Vite, Tailwind
2. **Capa de Negocio** (verde): Express.js, Middleware, WebSocket
3. **Capa de Datos** (naranja): PostgreSQL, Drizzle ORM

---

### 4.3 Casos de Uso

#### Actor: Estudiante

| Caso de Uso | Descripción | Precondición |
|-------------|-------------|--------------|
| CU-01: Ver eventos | El estudiante visualiza el listado de eventos activos, opcionalmente filtrado por categoría | Ninguna (público) |
| CU-02: Ver detalle de evento | El estudiante accede al detalle completo de un evento | Ninguna (público) |
| CU-03: Iniciar sesión | El estudiante ingresa sus credenciales para autenticarse | Cuenta existente |
| CU-04: Dar "me gusta" | El estudiante marca un evento como favorito | Autenticado |
| CU-05: Comentar evento | El estudiante publica un comentario en un evento | Autenticado |
| CU-06: Confirmar asistencia | El estudiante registra que asistirá al evento | Autenticado |
| CU-07: Seguir a otro usuario | El estudiante sigue el perfil de otro usuario | Autenticado |
| CU-08: Enviar mensaje | El estudiante inicia o continúa una conversación con otro usuario | Autenticado |
| CU-09: Ver notificaciones | El estudiante revisa sus notificaciones pendientes | Autenticado |
| CU-10: Editar perfil | El estudiante actualiza su nombre de usuario | Autenticado |

#### Actor: Administrador

| Caso de Uso | Descripción | Precondición |
|-------------|-------------|--------------|
| CU-11: Crear evento | El administrador crea un nuevo evento con todos sus detalles | Autenticado como Admin |
| CU-12: Editar evento | El administrador modifica los datos de un evento existente | Autenticado como Admin |
| CU-13: Archivar evento | El administrador oculta un evento del feed público | Autenticado como Admin |
| CU-14: Eliminar evento | El administrador elimina permanentemente un evento | Autenticado como Admin |
| CU-15: Gestionar usuarios | El administrador crea, bloquea o cambia el rol de usuarios | Autenticado como Admin |
| CU-16: Moderar comentarios | El administrador elimina comentarios inapropiados | Autenticado como Admin |
| CU-17: Ver métricas | El administrador visualiza estadísticas del sistema | Autenticado como Admin |

#### Actor: Sistema

| Caso de Uso | Descripción | Trigger |
|-------------|-------------|---------|
| CU-18: Generar notificación de comentario | El sistema notifica al creador del evento de un nuevo comentario | Post de comentario |
| CU-19: Generar notificación de seguidor | El sistema notifica al usuario cuando alguien lo sigue | Nuevo seguimiento |
| CU-20: Generar notificación de mensaje | El sistema notifica al usuario de un nuevo mensaje | Nuevo mensaje |

---

### 4.4 Flujo de Autenticación

```
Cliente                         Servidor                         Base de Datos
  │                                │                                    │
  │  POST /api/auth/login          │                                    │
  │  { email, password }           │                                    │
  │──────────────────────────────→│                                    │
  │                                │  Zod.parse(body)                  │
  │                                │  storage.getUserByEmail(email)────→│
  │                                │←──────────────────────────────────│
  │                                │  bcrypt.compare(password, hash)   │
  │                                │                                    │
  │                                │  [Si usuario bloqueado]           │
  │                                │  → return 403                     │
  │                                │                                    │
  │                                │  [Si contraseña inválida]         │
  │                                │  → return 401                     │
  │                                │                                    │
  │                                │  req.session.userId = user.id     │
  │                                │  [Guarda sesión en PG]────────────→│
  │←──────────────────────────────│                                    │
  │  200 OK                        │                                    │
  │  Set-Cookie: session_id        │                                    │
  │  { user (sin password) }       │                                    │
  │                                │                                    │
  │  [Solicitudes subsecuentes]    │                                    │
  │  Cookie: session_id            │                                    │
  │──────────────────────────────→│                                    │
  │                                │  [requireAuth middleware]          │
  │                                │  req.session.userId existe?        │
  │                                │  ─ No → 401                       │
  │                                │  ─ Sí → next()                    │
```

---

## Capítulo 5 — Implementación por Módulos

### 5.1 Módulo de Autenticación

**Archivos relevantes:** `server/routes.ts` (líneas 59–108, 560–588)

**Descripción:**  
El módulo de autenticación gestiona el ciclo completo de una sesión de usuario. Utiliza **bcrypt** (factor de coste por defecto de bcrypt) para el hash de contraseñas antes de almacenarlas. Las sesiones se almacenan en la tabla `user_sessions` de PostgreSQL mediante `connect-pg-simple`, con una duración de 7 días.

**Endpoints implementados:**

| Método | Ruta | Descripción | Acceso |
|--------|------|-------------|--------|
| `POST` | `/api/auth/login` | Autentica al usuario y crea una sesión | Público |
| `POST` | `/api/auth/logout` | Destruye la sesión activa | Autenticado |
| `GET` | `/api/auth/me` | Retorna los datos del usuario autenticado | Autenticado |
| `POST` | `/api/auth/bootstrap` | Crea el primer usuario administrador | Público (solo si no hay usuarios) |
| `GET` | `/api/auth/needs-bootstrap` | Verifica si el sistema necesita inicialización | Público |

**Middleware de protección:**
- `requireAuth`: Verifica que exista `req.session.userId`.
- `requireAdmin`: Verifica que el usuario sea de rol `admin`, consultando la base de datos.

**Validación:** Los cuerpos de las solicitudes se validan con esquemas Zod (`loginSchema`, `createUserSchema`) antes de procesarse.

---

### 5.2 Módulo de Eventos

**Archivos relevantes:** `server/routes.ts` (líneas 110–455), `server/storage.ts`

**Descripción:**  
El módulo de eventos es el núcleo de la plataforma. Los eventos se clasifican en tres categorías (`academico`, `cultural`, `deportivo`) y pueden filtrarse por tiempo (hoy, esta semana, este mes). Los administradores ven todos los eventos incluidos los archivados; los estudiantes solo ven los activos.

**Endpoints implementados:**

| Método | Ruta | Descripción | Acceso |
|--------|------|-------------|--------|
| `GET` | `/api/events` | Lista eventos (con filtros de categoría y tiempo) | Público |
| `GET` | `/api/events/:id` | Detalle de evento + incrementa contador de vistas | Público |
| `POST` | `/api/events/:id/like` | Toggle "me gusta" en un evento | Autenticado |
| `POST` | `/api/events/:id/attend` | Toggle confirmación de asistencia | Autenticado |
| `GET` | `/api/events/:id/comments` | Lista comentarios de un evento | Público |
| `POST` | `/api/events/:id/comments` | Crea un comentario en un evento | Autenticado |
| `GET` | `/api/admin/events` | Lista todos los eventos incluyendo archivados | Admin |
| `POST` | `/api/admin/events` | Crea un nuevo evento | Admin |
| `PATCH` | `/api/admin/events/:id` | Actualiza un evento existente | Admin |
| `DELETE` | `/api/admin/events/:id` | Elimina permanentemente un evento | Admin |
| `PATCH` | `/api/admin/events/:id/archive` | Archiva/desarchiva un evento | Admin |

**Tipo extendido `EventWithStats`:**  
Los endpoints de eventos retornan objetos enriquecidos con estadísticas calculadas:
```typescript
type EventWithStats = Event & {
  likesCount: number;
  commentsCount: number;
  attendeesCount: number;
  isLiked?: boolean;      // Solo si hay usuario autenticado
  isAttending?: boolean;  // Solo si hay usuario autenticado
};
```

---

### 5.3 Módulo Social

**Archivos relevantes:** `server/routes.ts` (líneas 206–281), `server/storage.ts`

**Descripción:**  
El módulo social incluye el sistema de seguimiento de usuarios y el acceso a eventos guardados/asistidos.

**Endpoints implementados:**

| Método | Ruta | Descripción | Acceso |
|--------|------|-------------|--------|
| `GET` | `/api/users/me/followers` | Lista los seguidores del usuario autenticado | Autenticado |
| `GET` | `/api/users/me/following` | Lista los usuarios que sigue el autenticado | Autenticado |
| `POST` | `/api/users/:id/follow` | Toggle seguir/dejar de seguir a un usuario | Autenticado |
| `GET` | `/api/users/me/liked-events` | Lista los eventos marcados con "me gusta" | Autenticado |
| `GET` | `/api/users/me/attending-events` | Lista los eventos con asistencia confirmada | Autenticado |
| `PATCH` | `/api/users/me/profile` | Actualiza el nombre del usuario | Autenticado |

**Regla de negocio:** Un usuario no puede seguirse a sí mismo. El servidor valida `followerId !== followingId` y retorna HTTP 400 en caso contrario.

---

### 5.4 Módulo de Chat en Tiempo Real

**Archivos relevantes:** `server/routes.ts` (líneas 283–348), `server/index.ts`

**Descripción:**  
El chat utiliza una arquitectura de dos partes: la API REST para crear conversaciones y recuperar historial de mensajes, y WebSockets para la entrega de mensajes en tiempo real.

**Modelo de datos:**
- Una **conversación** (`chat`) conecta exactamente dos usuarios.
- Los **mensajes** pertenecen a una conversación y tienen estado de lectura (`isRead`).
- El campo `lastMessageAt` en `chats` permite ordenar conversaciones por actividad reciente.

**Endpoints REST:**

| Método | Ruta | Descripción | Acceso |
|--------|------|-------------|--------|
| `GET` | `/api/chats` | Lista todas las conversaciones del usuario | Autenticado |
| `POST` | `/api/chats` | Crea o recupera una conversación con otro usuario | Autenticado |
| `GET` | `/api/chats/:id/messages` | Recupera mensajes (marca como leídos) | Autenticado |
| `POST` | `/api/chats/:id/messages` | Envía un mensaje en una conversación | Autenticado |

**Tipo extendido `ChatWithUser`:**
```typescript
type ChatWithUser = Chat & {
  otherUser: Pick<User, "id" | "name">;
  lastMessage?: Message;
  unreadCount: number;
};
```

---

### 5.5 Módulo de Notificaciones

**Archivos relevantes:** `server/routes.ts` (líneas 350–379), `server/storage.ts`

**Descripción:**  
El sistema de notificaciones genera alertas automáticas cuando ocurren eventos relevantes. Los tipos de notificación disponibles son: `event_update`, `new_comment`, `new_follower`, `new_message`.

**Endpoints implementados:**

| Método | Ruta | Descripción | Acceso |
|--------|------|-------------|--------|
| `GET` | `/api/notifications` | Lista notificaciones del usuario | Autenticado |
| `PATCH` | `/api/notifications/:id/read` | Marca una notificación como leída | Autenticado |
| `POST` | `/api/notifications/read-all` | Marca todas las notificaciones como leídas | Autenticado |

---

### 5.6 Panel de Administración

**Archivos relevantes:** `server/routes.ts` (líneas 381–558), `client/src/pages/admin/`

**Descripción:**  
El panel de administración provee herramientas completas de gestión del sistema. Todas las rutas están protegidas por el middleware `requireAdmin`.

**Páginas del panel:**

| Página | Ruta cliente | Funcionalidad |
|--------|-------------|---------------|
| Dashboard | `/admin` | Métricas generales del sistema |
| Eventos | `/admin/events` | CRUD de eventos, archivado |
| Usuarios | `/admin/users` | Crear, bloquear, cambiar rol de usuarios |
| Métricas | `/admin/metrics` | Gráficas con Recharts (eventos por categoría, actividad temporal) |
| Moderación | `/admin/moderation` | Revisar y eliminar comentarios |

**Endpoints de administración:**

| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/api/admin/stats` | Estadísticas globales del sistema |
| `GET` | `/api/admin/metrics` | Datos para gráficas de métricas |
| `GET` | `/api/admin/users` | Lista todos los usuarios |
| `POST` | `/api/admin/users` | Crea un nuevo usuario |
| `PATCH` | `/api/admin/users/:id` | Actualiza nombre o rol de usuario |
| `PATCH` | `/api/admin/users/:id/block` | Bloquea o desbloquea un usuario |
| `GET` | `/api/admin/comments` | Lista todos los comentarios para moderación |
| `DELETE` | `/api/comments/:id` | Elimina un comentario |

---

## Capítulo 6 — Pruebas y Resultados

### 6.1 Pruebas Funcionales por Endpoint

Las pruebas funcionales verifican que cada endpoint del sistema responda correctamente a diferentes escenarios de entrada.

#### Módulo de Autenticación

| Caso de prueba | Entrada | Resultado esperado | HTTP |
|---------------|---------|-------------------|------|
| Login exitoso | Email y contraseña válidos | Usuario sin campo `password` | 200 |
| Login con email inexistente | Email no registrado | `{ error: "Credenciales inválidas" }` | 401 |
| Login con contraseña incorrecta | Email válido, contraseña errónea | `{ error: "Credenciales inválidas" }` | 401 |
| Login de usuario bloqueado | Credenciales de usuario con `isBlocked: true` | `{ error: "Usuario bloqueado" }` | 403 |
| Login con email malformado | `email: "noesvalido"` | Error de validación Zod | 400 |
| Consulta de sesión activa | Cookie de sesión válida | Datos del usuario | 200 |
| Consulta sin sesión | Sin cookie | `{ error: "No autorizado" }` | 401 |
| Logout | Cookie de sesión válida | `{ message: "Sesión cerrada" }` | 200 |

#### Módulo de Eventos

| Caso de prueba | Entrada | Resultado esperado | HTTP |
|---------------|---------|-------------------|------|
| Listar eventos | Sin parámetros | Array de eventos activos | 200 |
| Filtrar por categoría | `?category=academico` | Solo eventos académicos | 200 |
| Ver evento existente | ID válido | Objeto del evento con estadísticas | 200 |
| Ver evento inexistente | ID no existente | `{ error: "Evento no encontrado" }` | 404 |
| Dar like (toggle on) | ID de evento, usuario autenticado sin like previo | `{ isLiked: true }` | 200 |
| Dar like (toggle off) | ID de evento, usuario autenticado con like previo | `{ isLiked: false }` | 200 |
| Dar like sin autenticación | Sin cookie | `{ error: "No autorizado" }` | 401 |
| Crear evento (admin) | Datos válidos del evento | Evento creado | 200 |
| Crear evento (estudiante) | Datos válidos del evento | `{ error: "Acceso denegado" }` | 403 |

#### Módulo Social y Seguidores

| Caso de prueba | Entrada | Resultado esperado | HTTP |
|---------------|---------|-------------------|------|
| Seguir usuario | ID de otro usuario | `{ isFollowing: true }` | 200 |
| Dejar de seguir | ID de usuario ya seguido | `{ isFollowing: false }` | 200 |
| Seguirse a sí mismo | ID del propio usuario | `{ error: "No puedes seguirte a ti mismo" }` | 400 |

#### Panel de Administración

| Caso de prueba | Entrada | Resultado esperado | HTTP |
|---------------|---------|-------------------|------|
| Obtener estadísticas (admin) | Cookie de sesión de admin | Objeto con métricas | 200 |
| Obtener estadísticas (estudiante) | Cookie de sesión de estudiante | `{ error: "Acceso denegado" }` | 403 |
| Bloquear usuario | ID de usuario, `isBlocked: true` | Usuario actualizado | 200 |
| Bloquearse a sí mismo | ID del admin autenticado | `{ error: "No puedes bloquearte a ti mismo" }` | 400 |

---

### 6.2 Requerimientos No Funcionales y Validación

| RNF | Mecanismo de implementación | Verificación |
|-----|---------------------------|-------------|
| RNF-01: Hash de contraseñas | `bcrypt.hash()` en `storage.createUser()` | Las contraseñas en la BD no son legibles en texto plano |
| RNF-03: Cookies HttpOnly | `httpOnly: true` en la config de express-session | Las cookies no son accesibles desde `document.cookie` |
| RNF-04: Protección de rutas admin | Middleware `requireAdmin` | Las rutas `/api/admin/*` retornan 403 para no admins |
| RNF-06: Diseño responsivo | Clases responsivas de Tailwind (`sm:`, `md:`, `lg:`) | La interfaz se adapta a pantallas de 320px en adelante |
| RNF-07: Área mínima de toque | Clases Tailwind `min-h-[44px]` en botones | Los botones tienen al menos 44px en móvil |
| RNF-09: Tipos compartidos | Directorio `shared/schema.ts` importado por cliente y servidor | Un cambio en el esquema actualiza los tipos en ambas capas |

---

## Capítulo 7 — Conclusiones y Trabajo Futuro

### 7.1 Conclusiones

Al concluir el desarrollo de FIMAZ, se puede constatar el cumplimiento de los objetivos planteados:

1. **Sistema de autenticación seguro:** Se implementó autenticación por sesiones con almacenamiento en PostgreSQL, hash de contraseñas con bcrypt y control de acceso por roles mediante middleware, cubriendo el RF-01, RF-02 y los RNF-01 al RNF-04.

2. **Gestión completa de eventos:** El módulo de eventos provee un CRUD completo con soporte para categorías, archivado, filtrado temporal y contador de vistas, cubriendo RF-03 al RF-05 y RF-12 al RF-14.

3. **Características sociales funcionales:** Se implementaron likes, comentarios, confirmaciones de asistencia y seguimiento de usuarios con lógica de toggle eficiente, cubriendo RF-06 al RF-09.

4. **Comunicación en tiempo real:** El módulo de chat basado en WebSockets permite mensajería instantánea, cubriendo RF-10.

5. **Sistema de notificaciones:** Las notificaciones automáticas informan a los usuarios sobre actividad relevante en la plataforma, cubriendo RF-11.

6. **Panel de administración robusto:** El dashboard provee métricas visuales con Recharts, gestión completa de usuarios y herramientas de moderación de contenido, cubriendo RF-12 al RF-17.

7. **Interfaz responsiva:** El diseño se adapta a todos los tamaños de pantalla mediante Tailwind CSS con breakpoints bien definidos, cubriendo RNF-06 y RNF-07.

La elección de una arquitectura monorepo con TypeScript compartido entre cliente y servidor demostró ser una decisión acertada: redujo significativamente los errores de integración entre capas y aceleró el desarrollo al no requerir la duplicación de tipos y validaciones.

---

### 7.2 Trabajo Futuro

Las siguientes funcionalidades representan extensiones naturales del sistema que no formaron parte del alcance inicial:

| Funcionalidad | Justificación | Tecnología sugerida |
|--------------|--------------|---------------------|
| **Notificaciones push** | Alertar a usuarios fuera de la aplicación sobre eventos próximos | Web Push API + Service Workers |
| **Aplicación móvil nativa** | Mejorar la experiencia en dispositivos móviles | React Native (reutilizando lógica) |
| **Carga de imágenes propias** | Actualmente las imágenes son URLs externas | Cloudinary / AWS S3 |
| **Integración con calendario** | Exportar eventos al calendario del dispositivo | iCalendar (RFC 5545) |
| **Búsqueda de texto completo** | Buscar eventos por título o descripción | PostgreSQL Full-Text Search |
| **Integración institucional** | Conectar con sistemas académicos para sincronizar eventos oficiales | REST/SOAP con el sistema SIIA |
| **Pruebas automatizadas** | Regresión automática ante cambios | Vitest (frontend), Supertest (API) |
| **Caché distribuida** | Mejorar rendimiento en alta concurrencia | Redis |

---

### 7.3 Referencias Bibliográficas

A continuación se listan las referencias técnicas principales utilizadas en el desarrollo del proyecto. Se recomienda complementar con artículos académicos sobre arquitecturas web y metodologías ágiles de las bases de datos Scopus, IEEE Xplore o ACM Digital Library.

**Documentación oficial:**

1. Meta Open Source. (2024). *React Documentation*. https://react.dev/
2. Microsoft. (2024). *TypeScript Documentation*. https://www.typescriptlang.org/docs/
3. Vite Team. (2024). *Vite Documentation*. https://vitejs.dev/
4. Express.js Team. (2024). *Express.js API Reference*. https://expressjs.com/en/4x/api.html
5. Drizzle Team. (2024). *Drizzle ORM Documentation*. https://orm.drizzle.team/
6. The PostgreSQL Global Development Group. (2024). *PostgreSQL 16 Documentation*. https://www.postgresql.org/docs/
7. TanStack. (2024). *TanStack Query v5 Documentation*. https://tanstack.com/query/v5/
8. Tailwind Labs. (2024). *Tailwind CSS Documentation*. https://tailwindcss.com/docs/
9. Radix UI. (2024). *Radix UI Primitives Documentation*. https://www.radix-ui.com/
10. Colby Fayock. (2024). *Recharts Documentation*. https://recharts.org/en-US/
11. WebSocket Protocol RFC 6455. (2011). *The WebSocket Protocol*. https://datatracker.ietf.org/doc/html/rfc6455

**Metodología de desarrollo:**

12. Beck, K., et al. (2001). *Manifesto for Agile Software Development*. https://agilemanifesto.org/
13. Pressman, R. S., & Maxim, B. R. (2019). *Software Engineering: A Practitioner's Approach* (9th ed.). McGraw-Hill.
14. Sommerville, I. (2015). *Software Engineering* (10th ed.). Pearson.

**Seguridad web:**

15. OWASP Foundation. (2024). *OWASP Top Ten*. https://owasp.org/www-project-top-ten/
16. Mozilla Developer Network. (2024). *HTTP Cookies*. https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies

---

## Apéndices

### Apéndice A — Estructura de Directorios del Proyecto

```
Admin-Realm/
├── client/                    # Aplicación React (frontend)
│   ├── src/
│   │   ├── App.tsx           # Enrutador principal de la SPA
│   │   ├── main.tsx          # Punto de entrada de React
│   │   ├── components/       # Componentes reutilizables
│   │   │   ├── ui/          # Componentes base (Radix UI + Tailwind)
│   │   │   ├── event-card.tsx
│   │   │   ├── category-filter.tsx
│   │   │   ├── chat-interface.tsx
│   │   │   └── notifications-panel.tsx
│   │   ├── pages/            # Páginas de la aplicación
│   │   │   ├── home.tsx
│   │   │   ├── login.tsx
│   │   │   ├── register.tsx
│   │   │   ├── event-detail.tsx
│   │   │   ├── profile.tsx
│   │   │   ├── chats.tsx
│   │   │   └── admin/
│   │   │       ├── dashboard.tsx
│   │   │       ├── events.tsx
│   │   │       ├── users.tsx
│   │   │       ├── metrics.tsx
│   │   │       └── moderation.tsx
│   │   ├── hooks/            # Hooks personalizados de React
│   │   └── lib/              # Utilidades y helpers
│   └── index.html
│
├── server/                    # API REST y servidor (backend)
│   ├── index.ts              # Punto de entrada del servidor
│   ├── routes.ts             # Definición de todos los endpoints API
│   ├── storage.ts            # Capa de acceso a datos (Drizzle ORM)
│   ├── db.ts                 # Configuración de la conexión a PostgreSQL
│   ├── static.ts             # Servicio de archivos estáticos en producción
│   └── vite.ts               # Integración Vite en modo desarrollo
│
├── shared/                    # Código compartido cliente-servidor
│   └── schema.ts             # Esquema BD + tipos TypeScript
│
├── script/                    # Scripts de build
├── package.json              # Dependencias del proyecto
├── tsconfig.json             # Configuración TypeScript
├── vite.config.ts            # Configuración de Vite
├── tailwind.config.ts        # Configuración de Tailwind CSS
├── drizzle.config.ts         # Configuración de Drizzle ORM
├── design_guidelines.md      # Guía de diseño de la interfaz
└── TESIS_DOCUMENTACION.md    # Este documento
```

### Apéndice B — Variables de Entorno Requeridas

```env
DATABASE_URL=postgresql://usuario:contraseña@host:5432/nombre_bd
SESSION_SECRET=clave-secreta-de-sesion-minimo-32-caracteres
NODE_ENV=development|production
```

### Apéndice C — Comandos del Proyecto

```bash
# Instalar dependencias
npm install

# Iniciar en modo desarrollo (cliente + servidor)
npm run dev

# Compilar para producción
npm run build

# Iniciar servidor de producción
npm start

# Verificar tipos TypeScript
npm run check

# Sincronizar esquema con la base de datos
npm run db:push
```

---

*Documento generado para el proyecto FIMAZ — Plataforma de Gestión de Eventos Universitarios.*  
*Para actualizar este documento, editar el archivo `TESIS_DOCUMENTACION.md` en la raíz del repositorio.*
