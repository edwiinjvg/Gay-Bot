let handler = async (m, { conn, usedPrefix, command, text }) => {
  if (!text) {
    return conn.sendMessage(
      m.chat,
      { text: `_Escribe el nombre de la apk que quieres buscar._`, ...global.rcanal },
      { quoted: m }
    )
  }

  conn.apk = conn.apk || {}

  if (text.length <= 2 && !isNaN(text) && m.sender in conn.apk) {
    text = text.replace(/http:\/\/|https:\/\//i, "")

    let dt = conn.apk[m.sender]
    if (dt.download) return conn.sendMessage(m.chat, { text: "_Ya estás descargando un archivo, espera..._", ...global.rcanal }, { quoted: m })

    try {
      dt.download = true

      let data = await aptoide.download(dt.data[text - 1].id)

      let caption = `
- _*Nombre:* ${data.appname}_
- _*Desarrollador:* ${data.developer}_`.trim()

      await conn.sendMessage(
        m.chat,
        {
          image: { url: data.img },
          caption,
          ...global.rcanal
        },
        { quoted: m }
      )

      let dl = await conn.getFile(data.link)
      await conn.sendMessage(
        m.chat,
        {
          document: dl.data,
          fileName: data.appname + ".apk",
          mimetype: dl.mime,
          ...global.rcanal
        },
        { quoted: m }
      )

    } catch (e) {
      console.error(e)
      conn.sendMessage(m.chat, { text: "_Ocurrió un error al descargar el apk_.", ...global.rcanal }, { quoted: m })
    } finally {
      dt.download = false
    }

  } else {
    let data = await aptoide.search(text)

    if (!data || data.length === 0) {
      return conn.sendMessage(m.chat, { text: "_No se encontraron resultados para tu búsqueda._", ...global.rcanal }, { quoted: m })
    }

    let caption = data
      .map((v, i) => {
        return `
- _*${i + 1}. ${v.name}*_
- _*Tamaño:* ${v.size}_
- _*Versión:* ${v.version}_
- _Descargas:* ${v.download}_
- _ID:* ${v.id}_`.trim()
      })
      .join("\n\n")

    let header = `- _*Para descargar responde con:* ${usedPrefix + command} y el número._\n_*Ejemplo:* ${usedPrefix + command} 1_\n\n`

    conn.sendMessage(m.chat, { text: header + caption, ...global.rcanal }, { quoted: m })

    conn.apk[m.sender] = {
      download: false,
      data,
      time: setTimeout(() => {
        delete conn.apk[m.sender]
      }, 3600000)
    }
  }
}

handler.help = ["apk"]
handler.tags = ["downloader"]
handler.command = /^(apk)$/i
handler.register = true

export default handler

const aptoide = {
  search: async function (query) {
    let res = await global.fetch(
      `https://ws75.aptoide.com/api/7/apps/search?query=${encodeURIComponent(query)}&limit=1000`
    )
    res = await res.json()

    if (!res.datalist?.list?.length) return []

    return res.datalist.list.map((v) => ({
      name: v.name,
      size: v.size,
      version: v.file?.vername || "N/A",
      id: v.package,
      download: v.stats?.downloads || 0
    }))
  },

  download: async function (id) {
    let res = await global.fetch(
      `https://ws75.aptoide.com/api/7/apps/search?query=${encodeURIComponent(id)}&limit=1`
    )
    res = await res.json()

    if (!res.datalist?.list?.length) {
      throw new Error("_Aplicación no encontrada._")
    }

    const app = res.datalist.list[0]
    return {
      img: app.icon,
      developer: app.store?.name || "Desconocido",
      appname: app.name,
      link: app.file?.path
    }
  }
}