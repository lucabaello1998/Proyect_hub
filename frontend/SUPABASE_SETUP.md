# 🚀 Guía de Configuración de Supabase para Hub de Proyectos

## ¿Por qué Supabase?

- ✅ **100% GRATIS** sin tarjeta de crédito
- ✅ 500MB de storage gratuito
- ✅ PostgreSQL (más potente que Firestore)
- ✅ Autenticación incluida
- ✅ Más simple que Firebase

---

## 📋 Paso a Paso

### 1. Crear Cuenta y Proyecto

1. Ve a https://supabase.com
2. Click en **"Start your project"**
3. Inicia sesión con **GitHub** (recomendado)
4. Click en **"New project"**
5. Completa:
   - **Name**: `Hub de Proyectos`
   - **Database Password**: Copia y guarda esta contraseña (la necesitarás)
   - **Region**: South America (sao1) o la más cercana
   - **Pricing Plan**: Free (0 USD/month)
6. Click en **"Create new project"** (tarda 2-3 minutos)

---

### 2. Obtener las Credenciales

Una vez creado el proyecto:

1. Ve a **"Settings"** (⚙️ en el menú lateral)
2. Click en **"API"**
3. Encontrarás:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public key**: Una clave larga

**¡Copia estos dos valores!** Los necesitarás en el siguiente paso.

---

### 3. Configurar el Proyecto

#### 3.1 Crear archivo `.env`

En la raíz de tu proyecto, crea un archivo `.env`:

```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu_anon_key_aqui
```

#### 3.2 Actualizar `.gitignore`

Asegúrate de que `.env` esté en tu `.gitignore`:

```
.env
.env.local
```

#### 3.3 Actualizar `src/config/supabase.ts`

El archivo ya está configurado para leer las variables de entorno. Solo asegúrate de que se vea así:

```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
export default supabase;
```

---

### 4. Configurar la Base de Datos

#### 4.1 Crear tabla de usuarios

1. En Supabase, ve a **"Table Editor"** en el menú lateral
2. Click en **"Create a new table"**
3. Configuración:
   - **Name**: `users`
   - **Description**: Usuarios del sistema
   - **Enable Row Level Security (RLS)**: ✅ **Activado**

4. Agrega las siguientes columnas:

| Column Name | Type | Default Value | Primary | Unique | Nullable |
|-------------|------|---------------|---------|--------|----------|
| id | uuid | gen_random_uuid() | ✅ | ✅ | ❌ |
| username | text | - | ❌ | ✅ | ❌ |
| name | text | - | ❌ | ❌ | ❌ |
| email | text | - | ❌ | ✅ | ❌ |
| role | text | 'user' | ❌ | ❌ | ❌ |
| created_at | timestamptz | now() | ❌ | ❌ | ❌ |

5. Click en **"Save"**

#### 4.2 Crear tabla de proyectos

1. Click en **"Create a new table"**
2. Configuración:
   - **Name**: `projects`
   - **Description**: Proyectos del hub
   - **Enable Row Level Security (RLS)**: ✅ **Activado**

3. Agrega las siguientes columnas:

| Column Name | Type | Default Value | Primary | Nullable |
|-------------|------|---------------|---------|----------|
| id | uuid | gen_random_uuid() | ✅ | ❌ |
|    | text | - | ❌ | ❌ |
| description | text | - | ❌ | ✅ |
| author | text | - | ❌ | ✅ |
| category | text | - | ❌ | ✅ |
| stack | text[] | '{}' | ❌ | ✅ |
| tags | text[] | '{}' | ❌ | ✅ |
| images | text[] | '{}' | ❌ | ✅ |
| image_url | text | - | ❌ | ✅ |
| demo_url | text | - | ❌ | ✅ |
| repo_url | text | - | ❌ | ✅ |
| created_at | timestamptz | now() | ❌ | ❌ |

4. Click en **"Save"**

---

### 5. Configurar Authentication

#### 5.1 Habilitar Email/Password

1. Ve a **"Authentication"** > **"Providers"**
2. Asegúrate de que **"Email"** esté habilitado (viene activado por defecto)

#### 5.2 Crear los 4 usuarios administradores

1. Ve a **"Authentication"** > **"Users"**
2. Click en **"Add user"** > **"Create new user"**
3. Crea estos 4 usuarios:

**Usuario 1:**
```
Email: AgustinConde@proyecthub.com
Password: 12345
Auto Confirm User: ✅ (marcar)
```

**Usuario 2:**
```
Email: CynthiaSchloymann@proyecthub.com
Password: 12345
Auto Confirm User: ✅
```

**Usuario 3:**
```
Email: sebafinochetti@proyecthub.com
Password: 12345
Auto Confirm User: ✅
```

**Usuario 4:**
```
Email: lucabaello@proyecthub.com
Password: 12345
Auto Confirm User: ✅
```

**⚠️ IMPORTANTE**: Después de crear cada usuario, copia su **User UID** (lo necesitarás en el siguiente paso).

---

### 6. Insertar Datos de Usuarios en la Tabla

#### 6.1 Mediante SQL Editor

1. Ve a **"SQL Editor"** en el menú lateral
2. Click en **"New query"**
3. Pega y ejecuta este SQL (reemplaza los UUIDs con los reales):

