/* =====================================================================
   CONFIGURACIÓN — todo lo editable de la web está aquí.
   ===================================================================== */

/* ---- GOOGLE SHEET ----
   La hoja ya está publicada. Para leerla como CSV se usa la misma URL cambiando
   "pubhtml" por "pub?output=csv". Si publicas una pestaña concreta, añade &gid=NUMERO.
   CAMBIAR HOJA: Archivo > Compartir > Publicar en la web > CSV, copia la URL aquí. */
const SHEET_CSV_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vQDZW7ptxn3R71hTDCmYFd31BRgGXOlsEkEI1S97HURe1R1FMXM55m2vmCf9Tmkh7mX41IPbbJdKmUJ/pub?output=csv";

/* Nombres de las columnas de la hoja (no distingue mayúsculas/acentos).
   Se admiten varios alias por si el encabezado cambia. Las columnas que no
   estén aquí (seguimiento personal) se ignoran. */
const COLUMNS = {
  title:       ["title", "titulo", "nombre", "name"],
  description: ["description", "descripcion"],
  type:        ["type", "tipo"],
  technique:   ["tecnique", "technique", "tecnica"],
  project:     ["project", "proyecto"],
  image:       ["image", "imagen", "url", "link", "file", "archivo"],
  shop:        ["shop", "tienda", "store"],   // (futuro) enlace de compra
  status:      ["status", "estado"]            // opcional: "ready"/"publicado" para mostrar
};

/* Si la columna "status" existe y tiene valores, sólo se muestran las filas cuyo
   estado esté en esta lista. Déjala vacía [] para mostrar todas las filas con imagen. */
const PUBLISH_STATUSES = [];

/* ---- CÓMO SUBIR LAS IMÁGENES CUANDO ESTÉN LISTAS ----
   Opción A (recomendada, simple): copia los archivos a la carpeta /images de este
     repositorio y en la columna "image" de la hoja escribe sólo el nombre
     (ej: "dragon-01.webp"). IMAGE_BASE_URL se antepone automáticamente.
   Opción B (Google Drive, provisional): sube la imagen a Drive > Compartir > "Cualquiera con
     el enlace" y pega el enlace en la columna. Se convierte solo a una URL visible.
   Opción C (futuro): CDN con protección (Cloudinary, Bunny...). Pon aquí su URL base.
   Varias imágenes por proyecto: sepáralas con comas o saltos de línea en la misma celda,
   o repite el mismo Project en varias filas (se agrupan por Project/Title). */
const IMAGE_BASE_URL = "images/";

/* ---- VÍDEO / IMÁGENES DE LANDING ----
   CAMBIAR VÍDEO: pon aquí la ruta (ej "assets/landing.mp4") o una URL directa .mp4.
   Si lo dejas vacío y rellenas "slides", se muestra un pase de imágenes. */
const LANDING = {
  video: "",                // ej: "assets/landing.mp4"
  poster: "",               // imagen mientras carga el vídeo
  slides: [],               // ej: ["images/a.webp", "images/b.webp"]
  slideIntervalMs: 4000     // TRANSICIÓN del pase de imágenes
};

/* ---- CARRUSEL ---- */
const CAROUSEL = {
  maxImages: 6,             // el carrusel usa de 3 a 6 imágenes
  autoplayMs: 0             // 0 = sin autoavance; ej 5000 para avance automático
};

/* ---- REDES SOCIALES (arriba a la derecha) ----
   Cambia las URLs por las tuyas. Borra una línea para quitar la red.
   Sugerencias extra sin X/Facebook: Behance, Bluesky, YouTube, Threads, Ko-fi, Cara. */
const SOCIAL_LINKS = [
  { name: "Instagram",  url: "https://www.instagram.com/TU_USUARIO" },
  { name: "Pinterest",  url: "https://www.pinterest.com/TU_USUARIO" },
  { name: "TikTok",     url: "https://www.tiktok.com/@TU_USUARIO" },
  { name: "ArtStation", url: "https://www.artstation.com/TU_USUARIO" },
  { name: "Behance",    url: "https://www.behance.net/TU_USUARIO" },
  { name: "Bluesky",    url: "https://bsky.app/profile/TU_USUARIO" }
];

/* ---- FOOTER ---- */
const SITE = {
  email: "tu@email.com",                       // CAMBIAR EMAIL de contacto
  owner: "Mencia Vander Saigna",
  // Sugerencia de copyright (el año se actualiza solo):
  copyright: "© {year} {owner}. Todas las ilustraciones son propiedad de su autora. Prohibida su reproducción, copia o uso (incl. entrenamiento de IA) sin permiso."
};

/* ---- NOTICIAS (feed derecho) ----
   Edita esta lista a mano, o (futuro) usa otra pestaña de la hoja. */
const NEWS = [
  { date: "2026-10-01", text: "¡Nueva web de portfolio en construcción!" }
];

/* ---- TIENDA (futuro) ----
   Cuando la tienda esté lista: pon enabled:true y rellena la columna "shop" de la hoja
   con la URL del producto (Shopify, Etsy, Gumroad, Big Cartel...). Aparecerá un botón en
   el panel del item. Alternativa: baseUrl + id de producto en la columna. */
const SHOP = {
  enabled: false,
  buttonLabel: "Comprar print / original",
  baseUrl: ""   // opcional: si la celda no empieza por http se antepone esto
};
