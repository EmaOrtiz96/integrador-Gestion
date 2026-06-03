# Informe Técnico — StockWise
### TP Integrador: Desarrollo Ágil Asistido por IA
**Programación IV · 2025**

---

## 1. Arsenal de herramientas de IA utilizadas

### Claude (Anthropic) — Herramienta principal

**Claude** fue la herramienta central del desarrollo. Se utilizó a través de la interfaz web [claude.ai](https://claude.ai) y de **Claude Code** (CLI), abarcando prácticamente todas las etapas del proyecto:

| Etapa | Uso concreto de Claude |
|---|---|
| Arquitectura inicial | Definición de la estructura de carpetas, decisión del stack, diseño del modelo de base de datos |
| Backend (FastAPI) | Generación completa de modelos SQLAlchemy, schemas Pydantic, routers y lógica de negocio |
| Frontend (React/TS) | Componentes, hooks TanStack Query, sistema de diseño CSS personalizado |
| DevOps | Configuración del pipeline CI/CD en GitHub Actions, archivos `render.yaml` y `vercel.json` |
| Documentación | README, este informe técnico, comentarios de código |

**Modelo utilizado**: Claude Sonnet 4.6 (claude.ai web)

---

## 2. Sinergia con la IA: cómo ayudó a programar, depurar y testear

### 2.1 Programación

La mayor ganancia de productividad se dio en la generación de código boilerplate y en la coherencia entre capas. Por ejemplo, al describir el modelo `Product` con sus campos, Claude generó simultáneamente:
- El modelo SQLAlchemy con relaciones
- Los schemas Pydantic de entrada/salida con validaciones
- El router FastAPI con todos los endpoints CRUD
- Los tipos TypeScript equivalentes en el frontend
- El hook `useProducts` con TanStack Query

Este flujo que normalmente tomaría varias horas se redujo a minutos, manteniendo consistencia de nombres y tipos entre backend y frontend.

### 2.2 Diseño del sistema

Claude fue especialmente útil para pensar el modelo de datos del historial de movimientos. La entidad `StockMovement` con los campos `stock_before` y `stock_after` surgió de una consulta sobre cómo implementar auditoría de cambios de stock de forma trazable. Esta decisión de diseño mejoró significativamente la trazabilidad del sistema.

### 2.3 Depuración

Durante el desarrollo, se consultaron situaciones como:
- Configuración correcta de CORS en FastAPI para desarrollo local
- Manejo de tipos nullable en Pydantic v2 (`Optional` vs `| None`)
- Invalidación de queries en TanStack Query v5 luego de mutaciones

### 2.4 Testing

Se verificó el funcionamiento de la API usando la documentación interactiva generada por FastAPI (`/docs`), complementada con consultas a Claude sobre casos borde (ej: qué pasa si se intenta registrar una salida con stock insuficiente).

---

## 3. Prompts más efectivos

### Prompt que mejor funcionó:

```
Necesito un sistema de control de stock con FastAPI + React + TypeScript + MySQL.
El backend debe tener: modelos SQLAlchemy para Product, Category y StockMovement,
schemas Pydantic v2, routers con CRUD completo, y un endpoint de dashboard con
estadísticas agregadas. El frontend debe usar TanStack Query v5 con hooks
personalizados. Dame el código completo con buenas prácticas.
```

**Por qué funcionó**: fue específico en el stack, mencionó las versiones exactas (Pydantic v2, TanStack Query v5) y definió claramente las entidades y qué se esperaba de cada capa.

### Prompt que no funcionó bien (primera iteración):

```
Haceme una app de stock
```

**Problema**: demasiado vago. La respuesta fue genérica y no aprovechó el stack conocido. Se necesitó refinar con contexto específico.

---

## 4. Lecciones aprendidas

### ✅ Lo que funcionó muy bien

1. **Consistencia entre capas**: al darle a Claude el contexto completo del stack en un solo prompt, generó código coherente entre backend y frontend (mismos nombres de campos, mismos tipos).

2. **Generación de CSS personalizado**: Claude generó un sistema de diseño completo con variables CSS, evitando dependencias de UI libraries pesadas como MUI o Chakra.

3. **CI/CD desde el inicio**: incluir la automatización en el mismo flujo permitió tener un pipeline funcional sin dedicarle tiempo extra al final.

### ⚠️ Desafíos y limitaciones encontradas

1. **Versiones de librerías**: Claude a veces sugería sintaxis de versiones anteriores (ej: `from_orm()` de Pydantic v1 vs `model_validate()` de Pydantic v2). Fue necesario verificar la documentación oficial para las partes más sensibles a versioning.

2. **Contexto de largo alcance**: en conversaciones muy largas, Claude podía perder el hilo de decisiones anteriores (ej: qué campos tenía exactamente un modelo). La solución fue mantener un contexto resumido al inicio de cada sesión nueva.

3. **Código que no se puede ejecutar directamente**: el código generado siempre requirió ajustes menores de adaptación al entorno local (rutas de importación, variables de entorno, configuración de XAMPP).

4. **La IA no reemplaza el criterio propio**: Claude sugirió en un punto usar un ORM async para mejor performance. Si bien técnicamente correcto, habría complejizado innecesariamente el proyecto. Se tomó la decisión de mantener el ORM síncrono por simplicidad y tiempo disponible.

### 💡 Conclusión

El desarrollo asistido por IA multiplicó la velocidad de producción de código sin sacrificar calidad. La clave fue usar la IA como un colaborador técnico al que hay que darle contexto claro y revisar críticamente sus outputs, no como una caja negra que genera código listo para producción sin revisión.

---

## 5. Tecnologías de deploy utilizadas

| Servicio | Rol | Tier gratuito |
|---|---|---|
| **Render** | Hosting del backend FastAPI | Free (spin-down tras inactividad) |
| **Vercel** | Hosting del frontend React | Free |
| **Railway** | MySQL en producción | Free tier 500 horas/mes |
| **GitHub Actions** | CI/CD | Free (2000 min/mes) |

---

*Informe generado como parte del TP Integrador de Programación IV · 2025*