```sql
-- Insertar los 4 usuarios administradores
-- Reemplaza 'UUID_DE_AGUSTIN', 'UUID_DE_CYNTHIA', etc. con los UIDs reales

INSERT INTO users (id, username, name, email, role) VALUES
('UUID_DE_AGUSTIN', 'AgustinConde', 'Agustín Conde', 'AgustinConde@proyecthub.com', 'admin'),
('UUID_DE_CYNTHIA', 'CynthiaSchloymann', 'Cynthia Schloymann', 'CynthiaSchloymann@proyecthub.com', 'admin'),
('UUID_DE_SEBA', 'sebafinochetti', 'Sebastián Finochetti', 'sebafinochetti@proyecthub.com', 'admin'),
('UUID_DE_LUCA', 'lucabaello', 'Luca Baello', 'lucabaello@proyecthub.com', 'admin');
```

4. Click en **"Run"** (o `Ctrl+Enter`)

---

### 7. Configurar Storage

#### 7.1 Crear bucket para imágenes

1. Ve a **"Storage"** en el menú lateral
2. Click en **"Create a new bucket"**
3. Configuración:
   - **Name**: `project-images`
   - **Public bucket**: ✅ **Activado** (para que las imágenes sean públicas)
4. Click en **"Create bucket"**

---

### 8. Configurar Políticas de Seguridad (RLS)

#### 8.1 Políticas para la tabla `users`

1. Ve a **"Authentication"** > **"Policies"**
2. Selecciona la tabla **`users`**
3. Click en **"New Policy"** > **"Create a policy from scratch"**

**Política 1: Lectura para usuarios autenticados**
```
Policy name: Users can read all users
Allowed operation: SELECT
Target roles: authenticated
USING expression:
true
```

**Política 2: No se permite escritura** (los usuarios solo se crean manualmente)

#### 8.2 Políticas para la tabla `projects`

1. Selecciona la tabla **`projects`**

**Política 1: Lectura pública**
```
Policy name: Anyone can read projects
Allowed operation: SELECT
Target roles: anon, authenticated
USING expression:
true
```

**Política 2: Solo admins pueden crear/editar/eliminar**
```
Policy name: Only admins can modify projects
Allowed operation: INSERT, UPDATE, DELETE
Target roles: authenticated
USING expression:
(SELECT role FROM users WHERE id = auth.uid()) = 'admin'
```

O usa este SQL directo:

```sql
-- Política de lectura pública
CREATE POLICY "Anyone can read projects"
ON projects FOR SELECT
TO public
USING (true);

-- Política de escritura solo para admins
CREATE POLICY "Only admins can modify projects"
ON projects FOR ALL
TO authenticated
USING (
  (SELECT role FROM users WHERE id = auth.uid()) = 'admin'
);
```

#### 8.3 Políticas para Storage

1. Ve a **"Storage"** > **"Policies"** > selecciona `project-images`

**Política 1: Lectura pública**
```
Policy name: Public can view images
Allowed operation: SELECT
Target roles: public
USING expression:
true
```

**Política 2: Usuarios autenticados pueden subir**
```
Policy name: Authenticated users can upload
Allowed operation: INSERT
Target roles: authenticated
WITH CHECK expression:
true
```

O usa SQL:

```sql
-- Lectura pública
CREATE POLICY "Public can view images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'project-images');

-- Upload para autenticados
CREATE POLICY "Authenticated can upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'project-images');
```

---

### 9. Probar la Configuración

#### 9.1 Reiniciar el servidor de desarrollo

```bash
npm run dev
```

#### 9.2 Probar el login

1. Ve a `/login`
2. Intenta iniciar sesión con:
   - Username: `lucabaello`
   - Password: `12345`

3. Deberías poder acceder al panel de admin

---

## 🎯 Checklist de Configuración

- [ ] Proyecto de Supabase creado
- [ ] Credenciales copiadas (URL y anon key)
- [ ] Archivo `.env` creado con las credenciales
- [ ] Tabla `users` creada
- [ ] Tabla `projects` creada
- [ ] 4 usuarios creados en Authentication
- [ ] 4 registros insertados en tabla `users`
- [ ] Bucket `project-images` creado como público
- [ ] Políticas RLS configuradas para `users`
- [ ] Políticas RLS configuradas para `projects`
- [ ] Políticas de Storage configuradas
- [ ] SDK de Supabase instalado (`npm install @supabase/supabase-js`)

---

## 🔍 Verificación Rápida

### Ver datos en las tablas

```sql
-- Ver usuarios
SELECT * FROM users;

-- Ver proyectos
SELECT * FROM projects;
```

### Probar autenticación

En el SQL Editor:

```sql
-- Ver usuarios de Authentication
SELECT * FROM auth.users;
```

---

## 🆘 Troubleshooting

### Error: "No credentials found"
- Verifica que el archivo `.env` esté en la raíz del proyecto
- Reinicia el servidor (`npm run dev`)

### Error: "Row Level Security policy violation"
- Revisa que las políticas RLS estén bien configuradas
- Verifica que el usuario tenga role='admin' en la tabla users

### No se pueden subir imágenes
- Verifica que el bucket `project-images` sea público
- Revisa las políticas de Storage

---

## 📞 ¿Necesitas ayuda?

Si algo no funciona, avísame y te ayudo! 🚀

---

## 🎁 Ventajas de Supabase vs Firebase

| Característica | Supabase | Firebase |
|----------------|----------|----------|
| Storage gratis | 500MB | Requiere pago |
| Base de datos | PostgreSQL | NoSQL |
| Tarjeta crédito | No requerida | Requerida para Storage |
| Open Source | ✅ | ❌ |
| SQL directo | ✅ | ❌ |
| Webhooks | ✅ | Limitado |
