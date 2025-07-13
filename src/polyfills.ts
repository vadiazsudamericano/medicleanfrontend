// RUTA: src/polyfills.ts

import { Buffer } from 'buffer';

// Hacemos que la clase Buffer esté disponible globalmente en el navegador,
// imitando el comportamiento de Node.js.
(window as any).Buffer = Buffer;