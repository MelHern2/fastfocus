# Sistema de Administración - FastFocus

## Descripción

Sistema de administración completo para la gestión de categorías con autenticación de administrador.

## Características

### 🔐 Autenticación de Administrador
- Solo el usuario `melanasdoblaktocas3@gmail.com` puede acceder al panel de administración
- Protección de rutas con guards de navegación
- Verificación automática de permisos

### 📁 Gestión de Categorías
- **Crear categorías** con nombre, descripción y categoría padre opcional
- **Editar categorías** existentes
- **Eliminar categorías** (con validación para evitar eliminar categorías con hijos)
- **Estructura jerárquica** de categorías padre-hijo
- **Validaciones** para evitar referencias circulares

## Estructura del Proyecto

```
src/
├── composables/
│   ├── useAdmin.ts          # Verificación de permisos de administrador
│   ├── useAuth.ts           # Autenticación de usuarios
│   ├── useCategories.ts     # Gestión de categorías
│   └── useFirestore.ts      # Operaciones con Firestore
├── components/
│   ├── CategoryForm.vue     # Formulario para crear/editar categorías
│   ├── CategoryList.vue     # Lista de categorías con acciones
│   └── NavBar.vue           # Navegación con enlace de admin
├── types/
│   └── category.ts          # Tipos TypeScript para categorías
├── views/
│   └── AdminView.vue        # Panel principal de administración
└── router/
    └── index.ts             # Rutas con protección de admin
```

## Cómo Usar

### 1. Acceder al Panel de Administración

1. Inicia sesión con el email `melanasdoblaktocas3@gmail.com`
2. Haz clic en el enlace "Admin" en la barra de navegación
3. O navega directamente a `/admin`

### 2. Gestionar Categorías

#### Crear una Nueva Categoría
1. En el panel de administración, haz clic en "Nueva Categoría"
2. Completa el formulario:
   - **Nombre**: Nombre de la categoría (requerido)
   - **Descripción**: Descripción detallada (requerido)
   - **Categoría Padre**: Selecciona una categoría padre (opcional)
3. Haz clic en "Crear"

#### Editar una Categoría
1. En la lista de categorías, haz clic en el botón de editar (✏️)
2. Modifica los campos necesarios
3. Haz clic en "Actualizar"

#### Eliminar una Categoría
1. En la lista de categorías, haz clic en el botón de eliminar (🗑️)
2. Confirma la eliminación
3. **Nota**: No se pueden eliminar categorías que tienen subcategorías

### 3. Estructura Jerárquica

- Las categorías pueden tener una categoría padre
- Se muestran como "Categoría raíz" si no tienen padre
- Se muestra el nombre del padre si existe
- Se previenen referencias circulares automáticamente

## Tecnologías Utilizadas

- **Vue 3** con Composition API
- **TypeScript** para tipado estático
- **Firebase Firestore** para almacenamiento
- **Firebase Auth** para autenticación
- **Vue Router** con guards de navegación
- **CSS moderno** con diseño responsive

## Seguridad

- ✅ Verificación de email de administrador
- ✅ Protección de rutas
- ✅ Validación de formularios
- ✅ Prevención de eliminación de categorías con hijos
- ✅ Manejo de errores

## Responsive Design

El sistema está optimizado para:
- 📱 Dispositivos móviles
- 💻 Tablets
- 🖥️ Escritorio

## Próximas Mejoras

- [ ] Búsqueda y filtrado de categorías
- [ ] Ordenamiento personalizable
- [ ] Importación/exportación de categorías
- [ ] Historial de cambios
- [ ] Categorías con iconos
- [ ] Colores personalizados para categorías

