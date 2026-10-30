import fs from 'node:fs';
import path from 'node:path';

const dist = path.resolve('dist');
const pub = path.resolve('public');

if (!fs.existsSync(dist)) {
  fs.mkdirSync(dist, { recursive: true });
}

// 1. Copiar todos los archivos estáticos de public a dist
fs.cpSync(pub, dist, { recursive: true });

// 2. Crear rutas compatibles con AWS Amplify Hosting
// Ruta /dashboard y /dashboard/
const dashboardDir = path.join(dist, 'dashboard');
if (!fs.existsSync(dashboardDir)) {
  fs.mkdirSync(dashboardDir, { recursive: true });
}
fs.copyFileSync(path.join(pub, 'index.html'), path.join(dashboardDir, 'index.html'));
fs.copyFileSync(path.join(pub, 'index.html'), path.join(dist, 'dashboard.html'));

// 3. Crear 404.html que redirige o sirve la app en Amplify para SPAs
fs.copyFileSync(path.join(pub, 'index.html'), path.join(dist, '404.html'));

// 4. Copiar supabase-schema.sql al directorio dist para acceso directo
const schemaSrc = path.resolve('supabase-schema.sql');
if (fs.existsSync(schemaSrc)) {
  fs.copyFileSync(schemaSrc, path.join(dist, 'supabase-schema.sql'));
}

console.log('✅ Archivos estáticos y rutas preparados exitosamente para AWS Amplify en dist/');

