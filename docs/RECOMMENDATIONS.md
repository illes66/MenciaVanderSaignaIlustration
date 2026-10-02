# Recomendaciones

## Almacenamiento de imágenes y protección
Ninguna web puede impedir al 100% que se copie una imagen (siempre hay captura de pantalla), pero se puede disuadir:
- **Ya incluido**: capa transparente sobre la imagen, bloqueo de clic derecho y arrastrar.
- **Sirve versiones web**: WebP/AVIF de ~1600px de lado largo, calidad 75-80. Nunca el original en alta resolución.
- **Marca de agua** discreta (o sólo en la versión web), y metadatos de copyright (IPTC/EXIF).
- **Hosting recomendado** (de simple a avanzado):
  1. *Carpeta `/images` del repo + GitHub Pages / Netlify / Cloudflare Pages*: gratis, rápido. Los repos públicos exponen los archivos; con calidad web es aceptable.
  2. *Cloudinary* (plan gratuito): redimensiona, añade marca de agua y sirve por CDN automáticamente con URLs transformadas. Mi recomendación para empezar.
  3. *Bunny.net / Cloudflare R2*: barato, con URLs firmadas con caducidad (hotlink protection).
- **Google Drive**: sirve para el arranque, pero tiene límites de cuota y enlaces inestables; no es recomendable a largo plazo.
- Los originales en alta resolución guárdalos aparte (Drive/disco externo/backup) y nunca en la web.
- Añade a `robots.txt`/cabeceras `noai` si quieres pedir que no se use para entrenar IA (no es garantía).

## Pipeline sugerido (hoja de cálculo)
Columnas de seguimiento: `Status` (idea → boceto → línea → color → listo → publicado), `Fecha`, `Print listo`, `Original disponible`.
Flujo: terminar → exportar WebP → subir a `/images` o Cloudinary → escribir nombre en `Image` → Status = publicado.
Consejo: usa `PUBLISH_STATUSES` en `js/config.js` para que sólo se muestren las filas "publicado".

## Venta online (para más adelante)
Plataformas:
- **Shopify / Big Cartel / Square Online**: tienda propia, más control y marca. Shopify ~ suscripción mensual.
- **Etsy**: tráfico propio, comisiones por listado/venta; ideal para empezar con prints.
- **Gumroad / Ko-fi Shop / Itch.io**: productos digitales y comisiones, muy simple.
- **Print on demand (Printful, Printify, Gelato, TPOP)**: sin stock; se imprime y envía bajo pedido. Calidad: pide una muestra.
- **Originales**: Etsy, tienda propia o Artmajeur/Saatchi Art.

A tener en cuenta: impuestos (autónoma/IVA, IVA OSS en la UE), envíos y embalaje, políticas de devolución, ediciones limitadas y numeradas con certificado de autenticidad, licencias (uso personal vs comercial), calidad de impresión (papel, 300 dpi, perfiles de color), RGPD/aviso legal/cookies en la web, y pasarelas de pago (Stripe/PayPal).

Cómo conectarlo: en `js/config.js` pon `SHOP.enabled = true` y rellena la columna `Shop` de la hoja con la URL del producto. Aparecerá un botón en el panel derecho de esa ilustración.

## Copyright (sugerencia)
"© {año} Mencia Vander Saigna. Todas las ilustraciones son propiedad de su autora. Prohibida su reproducción, copia o uso (incl. entrenamiento de IA) sin permiso."
