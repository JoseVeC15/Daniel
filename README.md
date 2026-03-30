# Sistema de Cumplimiento Laboral (MVP) - Paraguay

Este proyecto es un Sistema de Gestión de Cumplimiento Laboral diseñado específicamente para la normativa legal de Paraguay. Permite a las empresas y gestores llevar un control estricto de sus obligaciones (IPS, MTESS, Aguinaldos) mediante calculadoras, calendarios y un sistema de alertas proactivo.

## 🚀 Tecnologías Utilizadas

- **Backend**: Node.js, Express, TypeScript, Prisma.
- **Frontend**: Next.js 14 (App Router), TailwindCSS, Lucide Icons.
- **Base de Datos**: PostgreSQL (Neon).
- **Automatización**: Cron-jobs para alertas de vencimiento.

## 📂 Estructura del Proyecto

- `backend/`: API REST, lógica de negocio y automatización.
- `frontend/`: Interfaz de usuario moderna y profesional.

## 🛠️ Configuración Local

### 1. Requisitos Previos
- Node.js (v18 o superior)
- npm o yarn
- Una cuenta en [Neon.tech](https://neon.tech) (para la base de datos PostgreSQL)

### 2. Configuración del Backend
1. Entra a la carpeta: `cd backend`
2. Instala dependencias: `npm install`
3. Crea un archivo `.env` basado en `.env.template` y añade tu `DATABASE_URL` de Neon.
4. Genera el cliente de Prisma y puebla la base de datos:
   ```bash
   npx prisma db push
   npx prisma db seed
   ```
5. Inicia el servidor de desarrollo: `npm run dev`

### 3. Configuración del Frontend
1. Entra a la carpeta: `cd frontend`
2. Instala dependencias: `npm install`
3. Crea un archivo `.env.local` con: `NEXT_PUBLIC_API_URL=http://localhost:3001/api`
4. Inicia el servidor de desarrollo: `npm run dev`

## 📊 Módulos Principales

1. **Dashboard**: Resumen de cumplimiento y próximos vencimientos.
2. **Calculadoras**: Aguinaldo, IPS y Vacaciones (Código Laboral PY).
3. **Calendario**: Vista mensual/semanal de obligaciones legales.
4. **Checklist Mensual**: Tareas operativas con carga de comprobantes.
5. **Alertas**: Notificaciones por email y en el sistema 7, 3 y 1 día antes del vencimiento.

## 🌐 Despliegue

- **Frontend**: Recomendado en **Vercel**.
- **Backend**: Recomendado en **Render** o **Railway** (requiere entorno persistente para cron-jobs).

---
Desarrollado para el cumplimiento eficiente de las leyes laborales paraguayas 2024.
