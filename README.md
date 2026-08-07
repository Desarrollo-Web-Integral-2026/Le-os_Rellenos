# 🔥 Leños Rellenos — Aplicación Web

Aplicación web para la digitalización del proceso de venta de un emprendimiento familiar dedicado a la venta artesanal de **leños rellenos**. Permite gestionar el catálogo de productos, el carrito de compra y la administración de pedidos, incorporando además un módulo de **protección de datos personales** (derechos ARCO, consentimiento, auditoría y cifrado) conforme a las buenas prácticas de la LFPDPPP.

![Node](https://img.shields.io/badge/Node.js-Express%205-339933?logo=node.js&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?logo=mongodb&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-TypeScript-646CFF?logo=vite&logoColor=white)
![Estado](https://img.shields.io/badge/estado-en%20desarrollo-orange)

---

## 📋 Tabla de Contenidos

- [Sobre el Proyecto](#-sobre-el-proyecto)
- [Problemática](#-problemática)
- [Características](#-características)
- [Módulo de Protección de Datos](#-módulo-de-protección-de-datos-arco)
- [Arquitectura](#-arquitectura)
- [Modelo de Datos](#-modelo-de-datos)
- [Tecnologías](#-tecnologías)
- [Estructura del Repositorio](#-estructura-del-repositorio)
- [Instalación y Configuración](#-instalación-y-configuración)
- [Variables de Entorno](#-variables-de-entorno)
- [API — Endpoints Principales](#-api--endpoints-principales)
- [Identidad Visual](#-identidad-visual)
- [Roadmap](#-roadmap)

---

## 🍽️ Sobre el Proyecto

**Leños Rellenos** es un negocio de comida artesanal que gestionaba sus ventas manualmente mediante WhatsApp y Facebook. Este proyecto digitaliza su operación con:

- Un **catálogo digital** de productos por categoría, con control de disponibilidad y stock.
- Un **carrito de compras** que se conserva entre sesiones.
- Un **panel administrativo** protegido con autenticación (JWT + roles) para gestionar productos, pedidos y clientes.
- Un **módulo de privacidad** que permite a los clientes ejercer sus derechos ARCO (Acceso, Rectificación, Cancelación, Oposición), otorgar/revocar consentimiento para transferencia de datos a terceros, y consultar bitácoras de auditoría.

## ❗ Problemática

- Dificultad para llevar control de pedidos en horas pico.
- Falta de control de disponibilidad (stock) de productos.
- Necesidad de mejorar el control administrativo del negocio.
- Ausencia de mecanismos formales de protección y trazabilidad de los datos personales de los clientes.

## ✅ Características

**Cara al cliente:**
- Catálogo de productos por categoría (`GET /api/productos/listar`).
- Carrito de compras persistente.
- Interfaz responsiva, cálida y artesanal (paleta café/naranja).

**Panel de administración (protegido con JWT + rol `admin`):**
- Gestión de productos y categorías (CRUD completo).
- Consulta de clientes registrados.
- Resolución de solicitudes ARCO.
- Consulta de bitácora de auditoría (`/api/auditoria/logs`).

## 🔐 Módulo de Protección de Datos (ARCO)

El sistema incorpora un submódulo dedicado al cumplimiento de protección de datos personales:

| Módulo | Función |
|---|---|
| `auth` | Login de administrador con JWT y rate limiting anti fuerza bruta |
| `arco` | Solicitudes de Acceso, Rectificación, Cancelación y Oposición; anonimización de clientes |
| `consentimiento` | Otorgar / revocar consentimiento para transferencia de datos a terceros |
| `transferencia` | Envío controlado de datos de pedido a servicios externos, con consentimiento previo |
| `auditoria` | Bitácora de acciones (lectura, resolución, anonimización) con IP hasheada, solo consultable por admin |
| `dataLifecycle` / `dataRetention.job` | Job automático (`node-cron`) que aplica políticas de retención y anonimización de datos vencidos |

**Medidas de seguridad implementadas:**
- Contraseñas de administrador hasheadas con `bcrypt` (cost factor 12).
- Campos sensibles del cliente (nombre, teléfono, ubicación) **cifrados en reposo** y descifrados solo al leer.
- Middleware de sanitización de entradas (`sanitize.middleware.js`).
- Rate limiting general y específico para login (`rateLimit.middleware.js`).
- Registro de auditoría sin exponer el dato personal en sí, solo referencias (`recursoId`).
- Documentación de política de retención y transferencias a terceros en `backend/src/docs/`.

## 🏗️ Arquitectura

Arquitectura **cliente-servidor desacoplada**:

```
Frontend (React 19 + TypeScript + Vite)
        ⇅  API REST (JSON)
Backend (Node.js + Express 5)
        ⇅  Mongoose ODM
Base de datos (MongoDB)
```

- **Backend** organizado por módulos de dominio (`src/modules/<módulo>`), cada uno con `controller`, `service` y `routes`.
- **Frontend** organizado por capas: `components/ui` (átomos), `components/layout`, `components/features` (carrito, catálogo), `context` (estado del carrito), `hooks`, `services/api` (cliente HTTP) y `types`.

## 🗄️ Modelo de Datos

Colecciones principales (Mongoose):

- **Cliente** — nombre*, telefono*, ubicación, finalidad, diasRetencion, estado (activo/bloqueado/anonimizado), consentimientoTransferencia — *(*campos cifrados en reposo)*
- **Administrador** — nombre, correo, password (hash bcrypt)
- **Producto** — nombre, descripción, precio, imagen, categoría, disponible, stock
- **Categoria** — nombre, descripción
- **Pedido** — cliente, fechaPedido, total, estado (nuevo → en_preparación → en_camino → completado), metodoEnvio
- **DetallePedido** — pedido, producto, cantidad, precioUnitario
- **SolicitudArco** — tipo (acceso/rectificación/cancelación/oposición), cliente, estado, resultado
- **AuditLog** — usuarioId, usuarioTipo, acción, recurso, recursoId, finalidad, ip (hasheada), resultado, fecha

## 🛠️ Tecnologías

**Backend**
- Node.js + Express 5
- MongoDB + Mongoose
- JWT (`jsonwebtoken`) para autenticación
- `bcrypt` / `bcryptjs` para hashing de contraseñas
- `express-rate-limit` para mitigar fuerza bruta
- `node-cron` para el job de retención de datos
- Jest + `mongodb-memory-server` para pruebas

**Frontend**
- React 19 + TypeScript
- Vite como bundler/dev server
- CSS Modules + `@fontsource` (Poppins / Inter)
- ESLint

## 📁 Estructura del Repositorio

```
Le-os_Rellenos/
├── backend/
│   ├── app.js                     # Punto de entrada de la API
│   ├── src/
│   │   ├── config/database.js     # Conexión a MongoDB
│   │   ├── middlewares/           # auth, roles, rate limit, sanitización, auditoría
│   │   ├── models/                # Esquemas de Mongoose
│   │   ├── modules/                # auth, clientes, arco, auditoria,
│   │   │                           #   consentimiento, transferencia, producto, categoria
│   │   ├── jobs/dataRetention.job.js
│   │   ├── services/dataLifecycle.service.js
│   │   ├── scripts/               # seedAdmin, seed-cliente, verify-encryption
│   │   ├── utils/                 # encrypt.js, response.js
│   │   └── docs/                  # política de retención, transferencias a terceros
│   └── package.json
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── ui/                # Button, Card, Badge, Input
    │   │   ├── layout/             # Header, Container, ProductGrid
    │   │   └── features/           # ProductCatalog, ProductCard, CartDrawer, CartIcon, CartItemRow
    │   ├── context/CartContext.tsx
    │   ├── hooks/                  # useCart, useProducts
    │   ├── services/api/           # client.ts, products.ts
    │   ├── types/                  # product.ts, cart.ts
    │   └── styles/                 # tokens.css, breakpoints.ts
    └── package.json
```

## 🚀 Instalación y Configuración

### Backend

```bash
cd backend
npm install
cp .env.examples .env   # completa MONGO_URI, JWT_SECRET, ADMIN_*, etc.

# Crear el administrador inicial
npm run seed:cliente        # (opcional) datos de prueba
node src/scripts/seedAdmin.js

npm run dev              # levanta con nodemon en http://localhost:3000
```

### Frontend

```bash
cd frontend
npm install
cp .env.example .env     # define VITE_API_URL apuntando al backend
npm run dev               # http://localhost:5173
```

## 🔑 Variables de Entorno

**backend/.env**
```env
MONGO_URI=mongodb+srv://<usuario>:<password>@<cluster>.mongodb.net/lenos-rellenos
PORT=3000
NODE_ENV=development
JWT_SECRET=<clave-secreta>
ADMIN_NOMBRE=Administrador
ADMIN_CORREO=admin@example.com
ADMIN_PASSWORD=<contraseña-inicial>
```

**frontend/.env**
```env
VITE_API_URL=http://localhost:3000/api
```

## 🔌 API — Endpoints Principales

| Método | Ruta | Protegido | Descripción |
|---|---|---|---|
| POST | `/api/auth/login` | No (rate-limited) | Login de administrador |
| GET | `/api/productos/listar` | No | Listado de productos |
| POST | `/api/productos/crear` | — | Crear producto |
| PUT | `/api/productos/actualizar/:id` | — | Actualizar producto |
| DELETE | `/api/productos/eliminar/:id` | — | Eliminar producto |
| GET | `/api/categorias/listar` | No | Listado de categorías |
| GET | `/api/clientes` | Admin | Listado de clientes |
| POST | `/api/arco/solicitud` | No | Crear solicitud de derecho ARCO |
| GET | `/api/arco/solicitudes` | Admin | Listado de solicitudes ARCO |
| PATCH | `/api/arco/solicitud/:id/resolver` | Admin | Resolver solicitud ARCO |
| PATCH | `/api/arco/cliente/:id/anonimizar` | Admin | Anonimizar cliente |
| POST | `/api/consentimiento/otorgar` | No | Otorgar consentimiento de transferencia |
| POST | `/api/consentimiento/revocar` | No | Revocar consentimiento |
| POST | `/api/transferencia/enviar` | No | Enviar datos de pedido a servicio externo |
| GET | `/api/auditoria/logs` | Admin | Consultar bitácora de auditoría |

## 🎨 Identidad Visual

| Elemento | Detalle |
|---|---|
| Paleta de colores | Café y naranja — calidez, tradición y hogar |
| Tipografía de títulos | Poppins (Bold/SemiBold) |
| Tipografía de texto | Inter (Regular/Medium) |
| Concepto | Cálido, artesanal, cercano, confiable y moderno |

---

## 👥 Autores

Proyecto desarrollado para el curso **Desarrollo Web Integral** — caso de estudio "Leños Rellenos".
