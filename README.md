# Avantik Scale Website

Landing page moderna y tecnológica para **Avantik Scale**, especializada en agencias y negocios digitales.

## 🚀 Tecnologías

- **Vite**: Build tool y servidor de desarrollo rápido.
- **Vanilla JS & CSS**: Sin frameworks pesados, alto rendimiento.
- **CSS Variables**: Sistema de diseño escalable.
- **Google Fonts**: Inter (Cuerpo) y Outfit (Títulos).

## 🛠️ Instalación y Ejecución

1.  **Instalar dependencias**:
    ```bash
    npm install
    ```

2.  **Iniciar servidor de desarrollo**:
    ```bash
    npm run dev
    ```
    Visita `http://localhost:5173` en tu navegador.

3.  **Construir para producción**:
    ```bash
    npm run build
    ```
    Los archivos generados estarán en `dist/`.

## 🎨 Estructura del Proyecto

- `src/styles/`:
    - `variables.css`: Colores y espaciado (Design System).
    - `reset.css`: Reset CSS moderno.
    - `typography.css`: Configuración de fuentes.
    - `layout.css`: Utilidades de grid y flex.
    - `components/`: Estilos específicos por sección (header, hero, trust, etc.).
- `src/main.js`: Lógica principal y animaciones.
- `index.html`: Estructura HTML semántica.

## 📱 Diseño y Decisiones

- **Dark Mode Predominante**: Fondo oscuro (`#0D1131`) con secciones de contraste en claro (`#F6F9FF`).
- **Animaciones**: Fade-in al hacer scroll usando Intersection Observer.
- **Responsividad**: Diseño fluido con media queries para móvil y desktop.
