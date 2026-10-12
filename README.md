# Shanty Apartasuites

Sitio web estático de **Shanty Apartasuites**, apartamentos de corta y larga estadía en Riomar, Barranquilla (Colombia). Incluye apartaestudio de 1 habitación, apartamento de 2 habitaciones y dúplex de 3 habitaciones, con reservas directas por WhatsApp.

- **Sitio en producción:** https://shantyapartasuitesdemo.netlify.app/
- **Canónico:** sin `www` y sin extensión `.html` (URLs limpias)

## Stack

HTML5, CSS3 y JavaScript "vanilla" sin dependencias ni paso de compilación. No hay `package.json`, bundler ni framework: los archivos se sirven tal cual.

```
.
├── index.html                       Portada
├── apartasuites.html                Listado de alojamientos
├── apartamento-1-habitacion.html    Apartaestudio · 1 habitación
├── apartamento-2-habitaciones.html  Apartamento · 2 habitaciones
├── duplex-3-habitaciones.html       Dúplex · 3 habitaciones
├── servicios.html                   Servicios del edificio
├── comodidades.html                 Comodidades
├── contacto.html                    Contacto y formulario
├── 404.html                         Página de error
├── css/styles.css                   Todos los estilos
├── js/main.js                       Toda la interactividad
├── img/                             Imágenes optimizadas (webp/jpg)
├── robots.txt                       Directivas para buscadores
├── sitemap.xml                      Mapa del sitio
└── .htaccess                        Configuración Apache (producción)
```

## Páginas

| Página | Descripción |
| --- | --- |
| `index.html` | Portada con hero, collage, alojamientos, servicios, ubicación, reseñas y CTA |
| `apartasuites.html` | Listado de los tres alojamientos con formulario de reserva |
| `apartamento-1-habitacion.html` | Ficha, galería con lightbox y formulario del apartaestudio |
| `apartamento-2-habitaciones.html` | Ficha, galería con lightbox y formulario del apartamento de 2 habitaciones |
| `duplex-3-habitaciones.html` | Ficha, galería con lightbox y formulario del dúplex de 3 habitaciones |
| `servicios.html` | Servicios del edificio |
| `comodidades.html` | Comodidades de los apartamentos |
| `contacto.html` | Datos de contacto y formulario |
| `404.html` | Página de error personalizada |

## Funcionalidades (`js/main.js`)

- **Reservas por WhatsApp:** todos los formularios `.booking-form` construyen un mensaje estructurado y abren `wa.me`. Las fechas se formatean en español y la salida no puede ser anterior a la llegada (ni a hoy).
- **Lightbox:** las galerías `.gallery` abren un visor accesible con teclado (flechas, `Esc`), foco atrapado y contador de imágenes.
- **Menú móvil:** botón `.nav-toggle` con cierre vía `Esc`, clic fuera y al navegar.
- **Animaciones:** aparición al hacer scroll con `IntersectionObserver`, respetando `prefers-reduced-motion`.
- **Analítica:** Google Tag Manager (`GTM-KNBN2Z88`) con Consent Mode v2 (todo denegado por defecto hasta que el visitante acepta).

## Desarrollo local

No requiere instalación. Sirve la carpeta con cualquier servidor estático para que funcionen las URLs limpias:

```powershell
# Opción 1: extensión Live Server de VS Code (puerto configurado: 5501)
# Opción 2: servidor local de Python
python -m http.server 5501
```

Luego abre `http://localhost:5501/`.

## Despliegue

El sitio está pensado para hosting Apache. El archivo `.htaccess` controla:

- Redirección a **HTTPS** y al host canónico sin `www`.
- Redirecciones **301** desde las URLs heredadas de WordPress (`/accommodation/...`, `/home/`, `/reservas/`).
- **410 Gone** para funcionalidad eliminada (WooCommerce / MotoPress) y restos de WordPress.
- URLs limpias: `/apartamento-1-habitacion/` sirve `apartamento-1-habitacion.html` sin mostrar la extensión.
- Compresión (`mod_deflate`) y caché de navegador (`mod_expires`).
- Bloqueo de archivos sensibles (`.md`, `.json`, `.sql`, `.log`, etc.).

Para desplegar basta con subir el contenido del repositorio por FTP/SFTP o vía `git` a la raíz pública del dominio.

## SEO y metadatos

- `<title>`, meta description y Open Graph / Twitter Card por página.
- Datos estructurados JSON-LD `LodgingBusiness` en la portada (dirección, geo, tarifas, amenidades, reservas).
- Imagen social `img/og-image.jpg` (1200×630).
- `robots.txt` y `sitemap.xml` apuntando al dominio canónico.

