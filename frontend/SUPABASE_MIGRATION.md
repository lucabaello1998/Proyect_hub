# 🎉 Migración a Supabase Completada

## ✅ Cambios Realizados

### 1. **Instalación de Dependencias**
```bash
npm install @supabase/supabase-js
```

### 2. **Archivos Creados/Modificados**

#### Nuevos Archivos:
- ✅ `src/config/supabase.ts` - Cliente de Supabase
- ✅ `SUPABASE_SETUP.md` - Guía completa de configuración paso a paso
- ✅ `.env.example` - Template de variables de entorno
- ✅ `.gitignore` - Actualizado para ignorar `.env`

#### Archivos Modificados:
- ✅ `src/services/authService.ts` - Migrado a Supabase Authentication
- ✅ `src/services/projectService.ts` - Migrado a Supabase Database + Storage
- ✅ `src/store/useAuthStore.ts` - Actualizado para usar authService
- ✅ `src/store/useProjects.ts` - Actualizado para usar projectService
- ✅ `src/types/auth.ts` - User.id ahora acepta string | number
- ✅ `src/types/project.ts` - Project.id cambiado a string (UUID)
- ✅ `src/App.tsx` - Inicializa auth y carga proyectos al montar

---

## 🚀 Próximos Pasos

### 1. **Configurar Supabase** (15-20 minutos)

Sigue la guía completa en `SUPABASE_SETUP.md`. Incluye:

#### a) Crear Proyecto en Supabase
- Registro en https://supabase.com
- Crear proyecto "Hub de Proyectos"
- Obtener URL y anon key

#### b) Crear archivo `.env`
```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu_anon_key_aqui
```

#### c) Crear Tablas
- **Tabla `users`**: Para los 4 administradores
- **Tabla `projects`**: Para almacenar proyectos

#### d) Configurar Autenticación
- Crear los 4 usuarios en Authentication:
  - AgustinConde@proyecthub.com
  - CynthiaSchloymann@proyecthub.com
  - sebafinochetti@proyecthub.com
  - lucabaello@proyecthub.com
- Insertar registros en la tabla `users` con sus UIDs

#### e) Configurar Storage
- Crear bucket `project-images` (público)
- Configurar políticas de acceso

#### f) Configurar Políticas RLS
- Políticas para lectura pública de proyectos
- Políticas para que solo admins puedan crear/editar/eliminar

---

## 📊 Arquitectura Actual

```
Frontend (React + TypeScript)
    ↓
Stores (Zustand)
    ↓
Services
    ├── authService.ts → Supabase Auth
    └── projectService.ts → Supabase DB + Storage
         ↓
Supabase Backend
    ├── PostgreSQL Database
    │   ├── users (4 admins)
    │   └── projects
    └── Storage
        └── project-images bucket
```

---

## 🔐 Sistema de Autenticación

### Flujo de Login:
1. Usuario ingresa `username` y `password` en `/login`
2. `authService.login()` busca en tabla `users` el email basado en username
3. Autentica con `supabase.auth.signInWithPassword()`
4. Si es exitoso, actualiza `useAuthStore` con los datos del usuario
5. Redirige a `/admin` (solo si role='admin')

### Listener de Sesión:
- `authService.onAuthChange()` escucha cambios en la sesión de Supabase
- Actualiza automáticamente el estado global cuando cambia la autenticación

---

## 📦 Gestión de Proyectos

### Crear Proyecto:
```typescript
// En Admin.tsx
const handleSubmit = async () => {
  await useProjects.getState().add(projectData, imageFiles);
};
```

**Proceso:**
1. Sube imágenes a `project-images/projects/`
2. Obtiene URLs públicas
3. Crea registro en tabla `projects`
4. Primera imagen = portada (`imageUrl`)
5. Todas las imágenes en array `images`

### Actualizar Proyecto:
```typescript
await useProjects.getState().update(id, updates, newImages);
```

**Proceso:**
1. Si hay nuevas imágenes, las sube
2. Actualiza el registro en la DB
3. Refresca el estado local

### Eliminar Proyecto:
```typescript
await useProjects.getState().remove(id);
```

**Proceso:**
1. Obtiene las URLs de las imágenes del proyecto
2. Elimina las imágenes del Storage
3. Elimina el registro de la DB

---

## 🗂️ Estructura de la Base de Datos

### Tabla `users`
```sql
id          uuid PRIMARY KEY DEFAULT gen_random_uuid()
username    text UNIQUE NOT NULL
name        text NOT NULL
email       text UNIQUE NOT NULL
role        text DEFAULT 'user'
created_at  timestamptz DEFAULT now()
```

