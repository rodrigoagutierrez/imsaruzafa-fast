# IMSA Ruzafa — Web rápida

Clon estático ultrarrápido de [imsaruzafa.com](https://imsaruzafa.com/): centro de fisioterapia y ejercicio terapéutico en Ruzafa, Valencia.

- **Stack:** HTML + CSS + JS vanilla, sin dependencias. Desplegable en cualquier hosting estático (Cloudflare Pages, Netlify, GitHub Pages).
- **Tipografías:** Abhaya Libre (titulares) + Montserrat (UI) + Open Sans (cuerpo), solo los pesos usados, `display=swap`.
- **Imágenes:** WebP optimizadas en `assets/img/`.
- **Páginas:** inicio, servicios, nuestro equipo, contacto + 4 legales.

## Ver en local

```bash
python3 -m http.server 8901 --directory .
# http://localhost:8901/index.html
```

## Desplegar

Sube la carpeta a Cloudflare Pages o activa GitHub Pages (rama `main`, carpeta `/`).
