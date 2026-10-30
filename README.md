# 🎓 Sistema de Registro de Notas y Cursos (NestJS + Supabase)

Proyecto backend y panel interactivo desarrollado con **NestJS (v12)** y enlazado a base de datos relacional **Supabase (PostgreSQL)**, diseñado con una interfaz moderna en paleta **Azul y Plomo (Blue & Lead Slate)**.

---

## 🎨 Paleta de Diseño: Azul y Plomo

El sistema implementa una estética académica en dos tonos predominantes:
- **Azul Primario y Rey (`#2563eb`, `#1d4ed8`, `#1e3a8a`)**: Identidad visual, botones de acción principal, estado aprobado y acentos en Swagger.
- **Plomo / Pizarra / Slate (`#0f172a`, `#1e293b`, `#334155`, `#475569`, `#cbd5e1`, `#f1f5f9`)**: Encabezados, barras superiores, bordes de tarjetas, fondos contrastantes y componentes de datos.

---

## 🚀 Características Principales

- **Enlace a Base de Datos Supabase (PostgreSQL)**:
  - Integración mediante `@supabase/supabase-js`.
  - Operaciones relacionales completas en tablas `courses`, `students` y `grades`.
  - Soporte de borrado en cascada (`ON DELETE CASCADE`) y restricciones de unicidad.
  - Modo híbrido con **respaldo en memoria local**: si aún no has configurado tus credenciales en `.env`, el sistema sigue funcionando y te guía para enlazarte.
- **Panel de Control Web Interactivo (`/dashboard`)**:
  - Interfaz gráfica en tonos **Azul y Plomo** para gestionar cursos, matricular estudiantes y calificar en tiempo real.
  - Visualización del estado de conexión con Supabase en vivo (🟢 Conectado / 🟡 Modo local).
  - Modal integrado para ver y copiar el script SQL de creación de tablas.
- **Gestión Académica Completa**:
  - Cursos con código único, docente, nota mínima aprobatoria y nota máxima.
  - Inscripción de estudiantes con validación de código y correo por curso.
  - Registro de notas con conceptos, puntajes y validación de suma ponderada (no permite superar el 100%).
  - Cálculo automático de promedio ponderado, porcentaje acumulado y estado (*Aprobado*, *Reprobado*, *En progreso*).
  - Reporte analítico y cuadro de honor (mejor y peor promedio del curso).
- **Swagger / OpenAPI Tematizado en Azul y Plomo**:
  - Documentación interactiva en `/api/docs` personalizada con estilos CSS en Azul y Plomo.

---

## 🛠️ Tecnologías Utilizadas

- **Node.js** v24+
- **NestJS** v12
- **Supabase / PostgreSQL** (`@supabase/supabase-js`)
- **TypeScript** con ESM (`NodeNext`)
- **Swagger / OpenAPI** (`@nestjs/swagger`, `swagger-ui-express`)
- **Class Validator / Transformer** (`class-validator`, `class-transformer`)
- **Vitest** para pruebas unitarias y e2e

---

## ⚡ Cómo Enlazar la Base de Datos en Supabase

