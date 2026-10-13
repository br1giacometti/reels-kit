#!/usr/bin/env node
// Todo lo que no es video, para una marca: node scripts/marca.mjs <comando> <marca> [filtro]
//   nueva <marca>            copia plantilla-marca/ a marcas/<marca> (plan, textos, piezas, subir.json)
//   piezas <marca> [filtro]  renderiza cada [data-out] de marcas/<marca>/piezas/index.html a piezas/out/<nombre>.png
//   grilla <marca>           arma marcas/<marca>/grilla.png: el perfil como se va a ver, según subir.json
//   subir <marca>            arma marcas/<marca>/subir/: todo en carpetas numeradas + LEEME.txt con los pasos
import { spawn, spawnSync } from "node:child_process"
import { copyFileSync, cpSync, existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs"
import { homedir, tmpdir } from "node:os"
import { join, resolve } from "node:path"
import { pathToFileURL } from "node:url"

const root = resolve(import.meta.dirname, "..")
const [cmd, name, filter = ""] = process.argv.slice(2)
const fail = (msg) => {
  console.error(`✗ ${msg}`)
  process.exit(1)
}

if (!cmd || cmd === "help") {
  console.log(readFileSync(import.meta.filename, "utf8").split("\n").slice(1, 6).join("\n").replaceAll("// ", ""))
  process.exit(0)
}
if (!name) fail(`Falta la marca. Ej: npm run ${cmd} -- mi-marca`)
if (!/^[a-z0-9][a-z0-9-]*$/.test(name)) fail("Nombre inválido: usar minúsculas, números y guiones (ej. panaderia-la-espiga)")

const dir = join(root, "marcas", name)
const out = join(dir, "piezas", "out")
if (cmd !== "nueva" && !existsSync(dir)) fail(`No existe marcas/${name}. Creala con: npm run marca -- ${name}`)

const readPlan = () => {
  const f = join(dir, "subir.json")
  if (!existsSync(f)) fail(`Falta marcas/${name}/subir.json`)
  return JSON.parse(readFileSync(f, "utf8"))
}
// Images of a piece: "p1" → p1-1.png, p1-2.png… in order; a full name ("tapa-reel01") → that one
const imagesOf = (prefix) => {
  if (existsSync(join(out, `${prefix}.png`))) return [join(out, `${prefix}.png`)]
  return readdirSync(out)
    .filter((f) => f.startsWith(`${prefix}-`) && /-\d+\.png$/.test(f))
    .sort((a, b) => Number(a.match(/-(\d+)\.png$/)[1]) - Number(b.match(/-(\d+)\.png$/)[1]))
    .map((f) => join(out, f))
}
// ffmpeg from $FFMPEG, the PATH, or where winget installs it (a terminal opened before the install has no PATH entry)
function findFfmpeg() {
  if (process.env.FFMPEG) return process.env.FFMPEG
  if (!spawnSync("ffmpeg", ["-version"]).error) return "ffmpeg"
  const winget = join(homedir(), "AppData", "Local", "Microsoft", "WinGet", "Packages")
  if (existsSync(winget)) {
    for (const pkg of readdirSync(winget).filter((d) => d.startsWith("Gyan.FFmpeg"))) {
      for (const build of readdirSync(join(winget, pkg))) {
        const exe = join(winget, pkg, build, "bin", "ffmpeg.exe")
        if (existsSync(exe)) return exe
      }
    }
  }
  fail("No encontré ffmpeg. Instalalo (ver README) o definí FFMPEG=/ruta/a/ffmpeg")
}
const ffmpeg = (args) => {
  // No shell: cmd.exe would read the "|" in filter graphs as pipes
  const r = spawnSync(findFfmpeg(), ["-v", "error", "-y", ...args], { stdio: "inherit" })
  if (r.status !== 0) fail("ffmpeg falló armando la imagen")
}

// Chrome: the one HyperFrames/Puppeteer already downloaded, or the system one, or $CHROME
function findChrome() {
  if (process.env.CHROME) return process.env.CHROME
  const names = ["chrome-headless-shell.exe", "chrome-headless-shell", "chrome.exe", "chrome", "Google Chrome for Testing"]
  const walk = (d, depth) => {
    if (depth > 6 || !existsSync(d)) return null
    for (const e of readdirSync(d, { withFileTypes: true })) {
      const p = join(d, e.name)
      if (e.isFile() && names.includes(e.name)) return p
      if (e.isDirectory()) {
        const found = walk(p, depth + 1)
        if (found) return found
      }
    }
    return null
  }
  for (const d of [join(homedir(), ".cache", "hyperframes", "chrome"), join(homedir(), ".cache", "puppeteer")]) {
    const found = walk(d, 0)
    if (found) return found
  }
  const system = [
    "C:/Program Files/Google/Chrome/Application/chrome.exe",
    "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/usr/bin/google-chrome",
    "/usr/bin/chromium",
    "/usr/bin/chromium-browser",
  ]
  return system.find(existsSync) ?? fail("No encontré Chrome. Corré npm run doctor o definí CHROME=/ruta/al/chrome")
}

async function renderPieces() {
  const html = join(dir, "piezas", "index.html")
  if (!existsSync(html)) fail(`Falta marcas/${name}/piezas/index.html`)
  mkdirSync(out, { recursive: true })
  const port = 9400 + Math.floor(Math.random() * 400)
  const chrome = spawn(findChrome(), ["--headless=new", "--disable-gpu", "--hide-scrollbars", `--remote-debugging-port=${port}`,
    `--user-data-dir=${mkdtempSync(join(tmpdir(), "piezas-"))}`, "about:blank"], { stdio: "ignore" })
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
  let target
  for (let i = 0; i < 75 && !target; i++) {
    try { target = (await (await fetch(`http://127.0.0.1:${port}/json`)).json()).find((t) => t.type === "page") } catch {}
    if (!target) await sleep(200)
  }
  if (!target) { chrome.kill(); fail("Chrome no arrancó") }
  const ws = new WebSocket(target.webSocketDebuggerUrl)
  await new Promise((r) => ws.addEventListener("open", r, { once: true }))
  let id = 0
  const pending = new Map()
  ws.addEventListener("message", (e) => { const m = JSON.parse(e.data); if (m.id && pending.has(m.id)) { pending.get(m.id)(m.result ?? { error: m.error }); pending.delete(m.id) } })
  const send = (method, params = {}) => new Promise((r) => { const i = ++id; pending.set(i, r); ws.send(JSON.stringify({ id: i, method, params })) })
  const evaluate = async (expression) => (await send("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true })).result

  await send("Page.enable")
  await send("Emulation.setDeviceMetricsOverride", { width: 1200, height: 2000, deviceScaleFactor: 1, mobile: false })
  await send("Page.navigate", { url: pathToFileURL(html).href })
  await sleep(1500)
  await evaluate("document.fonts.ready.then(() => true)")
  await sleep(500)
  const res = await evaluate(`[...document.querySelectorAll("[data-out]")].map((el) => {
    const r = el.getBoundingClientRect();
    return { name: el.dataset.out, x: r.left + scrollX, y: r.top + scrollY, w: r.width, h: r.height };
  })`)
  const boxes = res?.value ?? []
  if (!boxes.length) { chrome.kill(); fail("No hay piezas: revisá que index.html no tenga errores de JavaScript (abrilo en el navegador)") }
  let n = 0
  for (const b of boxes) {
    if (filter && !b.name.includes(filter)) continue
    const shot = await send("Page.captureScreenshot", { format: "png", captureBeyondViewport: true, clip: { x: b.x, y: b.y, width: b.w, height: b.h, scale: 1 } })
    writeFileSync(join(out, `${b.name}.png`), Buffer.from(shot.data, "base64"))
    n++
  }
  ws.close()
  chrome.kill()
  console.log(`✓ ${n} imágenes en marcas/${name}/piezas/out`)
}

function grid() {
  const plan = readPlan()
  // The profile shows the newest first: reverse the posting order
  const covers = [...plan.feed].reverse().map((item) => {
    const img = item.tipo === "reel" ? imagesOf(item.tapa)[0] : imagesOf(item.piezas)[0]
    if (!img) fail(`No encuentro la tapa de "${item.nombre}". Corré: npm run piezas -- ${name}`)
    return { img, tall: item.tipo === "reel" }
  })
  const cols = 3
  const inputs = covers.flatMap((c) => ["-i", c.img])
  // Instagram's profile grid crops everything to 3:4
  const filters = covers.map((c, i) => `[${i}]${c.tall ? "crop=1080:1440" : "crop=1012:1350"},scale=300:400[v${i}]`)
  const layout = covers.map((_, i) => `${(i % cols) * 304}_${Math.floor(i / cols) * 404}`).join("|")
  const labels = covers.map((_, i) => `[v${i}]`).join("")
  const file = join(dir, "grilla.png")
  if (covers.length === 1) ffmpeg([...inputs, "-filter_complex", filters[0].replace(`[v0]`, ""), file])
  else ffmpeg([...inputs, "-filter_complex", `${filters.join(";")};${labels}xstack=inputs=${covers.length}:layout=${layout}:fill=white`, file])
  console.log(`✓ marcas/${name}/grilla.png (${covers.length} publicaciones, la más nueva arriba a la izquierda)`)
}

function pack() {
  const plan = readPlan()
  const dest = join(dir, "subir")
  rmSync(dest, { recursive: true, force: true })
  const put = (src, folder, file) => {
    if (!existsSync(src)) return console.warn(`  ! falta ${src}`)
    mkdirSync(join(dest, folder), { recursive: true })
    copyFileSync(src, join(dest, folder, file))
  }
  const steps = []
  // Captions: "## N · …" sections of TEXTOS.md, first code block of each → texto.txt in post N's folder
  const captions = {}
  const textos = join(dir, "TEXTOS.md")
  if (existsSync(textos)) {
    for (const part of readFileSync(textos, "utf8").split(/^## /m).slice(1)) {
      const n = part.match(/^(\d+)/)?.[1]
      const body = part.match(/```[a-z]*\r?\n([\s\S]*?)```/)?.[1]
      if (n && body) captions[n] = body.trim() + "\n"
    }
  }

  plan.feed.forEach((item, i) => {
    const folder = join("1-feed", `${i + 1} ${item.tipo} - ${item.nombre}`)
    const caption = captions[String(item.texto ?? i + 1)]
    if (caption) {
      mkdirSync(join(dest, folder), { recursive: true })
      writeFileSync(join(dest, folder, "texto.txt"), caption)
    } else console.warn(`  ! sin texto para "${item.nombre}" en TEXTOS.md`)
    if (item.tipo === "reel") {
      put(join(root, "reels", item.reel, "renders", `${item.reel}.mp4`), folder, "reel.mp4")
      put(imagesOf(item.tapa)[0] ?? "", folder, "tapa.png")
    } else {
      imagesOf(item.piezas).forEach((img, j) => put(img, folder, `${String(j + 1).padStart(2, "0")}.png`))
    }
    steps.push(`  ${i + 1}. ${item.tipo} · ${item.nombre}`)
  })

  const highlights = plan.destacadas ?? []
  highlights.forEach((h, i) => {
    const folder = join("2-destacadas", `${i + 1} ${h.nombre}`)
    put(imagesOf(h.portada)[0] ?? "", "2-destacadas", `portada ${i + 1} - ${h.nombre}.png`)
    imagesOf(h.historias).forEach((img, j) => put(img, folder, `historia ${j + 1}.png`))
  })

  for (const p of plan.perfil ?? []) {
    const src = p.includes("/") || p.endsWith(".png") ? join(dir, p) : imagesOf(p)[0] ?? ""
    put(src, "3-perfil", `${p.split("/").pop().replace(/\.png$/, "")}.png`)
  }
  for (const f of ["PLAN.md", "TEXTOS.md", "grilla.png"]) if (existsSync(join(dir, f))) copyFileSync(join(dir, f), join(dest, f))

  const links = highlights.filter((h) => h.link).map((h) => `  - ${h.nombre}: ${h.link}`)
  writeFileSync(join(dest, "LEEME.txt"), [
    `Cómo subir todo (${name})`,
    "",
    "PERFIL (antes de publicar nada): cuenta de empresa, foto (3-perfil), nombre, bio, link y botón de contacto.",
    "  Todo eso está en PLAN.md, sección 2. Mirá grilla.png para ver cómo va a quedar el perfil.",
    "",
    "FEED: subir en este orden (la primera queda abajo de todo en el perfil):",
    ...steps,
    "  En cada carpeta está texto.txt: es lo que va en la publicación, listo para copiar y pegar.",
    "  Carruseles: elegir las imágenes en orden (01, 02…), recorte 4:5.",
    "  Reels: subir reel.mp4, Editar portada → Agregar desde la galería → tapa.png, centrarla en la vista del perfil.",
    "  Sumar audio desde la app, bajito. Fijar las 3 publicaciones que indique el PLAN.",
    "",
    "DESTACADAS: subir las historias de cada carpeta como historias, en orden.",
    "  La última destacada que se crea queda PRIMERA. Crearlas al revés:",
    ...[...highlights].reverse().map((h, i) => `  ${i + 1}. ${h.nombre}`),
    "  En cada una: Editar portada → la imagen 'portada N' desde la galería.",
    ...(links.length ? ["  Sticker de link (tapar el recuadro que dice [ sticker de link ]):", ...links] : []),
    "",
    "TIKTOK: subir el reel.mp4 original (nunca el descargado de Instagram, por la marca de agua).",
    "",
  ].join("\n"))
  console.log(`✓ marcas/${name}/subir/ lista (con LEEME.txt)`)
}

switch (cmd) {
  case "nueva": {
    if (existsSync(dir)) fail(`marcas/${name} ya existe`)
    cpSync(join(root, "plantilla-marca"), dir, { recursive: true, filter: (src) => !src.includes(`${join("piezas", "out")}`) })
    console.log(`✓ Creada marcas/${name}. Seguí el flujo de AGENTS.md: PLAN.md → piezas/index.html → npm run piezas -- ${name}`)
    break
  }
  case "piezas":
    await renderPieces()
    break
  case "grilla":
    grid()
    break
  case "subir":
    pack()
    break
  default:
    fail(`Comando desconocido: ${cmd}. Usá: nueva, piezas, grilla, subir`)
}
