# Guía: el Instagram (y TikTok) completo de una marca

Este es el método que usa el kit. Sirve para un software, una panadería o una cancha de fútbol:
cambian los textos y los colores, no los pasos. La IA lo sigue con `AGENTS.md`; esta guía explica el porqué.

**Resultado:** una cuenta que se ve terminada desde el día uno. Perfil armado, 9 publicaciones en la
grilla, 4 a 6 historias destacadas, 3 reels, los textos para copiar, un calendario de 4 semanas y una
carpeta `subir/` con todo numerado en el orden en que se publica.

---

## 0. Antes de diseñar: entender la marca

De la web, el repo o una charla con el dueño sacamos:

- **Qué vende y a quién**, en una frase cada cosa.
- **El dolor del cliente**: qué hace hoy sin la marca (anota en un cuaderno, compra pan de supermercado…).
- **El lema que la marca ya usa.** Es de la marca: no se cambia por SEO ni porque a la IA se le ocurra otro mejor.
- **Colores, fuentes y logo.** Si no hay, se elige una paleta sobria: fondo oscuro, un solo acento.
- **Datos reales**: precios, horarios, funciones, zonas. Lo que no está confirmado no se publica.

**Reglas que no se negocian:**

1. **Nada inventado.** Ni precios, ni clientes, ni "+500 negocios confían en nosotros", ni años de experiencia que nadie confirmó.
2. **Nada personal del dueño si no lo ofrece.** Ni cara, ni fotos, ni dónde vive o trabaja. La cuenta es la marca. Una frase como "+10 años de experiencia" sin una persona que la respalde suena a marketing que nadie puede comprobar: mejor no usarla.
3. **Datos de ejemplo verosímiles** en las pantallas simuladas (una Coca a $ 1.800), nunca datos de clientes reales.

## 1. A quién le hablamos y cómo (el PLAN)

`PLAN.md` define, antes de hacer una sola pieza:

- **La voz.** Cómo hablaría el dueño con un cliente en el mostrador. En Argentina, voseo. Frases cortas, palabras del rubro, cero jerga ("solución integral", "optimizar").
- **4 temas de contenido**, con un peso cada uno. Todo lo que se publica cae en uno:

| Tema | Peso | Por qué |
| --- | --- | --- |
| El producto en 15 segundos | 40 % | Que se entienda qué hace sin leer nada |
| Dolores del cliente | 25 % | Se siente identificado, comenta y comparte |
| Tips para guardar | 20 % | Instagram premia los guardados |
| La marca por dentro | 15 % | La cuenta está viva: novedades, preguntas, encuestas |

## 2. El perfil

Se arma **antes** de la primera publicación: es lo que ve quien llega desde un reel, y decide en tres segundos.

- **Cuenta de empresa** (gratis): estadísticas y botón de contacto.
- **Nombre** (no el usuario): `Marca · palabra que la gente busca`. El nombre aparece en el buscador de Instagram.
- **Bio de 4 líneas, máximo 150 caracteres:** lema · qué es y para quién · qué resuelve · llamado a la acción ↓
- **Link con utm:** `web.com/?utm_source=instagram&utm_medium=bio`. Así la analítica de la web cuenta lo que llega desde Instagram.
- **Botón de contacto:** WhatsApp de la marca.
- **Foto:** `piezas/out/perfil.png`. El nombre tiene que entrar entero en el círculo.

## 3. La grilla de lanzamiento: 9 publicaciones

Se suben las 9 en 3 días, antes de invitar a nadie. Así el que entra ve una cuenta viva, no un perfil vacío.

- **Reels en las posiciones 2, 5 y 8.** En el perfil quedan todos en la columna del medio: videos al centro y carruseles a los costados. Se ve ordenado.
- **Todo en 1080×1350 (4:5).** El perfil muestra cada publicación recortada a 3:4: el título va al centro y nada importante en los bordes.
- **Orden de subida:** la primera que se sube queda abajo a la derecha, y la última arriba a la izquierda. `npm run grilla -- <marca>` muestra cómo va a quedar.
- **Fijar 3:** la presentación, la que más se comparte y la de precio o cómo comprar.

Las 9 que funcionan para casi cualquier marca:

| # | Formato | Qué es |
| --- | --- | --- |
| 1 | Carrusel | Presentación: el lema y qué es la marca en 4 o 5 láminas |
| 2 | Reel | El dolor más común, resuelto |
| 3 | Carrusel | **Comparación** (cuaderno vs planilla vs nosotros; industrial vs de verdad). Se guarda y se comparte |
| 4 | Carrusel | Tip para guardar, con pasos numerados |
| 5 | Reel | La función o el producto estrella |
| 6 | Carrusel | Para quién es: rubros, ocasiones, zonas |
| 7 | Carrusel | "N señales de que…" o "N errores al…": genera comentarios |
| 8 | Reel | Cómo se empieza o se compra, sin vueltas |
| 9 | Post | Precio, horarios o cómo comprar: saca la última duda |

