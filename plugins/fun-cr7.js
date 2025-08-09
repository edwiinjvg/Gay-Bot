import axios from "axios";

let handler = async (m, { conn, usedPrefix, command }) => {
    let cristiano = (
        await axios.get(`https://raw.githubusercontent.com/davidprospero123/api-anime/main/BOT-JSON/CristianoRonaldo.json`)
    ).data;

    let ronaldo = cristiano[Math.floor(Math.random() * cristiano.length)];

    await conn.sendMessage(
        m.chat,
        {
            image: { url: ronaldo },
        },
        { quoted: m }
    );
};

handler.help = ["cr7"];
handler.tags = ["fun"];
handler.command = /^(cristiano|ronaldo|cr7)$/i;

export default handler;