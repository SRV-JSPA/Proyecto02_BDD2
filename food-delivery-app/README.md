# FoodApp - Aplicación de Gestión de Restaurantes y Pedidos

FoodApp es una aplicación web moderna y responsiva desarrollada con React y TailwindCSS que permite a los usuarios explorar restaurantes, ver menús, realizar pedidos, y gestionar sus datos personales.

## Características Principales

- 🍽️ **Exploración de Restaurantes**: Búsqueda, filtrado y visualización de restaurantes por diversos criterios
- 🥗 **Menús Interactivos**: Visualización de menús completos con categorías, detalles de platos y opciones dietéticas
- 🛒 **Carrito de Compras**: Sistema completo para añadir artículos, modificar cantidades y procesar pedidos
- 👤 **Perfiles de Usuario**: Gestión de datos personales, direcciones de entrega y métodos de pago
- 📋 **Gestión de Pedidos**: Seguimiento de pedidos en curso e historial completo
- ⭐ **Sistema de Reseñas**: Valoración y comentarios sobre restaurantes

## Stack Tecnológico

- **Frontend**:
  - React 18+
  - React Router 6 para navegación
  - TailwindCSS para estilos
  - Axios para peticiones HTTP
  - React Hook Form para manejo de formularios
  - React Icons para iconografía
  - React Toastify para notificaciones

- **Backend**:
  - API REST desarrollada en Node.js con Express
  - MongoDB como base de datos NoSQL
  - Mongoose como ODM para MongoDB

## Instalación

1. Clona este repositorio:
   ```bash
   git clone https://github.com/username/food-delivery-app.git
   cd food-delivery-app
   ```

2. Instala las dependencias:
   ```bash
   npm install
   ```

3. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```

4. Abre [http://localhost:5173](http://localhost:5173) en tu navegador.

## Uso del API

La aplicación consume una API REST que debe estar corriendo en `http://localhost:3000`. Para configurar el backend, sigue las instrucciones en el repositorio del backend.

El proyecto está configurado con un proxy en Vite (`/api` → `http://localhost:3000`) para evitar problemas de CORS durante el desarrollo.

## Estructura del Proyecto

```
src/
├── api/           # Servicios para comunicación con el backend
├── components/    # Componentes reutilizables
├── context/       # Contextos de React (Auth, Cart)
├── hooks/         # Hooks personalizados
├── pages/         # Páginas de la aplicación
├── utils/         # Utilidades y funciones auxiliares
├── App.jsx        # Componente principal
└── index.js       # Punto de entrada
```

## Licencia

Este proyecto está licenciado bajo la licencia MIT - ver el archivo LICENSE para más detalles.