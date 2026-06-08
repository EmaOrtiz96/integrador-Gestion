# 📦 StockWise — Control de Stock Inteligente

> Sistema fullstack de gestión de inventario construido con **FastAPI + React + MySQL**, desarrollado con asistencia de IA como parte del TP Integrador de Programación IV.

![CI/CD](https://github.com/EmaOrtiz96/integrador-Gestion/actions/workflows/ci.yml/badge.svg)
![Python](https://img.shields.io/badge/Python-3.11-3776AB?logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-0.111-009688?logo=fastapi&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.4-3178C6?logo=typescript&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?logo=mysql&logoColor=white)

---

## 🌐 Demo en vivo

- **Frontend**: https://integrador-gestion3.vercel.app
- **Backend API**: https://integrador-gestion-production.up.railway.app
- **Documentación API**: https://integrador-gestion-production.up.railway.app/docs

---

## ✨ ¿Qué es StockWise?

StockWise es una aplicación web para **control de inventario en tiempo real**. Permite registrar productos, organizarlos por categorías, gestionar entradas/salidas/ajustes de stock, y visualizar el estado del inventario en un dashboard interactivo con gráficos.

### Funcionalidades principales

- 📊 **Dashboard** con métricas clave: valor total del stock, alertas de stock bajo, movimientos del día y gráficos por categoría
- 📦 **CRUD completo de productos** con búsqueda, filtros por categoría y estado de stock
- 🏷️ **Gestión de categorías** para organizar el inventario
- 🔄 **Registro de movimientos**: entradas, salidas y ajustes manuales con historial completo
- ⚠️ **Sistema de alertas** automático para productos por debajo del stock mínimo
- 🚀 **CI/CD** con GitHub Actions + deploy en Railway (backend) y Vercel (frontend)

---

## 🛠 Stack Tecnológico

| Capa | Tecnología |
|---|---|
| Backend | FastAPI 0.111, Python 3.11, SQLAlchemy 2.0 |
| Frontend | React 18, TypeScript 5.4, Vite 5 |
| Estado/API | TanStack Query v5 |
| Base de datos | MySQL 8.0 (XAMPP local / Railway en producción) |
| Deploy | Railway (API) + Vercel (Frontend) |
| CI/CD | GitHub Actions |

### 🤖 IA utilizada

| Herramienta | Uso |
|---|---|
| **Claude (Anthropic)** | Generación del proyecto completo, arquitectura, código, README e informe |
| **Claude Code** | Debugging, refactoring y sugerencias de mejora |

---

## 🚀 Puesta en marcha local

### Requisitos previos

- Python 3.11+
- Node.js 20+
- XAMPP (MySQL corriendo en `localhost:3306`)

### 1. Clonar el repositorio

```bash
git clone https://github.com/EmaOrtiz96/integrador-Gestion.git
cd integrador-Gestion
```

### 2. Backend (FastAPI)

```bash
cd stockwise/backend

# Crear entorno virtual
python -m venv venv
source venv/bin/activate      # Linux/Mac
venv\Scripts\activate         # Windows

# Instalar dependencias
pip install -r requirements.txt

# Configurar variables de entorno
cp .env.example .env
# Editá .env con tu configuración de MySQL

# Crear la base de datos en MySQL (XAMPP)
# Abrí phpMyAdmin y creá una DB llamada "stockwise"

# Iniciar el servidor (las tablas se crean automáticamente)
uvicorn app.main:app --reload
```

La API estará disponible en: `http://localhost:8000`  
Documentación interactiva: `http://localhost:8000/docs`

### 3. Frontend (React)

```bash
cd stockwise/frontend

# Instalar dependencias
npm install

# Configurar variable de entorno
cp .env.example .env
# VITE_API_URL=http://localhost:8000/api

# Iniciar el servidor de desarrollo
npm run dev
```

La aplicación estará disponible en: `http://localhost:5173`

---

## 🌐 Deploy en producción

### Backend → Railway

1. Crear cuenta en [railway.app](https://railway.app)
2. Nuevo proyecto → "Deploy from GitHub repo"
3. Seleccionar el repositorio
4. Configurar:
   - **Root Directory**: `stockwise/backend`
   - El `Procfile` ya está incluido con el comando de inicio
5. Agregar las variables de entorno necesarias (DATABASE_URL, etc.)

### Frontend → Vercel

1. Crear cuenta en [vercel.com](https://vercel.com)
2. Nuevo proyecto → conectar el repositorio
3. Configurar:
   - **Root Directory**: `stockwise/frontend`
4. Agregar variable de entorno `VITE_API_URL` con la URL de Railway

### CI/CD automático

Con los secrets configurados, cada push a `main` dispara automáticamente:
1. ✅ Lint y tests del backend
2. ✅ Build del frontend
3. 🚀 Deploy automático en Railway + Vercel

---

## 📁 Estructura del proyecto

```
stockwise/
├── .github/
│   └── workflows/
│       └── ci.yml              # Pipeline CI/CD
├── backend/
│   ├── app/
│   │   ├── database/
│   │   │   └── connection.py   # Config SQLAlchemy
│   │   ├── models/
│   │   │   └── models.py       # Tablas ORM
│   │   ├── routers/
│   │   │   ├── products.py     # CRUD productos
│   │   │   ├── categories.py   # CRUD categorías
│   │   │   ├── movements.py    # Movimientos de stock
│   │   │   └── dashboard.py    # Stats y métricas
│   │   ├── schemas/
│   │   │   └── schemas.py      # Modelos Pydantic
│   │   └── main.py             # App FastAPI
│   ├── requirements.txt
│   ├── Procfile
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── client.ts       # Funciones axios
│   │   ├── hooks/
│   │   │   └── useStock.ts     # TanStack Query hooks
│   │   ├── pages/
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Products.tsx
│   │   │   ├── Categories.tsx
│   │   │   └── Movements.tsx
│   │   ├── types/
│   │   │   └── index.ts        # Tipos TypeScript
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── package.json
│   └── vercel.json
└── README.md
```