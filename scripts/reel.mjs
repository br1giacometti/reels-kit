#!/usr/bin/env node
// Atajos para trabajar un reel: node scripts/reel.mjs <comando> <nombre> [opciones]
//   new <nombre> [--from <otro-reel>]  copia template/ (o un reel existente) a reels/<nombre>
//   check <nombre>                     lint + runtime + layout + contraste
//   draft <nombre>                     render rápido a reels/<nombre>/renders/draft.mp4
//   render <nombre>                    render final a reels/<nombre>/renders/<nombre>.mp4
//   sheet <nombre> [--frames 6]        tira de cuadros (sheet.jpg) del último render, para revisar sin ver el video
//   preview <nombre>                   abre el estudio en el navegador
import { spawnSync } from "node:child_process"
import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs"
import { join, resolve } from "node:path"

const root = resolve(import.meta.dirname, "..")
const [cmd, name, ...rest] = process.argv.slice(2)
const flag = (key, fallback) => {
  const i = rest.indexOf(`--${key}`)
  return i >= 0 ? rest[i + 1] : fallback
}

const fail = (msg) => {
  console.error(`✗ ${msg}`)
  process.exit(1)
}
const run = (bin, args) => {
  const r = spawnSync(bin, args, { cwd: root, stdio: "inherit", shell: process.platform === "win32" })
  if (r.status !== 0) process.exit(r.status ?? 1)
}
const hf = (args) => run("npx", ["--no-install", "hyperframes", ...args])
const capture = (bin, args) =>
  spawnSync(bin, args, { cwd: root, encoding: "utf8", shell: process.platform === "win32" }).stdout.trim()

if (!cmd || cmd === "help") {
  console.log(readFileSync(import.meta.filename, "utf8").split("\n").slice(1, 9).join("\n").replaceAll("// ", ""))
  process.exit(0)
}
if (!name) fail(`Falta el nombre del reel. Ej: npm run ${cmd} -- mi-reel`)
if (!/^[a-z0-9][a-z0-9-]*$/.test(name)) fail("Nombre inválido: usar minúsculas, números y guiones (ej. cafe-ig-01)")

const dir = join("reels", name)
const abs = join(root, dir)
const renders = join(dir, "renders")

if (cmd !== "new" && !existsSync(abs)) fail(`No existe ${dir}. Crealo con: npm run new -- ${name}`)

switch (cmd) {
  case "new": {
    if (existsSync(abs)) fail(`${dir} ya existe`)
    const from = flag("from") ? join(root, "reels", flag("from")) : join(root, "template")
    if (!existsSync(from)) fail(`No existe ${from}`)
    cpSync(from, abs, { recursive: true, filter: (src) => !src.includes("renders") })
    writeFileSync(join(abs, "meta.json"), JSON.stringify({ id: name, name }, null, 2) + "\n")
    console.log(`✓ Creado ${dir} (desde ${flag("from") ?? "template"}). Editá ${dir}/index.html y ${dir}/NOTAS.md`)
    break
  }
  case "check":
    hf(["check", dir])
    break
  case "draft":
    mkdirSync(join(root, renders), { recursive: true })
    hf(["render", dir, "-q", "draft", "-f", "30", "-o", join(renders, "draft.mp4"), "--quiet"])
    console.log(`✓ ${join(renders, "draft.mp4")}`)
    break
  case "render": {
    mkdirSync(join(root, renders), { recursive: true })
    hf(["render", dir, "-f", "30", "-o", join(renders, `${name}.mp4`), "--quiet"])
    const draft = join(root, renders, "draft.mp4")
    if (existsSync(draft)) rmSync(draft)
    console.log(`✓ ${join(renders, `${name}.mp4`)}`)
    break
  }
  case "sheet": {
    // Usa el render más reciente (final o draft) y saca N cuadros repartidos en una sola imagen.
    const candidates = [join(renders, `${name}.mp4`), join(renders, "draft.mp4")].filter((f) => existsSync(join(root, f)))
    if (!candidates.length) fail(`No hay render en ${renders}. Corré: npm run draft -- ${name}`)
    const video = candidates.sort((a, b) => statSync(join(root, b)).mtimeMs - statSync(join(root, a)).mtimeMs)[0]
    const n = Number(flag("frames", 6))
    const duration = Number(capture("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", video]))
    if (!duration) fail("No pude leer la duración (¿está instalado ffmpeg/ffprobe?)")
    const out = join(renders, "sheet.jpg")
    run("ffmpeg", ["-v", "error", "-y", "-i", video, "-vf", `fps=${n}/${duration},scale=300:-1,tile=${n}x1`, "-frames:v", "1", "-q:v", "4", out])
    console.log(`✓ ${out} (${n} cuadros de ${video})`)
    break
  }
  case "preview":
    hf(["preview", dir])
    break
  default:
    fail(`Comando desconocido: ${cmd}. Usá: new, check, draft, render, sheet, preview`)
}
