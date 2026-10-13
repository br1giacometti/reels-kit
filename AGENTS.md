# AGENTS.md — instrucciones para la IA

Este repo hace **reels / TikToks / shorts verticales** a partir de HTML, con
[HyperFrames](https://github.com/heygen-com/hyperframes). Vos (la IA) escribís un `index.html`
con escenas animadas con GSAP, y el CLI lo renderiza a MP4 cuadro por cuadro.

Todo lo que necesitás está en este archivo. **No instales las skills de HyperFrames ni leas
su documentación online**: gastan mucho contexto y para un reel de 15–30 s no hacen falta.
Si te trabás con algo puntual: `npx hyperframes docs <tema>` (temas: `data-attributes`,
`gsap`, `compositions`, `rendering`, `troubleshooting`).

Hablale al usuario en su idioma. Los textos del video van en el idioma de la marca.

## Dos pedidos posibles

- **"Haceme un reel"** → seguí el **Flujo** de abajo (solo video).
- **"Armame el Instagram / TikTok de <marca>"** → seguí **Marca completa**: plan, perfil, grilla de 9,
  destacadas, reels, textos y una carpeta lista para subir. El método y el porqué están en `docs/GUIA.md`:
  leela entera antes de empezar (es corta).

## Marca completa

Todo lo de una marca vive en `marcas/<marca>/` (está en `.gitignore`: el repo es público).

1. `npm run marca -- <marca>` copia `plantilla-marca/`: `PLAN.md`, `TEXTOS.md`, `subir.json` y
   `piezas/index.html` (un ejemplo con una panadería ficticia: reemplazalo entero).
2. **Entender la marca** (paso 0 de la guía) y completar `PLAN.md`: voz, 4 temas, perfil y bio, las 9 de
   la grilla, las destacadas, los reels y el calendario. Si el usuario está, mostrale el plan antes de diseñar.
3. **Piezas fijas** en `marcas/<marca>/piezas/index.html`: cambiá `MARCA` y las variables de `:root`
   (colores y fuentes de la marca), y armá las piezas con los bloques documentados arriba del archivo
   (`carrusel`, `post`, `tapaReel`, `destacada`, `historias`, `vs`, perfil y portada).
   `npm run piezas -- <marca>` → `piezas/out/*.png`. **Mirá las imágenes** (o tiras armadas con ffmpeg)
   antes de seguir: títulos cortados, una palabra sola en un renglón, contraste.
4. **Reels:** uno por cada `"tipo": "reel"` de `subir.json`, con el flujo de abajo, nombrados
   `<marca>-ig-01`, `-02`… El cierre usa el lema de la marca. Partí del primero con `--from`.
5. **`subir.json`** en el orden de publicación (reels en las posiciones 2, 5 y 8 de las primeras 9).
   `npm run grilla -- <marca>` → `grilla.png`: el perfil como va a quedar. Revisalo.
6. **`TEXTOS.md`**: un texto por publicación, con el molde de la guía.
7. `npm run subir -- <marca>` → `marcas/<marca>/subir/` con todo numerado y un `LEEME.txt` con los pasos.

Reglas de contenido (detalle en la guía): nada inventado; nada personal del dueño si no lo ofrece; el lema
de la marca no se cambia; datos de ejemplo verosímiles en las pantallas simuladas.

## Flujo

1. **Entender el producto.** El usuario te da una ruta a un repo, una URL o una descripción.
   Sacá de ahí: qué hace, para quién, 3–5 beneficios, colores, fuentes, logo/nombre, dominio y
   el texto de la landing (títulos, taglines, CTA). Leé poco: README/CLAUDE.md, la config del
   sitio, el CSS global (variables de color) y la landing. **Usá los textos que la marca ya
   usa**; no inventes datos, precios, plazos ni afirmaciones legales.
2. **Crear el reel:** `npm run new -- <marca>-ig-01` (copia `template/`). Para partir de un
   reel que ya existe en `reels/`: `npm run new -- <nombre> --from <otro-reel>`.
3. **Guion** en `reels/<nombre>/NOTAS.md`: tabla de escenas con tiempos. Estructura que
   funciona (15–20 s): **gancho** con el dolor (3 s) → **demo** del producto haciendo su
   magia, idealmente una UI simplificada con números que cuentan (4–5 s) → **segunda demo o
   diferencial** (4 s) → **qué incluye** (3 s) → **marca + CTA + dominio** (4 s).
   Si el usuario está, mostrale el guion antes de animar.
4. **Escribir `reels/<nombre>/index.html`.** Cambiá las variables de `:root` por los colores
   de la marca y reemplazá las escenas. Para piezas típicas (UI simulada con "taps", ruta
   animada, opción que se marca) mirá **Recetas** más abajo.
5. `npm run check -- <nombre>`: tiene que dar **0 errores** y **contraste en verde**. Las
   advertencias `nested_structure_needs_subcomposition` y `timeline_track_too_dense` se ignoran.
6. `npm run draft -- <nombre>` → `npm run sheet -- <nombre>` → **mirá
   `reels/<nombre>/renders/sheet.jpg`** (si podés leer imágenes). Es una tira de 6 cuadros:
   alcanza para ver si algo se superpone, se corta o queda vacío, sin mirar el video.
   Para revisar un momento exacto:
   `ffmpeg -ss 6.8 -i reels/<n>/renders/draft.mp4 -frames:v 1 -vf scale=360:-1 frame.jpg`.
7. Corregí, y al final `npm run render -- <nombre>` → `reels/<nombre>/renders/<nombre>.mp4`.
8. Completá `NOTAS.md` (marca, guion final, cosas a confirmar).

## Formato de una composición

```html
<div id="root" data-composition-id="main" data-start="0" data-duration="20"
     data-width="1080" data-height="1920">
  <section id="s1" class="scene clip" data-start="0" data-duration="3.4" data-track-index="1">…</section>
  <section id="s2" class="scene clip" data-start="3.4" data-duration="5" data-track-index="1">…</section>
</div>
<script>
  window.__timelines = window.__timelines || {};
  const tl = gsap.timeline({ paused: true });
  tl.from("#s1 .big", { opacity: 0, y: 60, duration: 0.8, ease: "expo.out" }, 0.2); // tiempo absoluto
  window.__timelines["main"] = tl;
  tl.seek(0);
</script>
```

- Cada escena: `class="clip"` + `data-start` + `data-duration` en segundos. Fuera de ese rango
  no se ve. El `data-duration` del root = fin de la última escena.
- **Un solo** timeline GSAP pausado, con **tiempos absolutos**, registrado en
  `window.__timelines["main"]`. El renderer lo posiciona en cada cuadro.
- Salida de escena: `tl.to("#sN", { opacity: 0, y: -60, duration: 0.4 }, finDeEscena - 0.4)`.
- La plantilla trae helpers: `enter`, `leave`, `countTo` (número que cuenta) y `money`.
- Fuentes de Google por `<link>`: funcionan (el compilador las baja y las cachea).
- Imágenes/logos: ponelos en `reels/<nombre>/assets/` y referencialos con ruta relativa.
- Audio (opcional): `<audio src="assets/x.mp3" data-start="0" data-duration="20" data-volume="0.6">`.
  Solo música con licencia. Normalmente el usuario agrega el audio en la app al publicar.

## Reglas (si las rompés, el render sale mal)

- **Determinístico:** nada de `Date.now()`, `Math.random()`, `fetch` ni timers. El mismo
  cuadro tiene que dar siempre la misma imagen.
- **No pongas `transform` en el CSS de un elemento que GSAP anima** (GSAP lo pisa). Poné el
  estado inicial en GSAP: `tl.fromTo(el, { rotation: -12, scaleX: 0 }, { rotation: -12, scaleX: 1 })`.
  Para centrar, usá márgenes negativos o flex, no `translate(-50%)`.
- **No midas el DOM** (`getBoundingClientRect`, `getTotalLength`, `getComputedStyle`) dentro
  de callbacks como `onUpdate`. Si necesitás geometría, medí una vez al armar el timeline y
  guardá los valores (ver la receta de la ruta SVG). Mejor todavía: posicioná con
  CSS relativo al contenedor (ej. un círculo de "tap" dentro de cada botón).
- Los contadores animan un objeto `{ v }` y escriben el texto en `onUpdate`: eso sí está bien.
- Formateá números a mano (`money()`), no con `toLocaleString`.
- **Nada de `tl.call()` para cambiar texto:** el renderer posiciona el timeline con `seek` y los callbacks
  no se disparan. Para un número que se tipea o cambia por pasos, usá un tween con `onUpdate` sobre un índice.

## Diseño para el teléfono

- Canvas 1080×1920. **Zona segura:** nada importante arriba de y=260 ni abajo de y=1600 (ahí
  van la UI de Instagram/TikTok y el texto del post), y 80 px a los costados. La clase
  `.scene` de la plantilla ya tiene ese padding.
- Texto grande: títulos 84–104 px, cuerpo ≥ 32 px. Una idea por escena. Máximo ~8 palabras de
  título.
- Contraste: el `check` exige 4.5:1 en texto normal y 3:1 en títulos. Los verdes/amarillos de
  marca sobre fondo claro suelen no llegar: oscurecé un tono solo para texto.
- Movimiento: entradas con `expo.out` (0.5–0.8 s), salidas cortas con `power2.in` (0.4 s),
  `stagger` 0.1–0.15 s para listas. Algo tiene que moverse siempre; nada de escenas quietas
  más de 1.5 s.
- Simulá la UI del producto en HTML/CSS (más nítido que una captura y se puede animar).
  Usá datos de ejemplo verosímiles, nunca datos reales de clientes.

## Recetas

**Tap en un botón de la UI simulada** (un círculo que se expande dentro del elemento):

```html
<div class="prod" style="position: relative"><div class="tap"></div>Café <span>$ 1.500</span></div>
<style>
  .tap { position: absolute; left: 50%; top: 50%; width: 90px; height: 90px; margin: -45px 0 0 -45px;
         border-radius: 50%; background: rgba(255,255,255,.35); border: 3px solid rgba(255,255,255,.8); opacity: 0; }
</style>
<script>
  tl.set(".prod .tap", { scale: 0.4, opacity: 1 }, 4.0);
  tl.to(".prod .tap", { scale: 1.4, opacity: 0, duration: 0.45, ease: "power2.out" }, 4.0);
  tl.to(".prod", { scale: 0.96, duration: 0.12, yoyo: true, repeat: 1 }, 4.0);
</script>
```

**Botón que cambia de texto** ("Cobrar" → "✓ Listo"): dos capas superpuestas; primero
`opacity: 0` al texto viejo y después `fromTo` del nuevo. Si se cruzan, se leen los dos.

**Ruta animada A → B** (línea que se dibuja y un punto que viaja). El contenedor mide lo mismo
que el `viewBox`, así las coordenadas del SVG sirven como píxeles:

```html
<div class="route" style="position: relative; width: 900px; height: 700px">
  <svg viewBox="0 0 900 700" style="position: absolute; inset: 0; overflow: visible">
    <path id="route-line" d="M740 130 C 520 20, 80 220, 160 570" pathLength="1" fill="none"
          stroke="var(--accent)" stroke-width="8" stroke-dasharray="1 1" stroke-dashoffset="1" />
  </svg>
  <div id="vehicle" style="position: absolute; left: 0; top: 0; width: 44px; height: 44px;
       margin: -22px 0 0 -22px; border-radius: 50%; background: var(--accent)"></div>
</div>
<script>
  const path = document.querySelector("#route-line");
  const vehicle = document.querySelector("#vehicle");
  const len = path.getTotalLength(); // se mide UNA vez, al armar el timeline
  const pts = Array.from({ length: 201 }, (_, i) => path.getPointAtLength((i / 200) * len));
  const trip = { t: 0 };
  const place = () => {
    const p = pts[Math.round(trip.t * 200)];
    vehicle.style.transform = `translate(${p.x}px, ${p.y}px)`;
    path.style.strokeDashoffset = 1 - trip.t;
  };
  tl.to(trip, { t: 1, duration: 2.4, ease: "power1.inOut", onUpdate: place, onStart: place }, 4.2);
</script>
```

**Opción de formulario que se selecciona** (radio con punto interno): el punto es un
`::after` con `transform: scale(var(--on, 0))` y GSAP anima la variable:
`tl.fromTo("#opt1 .radio", { "--on": 0 }, { "--on": 1, duration: 0.3, ease: "back.out(3)" }, t)`.

**Tachar algo** (ej. un cuaderno con anotaciones): una barra con `transform-origin: left` y
`tl.fromTo(".strike", { rotation: -12, scaleX: 0 }, { rotation: -12, scaleX: 1, duration: 0.35 }, t)`.

## Comandos

```bash
npm run new -- <nombre> [--from <reel>]   # crear
npm run check -- <nombre>                 # validar (siempre después de editar)
npm run draft -- <nombre>                 # render rápido (~30–60 s)
npm run sheet -- <nombre>                 # tira de 6 cuadros del último render
npm run render -- <nombre>                # render final
npm run preview -- <nombre>               # estudio en el navegador (lo usa la persona, no vos)
npm run doctor                            # verificar dependencias

npm run marca -- <marca>                  # crear marcas/<marca> desde plantilla-marca/
npm run piezas -- <marca> [filtro]        # piezas fijas → marcas/<marca>/piezas/out/*.png
npm run grilla -- <marca>                 # grilla.png: el perfil como va a quedar
npm run subir -- <marca>                  # marcas/<marca>/subir/: todo numerado + LEEME.txt
```

## Estructura

```
AGENTS.md            este archivo (Codex, Cursor, Gemini, etc. lo leen solos)
CLAUDE.md            apunta acá (para Claude Code)
template/            punto de partida de cada reel
reels/<nombre>/      un reel: index.html, NOTAS.md, assets/, renders/ (todo reels/ está en .gitignore)
plantilla-marca/     punto de partida de una marca: PLAN.md, TEXTOS.md, subir.json, piezas/index.html
marcas/<marca>/      una marca (en .gitignore): plan, textos, piezas, grilla.png, subir/
docs/GUIA.md         el método completo para Instagram y TikTok
scripts/reel.mjs     comandos de video
scripts/marca.mjs    comandos de marca (piezas, grilla, subir)
```