**Carruseles:** la primera lámina es la tapa (título grande, 6 a 8 palabras). Una idea por lámina. La última es el llamado a la acción.

## 4. Historias destacadas: el menú del perfil

Son 4 a 6 y responden las preguntas que alguien se hace antes de comprar: qué es, cómo funciona o qué hay, para quién es, cuánto sale y cómo los contacto.

- **Portadas** del mismo estilo: fondo de la marca y un ícono de línea en el color de acento. Nombres de una palabra, así no se cortan.
- **Las historias** (1080×1920) llevan lo importante entre y=250 y y=1590: arriba y abajo va la interfaz de Instagram.
- **Sticker de link:** en la historia de "probalo" y en la de contacto. La pieza deja un recuadro `[ sticker de link ]` para taparlo con el sticker real.
- **Orden:** la última destacada que se crea queda primera. **Se crean al revés** (Ayuda primero, la de la marca al final). Adentro de cada una, las historias se ven en el orden en que se subieron.
- Cuando haya un cliente que quiera contar su experiencia, se suma una destacada **Clientes**. No se inventa.

## 5. Reels

Los reels son lo único que Instagram le muestra a gente que todavía no te sigue: son el motor.

- **Estructura de 15 a 20 s:** gancho con un dolor (3 s) → el producto resolviéndolo, con números que cuentan (5 s) → segundo beneficio (4 s) → marca, lema y llamado a la acción (4 s).
- **El primer segundo** lleva texto grande que se lea sin sonido. Una idea por escena, máximo 8 palabras.
- **Corto gana:** Instagram mide si lo ven entero.
- **Sin audio en el render.** El audio se suma en la app al publicar, bajito. Si es uno que está de moda, suma alcance.
- **Tapa aparte** (`tapaReel` en las piezas). Al publicar: Editar portada → Agregar desde la galería, centrada para la vista del perfil.
- Ritmo: 2 a 3 reels por semana, todos con el kit (`npm run new -- <marca>-ig-0N --from <otro-reel>`).

## 6. Textos

Cada publicación lleva su texto en `TEXTOS.md`, listo para copiar:

1. **Primera línea que se entiende sola.** Es lo único que se ve sin tocar "más", y va con la palabra que la gente busca ("punto de venta", "panadería en…").
2. Dos o tres líneas cortas con el beneficio.
3. **Un pedido concreto:** comentá, guardalo, mandáselo a alguien, link en la bio.
4. **3 a 5 hashtags** del rubro, al final. Más que eso parece spam; hoy Instagram ordena por las palabras del texto.

## 7. Calendario: 4 semanas

- **3 publicaciones por semana** (lunes, miércoles y viernes), a la hora en que el cliente mira el celular. 3 siempre es mejor que 7 una semana y después desaparecer.
- **3 a 5 historias por día hábil**, sin producción: encuestas, cajas de preguntas, una novedad, compartir el post del día.
- Las encuestas y las cajas de preguntas suben el alcance y dan ideas para los próximos posts.

## 8. Primeros seguidores (sin pagar)

1. Compartir cada post en las historias de la cuenta.
2. Pedirle a los clientes actuales que sigan la cuenta.
3. 15 minutos por día comentando algo útil (no "¡qué lindo!") en cuentas del rubro.
4. Grupos de WhatsApp y Facebook del rubro: el reel, no un aviso.
5. **Publicidad paga recién en la semana 4**, sobre el reel que mejor funcionó solo. Pagar para empujar algo que no funciona solo es tirar plata.

## 9. Medir

La métrica que importa no son los seguidores: son **las ventas, altas o consultas que llegan desde Instagram**,
contadas con el link con utm. Una vez por semana: qué publicación trajo más visitas, y hacer más de eso.

## 10. Subir (y TikTok)

`npm run subir -- <marca>` arma `marcas/<marca>/subir/`:

```
subir/
  LEEME.txt                 los pasos, en orden, con el orden inverso de las destacadas
  TEXTOS.md                 los textos para copiar
  grilla.png                cómo queda el perfil
  1-feed/1 carrusel - …/    01.png, 02.png…
  1-feed/2 reel - …/        reel.mp4 + tapa.png
  2-destacadas/             portada N - nombre.png + una carpeta de historias por destacada
  3-perfil/                 perfil.png, portada.png
```

**TikTok:** los reels van tal cual (1080×1920).

- Subir siempre el `reel.mp4` **original** a cada red. Nunca el descargado de la otra: cada red muestra menos los videos con la marca de agua de la competencia.
- Los botones de TikTok quedan a la derecha, a media pantalla: dejar 120 px libres a la derecha en las escenas con tarjetas, si se hace una versión para TikTok.
- En TikTok el link en el perfil aparece con cuenta de empresa o a los 1.000 seguidores. Hasta entonces: "buscá web.com" en el texto.
- En TikTok los hashtags pesan más que en Instagram: 4 o 5 del rubro y del país.
- Los carruseles se pueden subir como fotos, pero rinden mucho menos que los videos.
