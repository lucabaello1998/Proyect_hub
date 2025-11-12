# 🔥 Guía de Configuración de Firebase para Hub de Proyectos

## 📋 Paso a Paso

### 1. Configurar la Web App en Firebase Console

1. Ve a la consola de Firebase: https://console.firebase.google.com
2. Selecciona tu proyecto: **back-hub-proyectos**
3. En "Descripción general", haz clic en el ícono web `</>` para agregar una app
4. Registra la app con el nombre "Hub de Proyectos"
5. **Copia la configuración** que te muestra (la necesitarás en el siguiente paso)
6. Pégala en el archivo `src/config/firebase.ts`

Ejemplo de configuración:
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "back-hub-proyectos.firebaseapp.com",
  projectId: "back-hub-proyectos",
  storageBucket: "back-hub-proyectos.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:xxxxxxxxxxxxx"
};
```

---

### 2. Configurar Authentication

#### 2.1 Habilitar Authentication
1. En el menú lateral, ve a **"Compilación" > "Authentication"**
2. Click en **"Comenzar"**
3. Selecciona **"Correo electrónico/contraseña"**
4. Habilita el método y guarda

#### 2.2 Crear los 4 usuarios administradores
1. Ve a la pestaña **"Users"**
2. Click en **"Agregar usuario"**
3. Crea estos 4 usuarios:

```
Email: AgustinConde@proyecthub.com
Contraseña: 12345

Email: CynthiaSchloymann@proyecthub.com
Contraseña: 12345

Email: sebafinochetti@proyecthub.com
Contraseña: 12345

Email: lucabaello@proyecthub.com
Contraseña: 12345
```

**IMPORTANTE**: Copia los UIDs de cada usuario, los necesitarás en el siguiente paso.

---

### 3. Configurar Firestore Database

#### 3.1 Crear la base de datos
1. Ve a **"Compilación" > "Firestore Database"**
2. Click en **"Crear base de datos"**
3. Selecciona **"Comenzar en modo de prueba"**
4. Elige la región más cercana (ej: `us-central1`)

#### 3.2 Crear la colección de usuarios
1. Click en **"Iniciar colección"**
2. ID de colección: `users`
3. Crea 4 documentos (uno por cada usuario):

**Documento 1:**
```
ID del documento: [UID de AgustinConde desde Authentication]
Campos:
  - username: "AgustinConde" (string)
  - name: "Agustín Conde" (string)
  - email: "AgustinConde@proyecthub.com" (string)
  - role: "admin" (string)
```

**Documento 2:**
```
ID del documento: [UID de CynthiaSchloymann desde Authentication]
Campos:
  - username: "CynthiaSchloymann" (string)
  - name: "Cynthia Schloymann" (string)
  - email: "CynthiaSchloymann@proyecthub.com" (string)
  - role: "admin" (string)
```

**Documento 3:**
```
ID del documento: [UID de sebafinochetti desde Authentication]
Campos:
  - username: "sebafinochetti" (string)
  - name: "Sebastián Finochetti" (string)
  - email: "sebafinochetti@proyecthub.com" (string)
  - role: "admin" (string)
```

**Documento 4:**
```
ID del documento: [UID de lucabaello desde Authentication]
Campos:
  - username: "lucabaello" (string)
  - name: "Luca Baello" (string)
  - email: "lucabaello@proyecthub.com" (string)
  - role: "admin" (string)
```

#### 3.3 Crear la colección de proyectos
1. Click en **"Iniciar colección"**
2. ID de colección: `projects`
3. Puedes crear un proyecto de ejemplo o dejarlo vacío

Campos de ejemplo:
```
ID del documento: [auto generado]
Campos:
  - title: "Proyecto de Ejemplo" (string)
  - description: "Descripción del proyecto" (string)
  - author: "Luca Baello" (string)
  - category: "Web" (string)
  - stack: ["React", "TypeScript", "Firebase"] (array)
  - tags: ["Frontend", "Backend"] (array)
  - images: ["url1", "url2"] (array)
  - imageUrl: "url1" (string)
  - demoUrl: "https://ejemplo.com" (string)
  - repoUrl: "https://github.com/..." (string)
  - createdAt: [timestamp - click en el reloj]
```

---

### 4. Configurar Storage

#### 4.1 Habilitar Storage
1. Ve a **"Compilación" > "Storage"**
2. Click en **"Comenzar"**
3. Selecciona **"Comenzar en modo de prueba"**
4. Usa la misma región que Firestore

#### 4.2 Crear carpeta para proyectos
1. En la pestaña **"Files"**, puedes crear una carpeta `projects/` (se creará automáticamente al subir la primera imagen)

---

### 5. Configurar Reglas de Seguridad (IMPORTANTE)

#### 5.1 Firestore Rules
Ve a **"Firestore Database" > "Reglas"** y reemplaza con:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Usuarios: solo lectura para autenticados
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if false; // Solo se crean manualmente
    }
    
    // Proyectos: lectura pública, escritura solo para admins
    match /projects/{projectId} {
      allow read: if true; // Cualquiera puede leer
      allow write: if request.auth != null && 
                     get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
```

#### 5.2 Storage Rules
Ve a **"Storage" > "Reglas"** y reemplaza con:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /projects/{allPaths=**} {
      allow read: if true; // Cualquiera puede ver las imágenes
      allow write: if request.auth != null; // Solo usuarios autenticados pueden subir
    }
  }
}
```

---

### 6. Instalar Firebase SDK

En tu terminal, ejecuta:

```bash
npm install firebase
```

---

### 7. Variables de Entorno (Opcional pero Recomendado)

Crea un archivo `.env` en la raíz del proyecto:

```env
VITE_FIREBASE_API_KEY=tu_api_key
VITE_FIREBASE_AUTH_DOMAIN=tu_auth_domain
VITE_FIREBASE_PROJECT_ID=back-hub-proyectos
VITE_FIREBASE_STORAGE_BUCKET=tu_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
VITE_FIREBASE_APP_ID=tu_app_id
```

Y actualiza `src/config/firebase.ts` para usar las variables:

```typescript
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};
```

Agrega `.env` a tu `.gitignore`:
```
.env
.env.local
```

---

### 8. Próximos pasos

Una vez configurado Firebase, necesitarás:

1. ✅ Actualizar `useAuthStore.ts` para usar Firebase Authentication
2. ✅ Actualizar `useProjects.ts` para usar Firestore
3. ✅ Actualizar `Admin.tsx` para subir imágenes a Storage
4. ✅ Probar el login con los usuarios creados
5. ✅ Crear proyectos con imágenes

---

## 🎯 Checklist de Configuración

- [ ] Web app creada y configuración copiada
- [ ] Authentication habilitado
- [ ] 4 usuarios creados en Authentication
- [ ] Firestore Database creado
- [ ] Colección `users` con 4 documentos
- [ ] Colección `projects` creada
- [ ] Storage habilitado
- [ ] Reglas de seguridad de Firestore actualizadas
- [ ] Reglas de seguridad de Storage actualizadas
- [ ] Firebase SDK instalado (`npm install firebase`)
- [ ] Configuración pegada en `src/config/firebase.ts`

---

## 📞 ¿Necesitas ayuda?

Si tienes algún error o duda durante la configuración, avísame y te ayudo! 🚀
