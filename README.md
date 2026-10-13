# reels-kit

El **Instagram y TikTok completo de una marca**, hecho por tu IA (Claude Code, Codex, Cursor,
Gemini CLI…): plan, perfil, grilla de lanzamiento, historias destacadas, reels, los textos para
copiar y una carpeta con todo numerado en el orden en que se publica.

Los reels se escriben como una página HTML animada y [HyperFrames](https://github.com/heygen-com/hyperframes)
los convierte en MP4 vertical (1080×1920, 30 fps). Las piezas fijas (carruseles, posts, portadas,
historias) salen de otra página HTML con el mismo estilo, convertida a PNG.

No hace falta saber diseñar, editar video ni programar: le pasás a la IA tu web, tu repo o una
descripción de tu negocio, y ella arma todo con un método probado ([docs/GUIA.md](docs/GUIA.md)).

## Qué necesitás

- **Node 22 o más nuevo**: https://nodejs.org
- **FFmpeg**:
  - Windows: `winget install --id Gyan.FFmpeg -e`
  - Mac: `brew install ffmpeg`
  - Linux: `sudo apt install ffmpeg`
- Una IA que trabaje en tu compu: Claude Code, Codex CLI, Cursor, Gemini CLI, etc.

Chrome no hace falta instalarlo: HyperFrames baja su propia versión la primera vez.

## Arrancar

```bash
git clone https://github.com/br1giacometti/reels-kit.git
cd reels-kit
npm install
npm run doctor     # chequea que esté todo
```

### Todo el Instagram de una marca

Abrí tu IA en esta carpeta y pegale esto, cambiando lo que está entre `< >`:

> Leé AGENTS.md y docs/GUIA.md. Armame el Instagram y TikTok completo de **<mi marca>**.
> La info está en **<https://miweb.com, la ruta a mi repo o una descripción del negocio>**.
> El lema es **<el que ya usás>** y los colores **<si los tenés>**.

La IA crea `marcas/<marca>/`, te muestra el plan, diseña las piezas, hace los reels, revisa todo
mirando las imágenes y te deja `marcas/<marca>/subir/` así:

```
subir/
  LEEME.txt          los pasos para publicar, en orden
  TEXTOS.md          el texto de cada publicación, listo para copiar
  grilla.png         cómo va a quedar tu perfil
  1-feed/            las 9 publicaciones en carpetas numeradas (carruseles, reels con su tapa, posts)
  2-destacadas/      las portadas y las historias de cada destacada
  3-perfil/          foto de perfil y portada
```

### Un reel suelto

> Leé AGENTS.md. Haceme un reel de 20 segundos para **<mi producto>**.
> La info está en **<https://miweb.com o la ruta a mi repo>**.
> Quiero que se entienda **<la idea principal, ej: que se cobra en segundos>** y que termine
> con **<el llamado a la acción, ej: "Probalo gratis">**.

Otros pedidos que funcionan:

- "Hacé una variante de `<un reel que ya hiciste>` para <otro producto>"
- "Cambiá la escena 2 para que muestre <tal cosa>"
- "Dame tres ganchos distintos y renderizá el que más te guste"
- "Sumale a la grilla un carrusel con <tal tip>"

## Hacerlo a mano

```bash
# Reels
npm run new -- mi-marca-ig-01        # copia la plantilla a reels/mi-marca-ig-01
npm run preview -- mi-marca-ig-01    # lo ves en el navegador mientras editás index.html
npm run check -- mi-marca-ig-01      # valida errores y contraste
npm run render -- mi-marca-ig-01     # MP4 final

# Marca completa
npm run marca -- mi-marca            # copia plantilla-marca/ a marcas/mi-marca
npm run piezas -- mi-marca           # carruseles, posts, portadas e historias → PNG
npm run grilla -- mi-marca           # el perfil como va a quedar
npm run subir -- mi-marca            # la carpeta lista para publicar
```

Un reel de 20 s tarda entre 30 s y 1 min en renderizar en una PC normal y pesa unos 4 MB.
Las piezas fijas de una marca entera (unas 60 imágenes) salen en menos de un minuto.

## Lo tuyo queda en tu compu

`reels/` y `marcas/` están en el `.gitignore`: lo que hagas para tus marcas o tus clientes no se
sube si hacés push de un fork. Si querés versionarlos, usá un repo privado aparte.

## El método, en corto

El detalle y el porqué de cada decisión están en [docs/GUIA.md](docs/GUIA.md).

- **Perfil antes que nada:** nombre con la palabra que la gente busca, bio de 4 líneas, link con utm y botón de WhatsApp.
- **9 publicaciones en 3 días**, con los reels en las posiciones 2, 5 y 8 para que queden en la columna del medio.
- **Destacadas que responden** qué es, cómo funciona, cuánto sale y cómo te contacto. Se crean al revés.
- **Reels de 15–20 s:** gancho con un dolor, el producto resolviéndolo, la marca y el llamado a la acción.
- **3 publicaciones por semana**, y la métrica que importa son las ventas o consultas que llegan desde Instagram, no los seguidores.
- **Nada inventado y nada personal** del dueño si no quiere: la cuenta es la marca.

## Cómo funciona

`AGENTS.md` tiene todo el contexto que necesita la IA: el formato de HyperFrames, las reglas
para que el render salga bien, el flujo de una marca completa y criterios de diseño para el
celular. Los agentes como Codex o Cursor lo leen solos, y `CLAUDE.md` apunta a ese mismo archivo.
Por eso un prompt corto alcanza.

HyperFrames es de [HeyGen](https://github.com/heygen-com/hyperframes) (Apache 2.0). Este repo
es una plantilla y un flujo de trabajo arriba de eso.