### Tabla `projects`
```sql
id           uuid PRIMARY KEY DEFAULT gen_random_uuid()
title        text NOT NULL
description  text
author       text
category     text
stack        text[]
tags         text[]
images       text[]
image_url    text
demo_url     text
repo_url     text
created_at   timestamptz DEFAULT now()
```

---

## 🔒 Políticas de Seguridad (RLS)

### Tabla `users`:
- ✅ **Lectura**: Usuarios autenticados pueden ver todos los usuarios
- ❌ **Escritura**: No permitida (usuarios creados manualmente)

### Tabla `projects`:
- ✅ **Lectura**: Público (cualquiera puede ver proyectos)
- ✅ **Escritura**: Solo usuarios con `role='admin'`

### Storage `project-images`:
- ✅ **Lectura**: Público
- ✅ **Upload**: Usuarios autenticados

---

## 🧪 Testing

### 1. Probar Autenticación
```
1. Ve a /login
2. Ingresa: username=lucabaello, password=12345
3. Deberías ser redirigido a /admin
```

### 2. Probar CRUD de Proyectos
```
1. En /admin, crea un proyecto
2. Sube algunas imágenes
3. Verifica que aparezca en Home
4. Edita el proyecto
5. Elimina el proyecto
```

### 3. Verificar Permisos
```
1. Cierra sesión
2. Intenta acceder a /admin
3. Deberías ser redirigido a /login
```

---

## 🎯 Ventajas de Supabase

| Característica | Firebase | Supabase |
|----------------|----------|----------|
| **Storage gratuito** | 5GB (requiere tarjeta) | 500MB (sin tarjeta) |
| **Base de datos** | NoSQL (Firestore) | PostgreSQL (SQL) |
| **Queries SQL** | ❌ | ✅ |
| **RLS integrado** | ❌ | ✅ |
| **Open Source** | ❌ | ✅ |
| **Webhooks** | Limitado | ✅ |
| **Tarjeta requerida** | Sí (para Storage) | No |

---

## 🐛 Troubleshooting Común

### Error: "No credentials found"
**Solución:** Crea el archivo `.env` con tus credenciales y reinicia el servidor (`npm run dev`)

### Error: "Row Level Security policy violation"
**Solución:** 
1. Ve a Supabase > Authentication > Users
2. Copia el User UID del usuario
3. Inserta el registro en la tabla `users` con ese UID
4. Verifica que `role='admin'`

### Error: "Failed to upload image"
**Solución:** 
1. Verifica que el bucket `project-images` esté creado
2. Asegúrate de que sea público
3. Revisa las políticas de Storage

### No se cargan los proyectos
**Solución:** Abre la consola del navegador y revisa errores de red o CORS

---

## 📝 Notas Importantes

1. **No commitear `.env`**: El archivo ya está en `.gitignore`
2. **Usar `.env.example`**: Como referencia para otros devs
3. **Reiniciar servidor**: Después de cambiar variables de entorno
4. **UUIDs**: Supabase usa UUIDs (strings), no números
5. **Snake_case vs camelCase**: 
   - Supabase DB usa `snake_case`
   - TypeScript usa `camelCase`
   - Los servicios hacen la conversión automática

---

## 🔄 Diferencias con Firebase

### Antes (Firebase):
```typescript
// Subir imagen
const storageRef = ref(storage, `images/${file.name}`);
await uploadBytes(storageRef, file);
const url = await getDownloadURL(storageRef);

// Crear proyecto
await addDoc(collection(db, 'projects'), projectData);
```

### Ahora (Supabase):
```typescript
// Subir imagen
await supabase.storage.from('bucket').upload(path, file);
const { data } = supabase.storage.from('bucket').getPublicUrl(path);

// Crear proyecto
await supabase.from('projects').insert([projectData]);
```

---

## ✨ Resumen

✅ **Backend configurado**: Supabase reemplaza a Firebase completamente
✅ **Autenticación**: Email/Password para 4 admins
✅ **Base de datos**: PostgreSQL con tablas `users` y `projects`
✅ **Storage**: Bucket público para imágenes de proyectos
✅ **Seguridad**: RLS configurado para proteger endpoints
✅ **Stores actualizados**: Zustand conectado a Supabase

**Estado actual**: ⏳ Código listo, falta configurar Supabase cloud

**Próximo paso**: 👉 Seguir `SUPABASE_SETUP.md` para configurar el backend

---

¿Necesitas ayuda con la configuración? ¡Pregúntame! 🚀
