# reels-kit

Reels, TikToks y Shorts para tu producto, **hechos por tu IA** (Claude Code, Codex, Cursor,
Gemini CLI…). La IA escribe el video como una página HTML animada y
[HyperFrames](https://github.com/heygen-com/hyperframes) lo convierte en un MP4 vertical
(1080×1920, 30 fps), listo para subir.

No hace falta saber editar video ni escribir código: le pasás a la IA tu web o tu repo y ella
arma el guion, el diseño y el render.

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

Abrí tu IA en esta carpeta y pegale esto, cambiando lo que está entre `< >`:

> Leé AGENTS.md. Haceme un reel de 20 segundos para **<mi producto>**.
> La info está en **<https://miweb.com o la ruta a mi repo>**.
> Quiero que se entienda **<la idea principal, ej: que se cobra en segundos>** y que termine
> con **<el llamado a la acción, ej: "Probalo gratis">**.

La IA crea `reels/<nombre>/`, te propone un guion, anima, revisa los cuadros y te deja el
video en `reels/<nombre>/renders/<nombre>.mp4`.

Otros pedidos que funcionan:

- "Hacé una variante de `<un reel que ya hiciste>` para <otro producto>"
- "Cambiá la escena 2 para que muestre <tal cosa>"
- "Hacelo en 1:1 para el feed" (cuadrado)
- "Dame tres ganchos distintos y renderizá el que más te guste"

## Hacerlo a mano

```bash
npm run new -- mi-marca-ig-01        # copia la plantilla a reels/mi-marca-ig-01
npm run preview -- mi-marca-ig-01    # lo ves en el navegador mientras editás index.html
npm run check -- mi-marca-ig-01      # valida errores y contraste
npm run render -- mi-marca-ig-01     # MP4 final
```

Un reel de 20 s tarda entre 30 s y 1 min en renderizar en una PC normal y pesa unos 4 MB.

## Tus reels quedan en tu compu

`reels/` está en el `.gitignore`: lo que hagas para tus marcas o tus clientes no se sube si
hacés push de un fork. Si querés versionarlos, usá un repo privado aparte o sacá esa línea.

## Consejos

- **Música:** agregala en Instagram/TikTok al publicar (audio en tendencia, sin problemas de
  derechos). Si la querés dentro del MP4, que sea con licencia.
- **Gancho:** los primeros 2 segundos deciden todo. Empezá con una pregunta o un dolor concreto.
- **Datos:** que la IA use textos y números de ejemplo, nunca datos reales de clientes.

## Cómo funciona

`AGENTS.md` tiene todo el contexto que necesita la IA: el formato de HyperFrames, las reglas
para que el render salga bien y criterios de diseño para el celular. Los agentes como Codex o
Cursor lo leen solos, y `CLAUDE.md` apunta a ese mismo archivo. Por eso un prompt corto alcanza.

HyperFrames es de [HeyGen](https://github.com/heygen-com/hyperframes) (Apache 2.0). Este repo
es solo una plantilla y un flujo de trabajo arriba de eso.
