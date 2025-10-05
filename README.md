# Bridgeway Interaction Demo

Monochromatic demo built with React, TypeScript, and Vite to showcase the interaction design for Bridgeway's navigation, modal booking flow, and accessibility strategy.

## Instalación y scripts

```bash
npm install
npm run dev     # inicia Vite en modo demo
npm run build   # compila el proyecto
npm run preview # servidor previo a producción
npm run lint    # validación de tipos
```

> Nota: si no hay acceso a npm, instala dependencias de forma local o utiliza `pnpm`/`yarn` apuntando al mismo package.json.

## Atajos de teclado

- `Tab` / `Shift + Tab`: navegar por elementos interactivos.
- `Enter` / `Espacio`: activar botones y enlaces.
- `Esc`: cerrar submenús y el modal.
- `Flechas ↑↓`: recorrer elementos dentro de submenús de escritorio.

## Cómo probar i18n

1. Arranca la aplicación con `npm run dev`.
2. Visita rutas con prefijo `/en/`, `/ro/` o `/ru/`.
3. Cambia de idioma desde el selector del header; la ruta y el scroll actual se mantienen.

## Preferencias del sistema

- `prefers-reduced-motion`: activa desde las opciones de accesibilidad del sistema operativo para ver la reducción de animaciones.
- `prefers-contrast: more` o modo de alto contraste: cambia al modo correspondiente en el sistema operativo; el UI adopta mayor contraste automáticamente.

## Simulación de fallbacks

- **Sin persistencia**: abre la demo en modo incógnito o desactiva `localStorage` para ver los avisos de degradación silenciosa.
- **Sin JS**: deshabilita JavaScript en el navegador; los enlaces de los menús llevan a páginas índice para mantener la navegación.
- **Conexión lenta o ahorro de datos**: habilita `Save-Data` en herramientas de desarrollo para desactivar el prefetch progresivo.
- **Modal sin .ics**: bloquea descargas automáticas o pop-ups para comprobar que el enlace `.ics` sigue disponible.

## Estados simulados

Los flujos de red (prefetch, reserva de clase, etc.) utilizan `setTimeout` para demostrar los estados de carga, éxito y error sin depender de un backend real.

## Persistencia ligera

Las banderas `user_test_completed` y `user_booked_class`, así como el progreso del modal, se guardan en `localStorage` mediante `storageSafe`. Si el almacenamiento falla, se registra un aviso y la app continúa en modo volátil.

## Checklist de QA rápido

- **Navegación accesible**: los submenús del header utilizan `aria-expanded`, roles de menú y navegación con flechas.
- **Modal Clase Gratis**: focus trap, feedback `aria-live` y generación de `.ics` aunque el navegador bloquee descargas.
- **Internacionalización**: selector persistente, rutas espejo `/en|/ro|/ru/` y mensajes con degradación limpia a EN.
- **Persistencia y estados**: indicadores de carga global, restauración de scroll y flags de progreso almacenadas en el cliente.