### 1. Crear el Proyecto en Supabase
1. Ingresa a [https://supabase.com](https://supabase.com) e inicia sesión.
2. Crea un nuevo proyecto (ej. `notas-academicas`).

### 2. Ejecutar el Script SQL
1. En tu panel de Supabase, ve al menú lateral izquierdo y abre **SQL Editor**.
2. Abre o copia el contenido del archivo [`supabase-schema.sql`](./supabase-schema.sql) (también puedes copiarlo directamente desde el Dashboard web en el botón *Script SQL Supabase*).
3. Pega el script en el editor y presiona **RUN**.
   - Se crearán las tablas `courses`, `students` y `grades` con sus políticas de seguridad (RLS) e índices.

### 3. Configurar Variables de Entorno
Crea o edita el archivo `.env` en la raíz del proyecto:
```env
PORT=3000

# Obtenidas en Supabase: Project Settings -> API
SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_KEY=tu-anon-key-de-supabase
```

---

## 📦 Instalación y Ejecución

1. **Instalar dependencias**:
   ```bash
   npm install
   ```

2. **Iniciar en modo desarrollo**:
   ```bash
   npm run start:dev
   ```

3. **Abrir en el navegador**:
   - 🎨 **Dashboard Web (Azul y Plomo)**: [http://localhost:3000/dashboard](http://localhost:3000/dashboard)
   - 📚 **Swagger API Docs (Azul y Plomo)**: [http://localhost:3000/api/docs](http://localhost:3000/api/docs)
   - ⚡ **Verificar Estado Supabase**: [http://localhost:3000/api/supabase/status](http://localhost:3000/api/supabase/status)

4. **Ejecutar pruebas automatizadas**:
   ```bash
   # Pruebas unitarias
   npm run test

   # Pruebas End-to-End (e2e)
   npm run test:e2e
   ```

---

## 📡 Endpoints de la API

### 1. Cursos
| Método | Endpoint | Descripción |
|---|---|---|
| `POST` | `/courses` | Crear un nuevo curso |
| `GET` | `/courses` | Listar todos los cursos (con métricas) |
| `GET` | `/courses/:courseId` | Obtener detalle de un curso con sus alumnos |
| `PATCH` | `/courses/:courseId` | Actualizar datos del curso |
| `DELETE` | `/courses/:courseId` | Eliminar curso |
| `GET` | `/courses/:courseId/report` | Reporte analítico (promedio grupal, aprobados, ranking) |

### 2. Estudiantes
| Método | Endpoint | Descripción |
|---|---|---|
| `POST` | `/courses/:courseId/students` | Inscribir un estudiante al curso |
| `GET` | `/courses/:courseId/students` | Listar estudiantes inscritos con sus notas |
| `GET` | `/courses/:courseId/students/:studentId` | Obtener detalle de un estudiante |

### 3. Notas / Calificaciones
| Método | Endpoint | Descripción |
|---|---|---|
| `POST` | `/courses/:courseId/students/:studentId/grades` | Registrar nota (actividad, puntaje, %) |
| `GET` | `/courses/:courseId/students/:studentId/grades` | Consultar notas y promedio ponderado |
| `PATCH` | `/courses/:courseId/students/:studentId/grades/:gradeId` | Actualizar nota o porcentaje |
| `DELETE` | `/courses/:courseId/students/:studentId/grades/:gradeId` | Eliminar una nota |

### 4. Supabase DB Status
| Método | Endpoint | Descripción |
|---|---|---|
| `GET` | `/api/supabase/status` | Verifica si la conexión con Supabase está activa |
| `POST` | `/api/supabase/test` | Ejecuta un ping de prueba contra las tablas de Supabase |
| `GET` | `/api/supabase/schema` | Retorna el script SQL para ejecutar en Supabase |

---

## 📁 Estructura del Proyecto

```text
Proyecto-MS/
├── public/
│   └── index.html                # Dashboard web interactivo (Tema Azul y Plomo)
├── src/
│   ├── supabase/
│   │   ├── supabase.service.ts   # Conexión y cliente de Supabase
│   │   ├── supabase.controller.ts# Endpoints de diagnóstico y schema
│   │   └── supabase.module.ts    # Módulo global de Supabase
│   ├── courses/
│   │   ├── dto/                  # DTOs validados con class-validator
│   │   ├── entities/             # Entidades Course, Student, Grade
│   │   ├── courses.controller.ts # Controlador de cursos, alumnos y notas
│   │   ├── courses.service.ts    # Lógica de negocio (Supabase + fallback memoria)
│   │   ├── courses.service.spec.ts
│   │   └── courses.module.ts
│   ├── app.controller.ts
│   ├── app.controller.spec.ts
│   ├── app.module.ts
│   ├── app.service.ts
│   └── main.ts                   # Servidor NestJS y Swagger con CSS Azul y Plomo
├── supabase-schema.sql           # Script SQL para crear tablas en Supabase
├── .env.example                  # Plantilla de variables de entorno
├── package.json
├── tsconfig.json
└── README.md
```
