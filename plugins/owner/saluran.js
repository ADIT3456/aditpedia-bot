import config from "../../config.js";

const pluginConfig = {
  name: ["saluran", "syncch", "syncsaluran", "cekch", "idch"],
  alias: ["setsaluran", "infosaluran"],
  category: "owner",
  description: "Kelola dan sinkronisasi informasi saluran WhatsApp bot",
  usage: ".saluran [sync | <link_channel>]",
  example: ".saluran sync",
  isOwner: true,
  cooldown: 3,
  energi: 0,
  isEnabled: true,
};

async function handler(m, { sock }) {
  const text = (m.text || "").trim();

  let linkToSync = config.saluran?.link || "";
  let forceSync = false;

  if (text.startsWith("http://") || text.startsWith("https://") || text.startsWith("whatsapp.com/channel/")) {
    linkToSync = text.startsWith("http") ? text : `https://${text}`;
    forceSync = true;
  } else if (text === "sync" || text === "update" || text === "refresh" || m.command === "syncch" || m.command === "syncsaluran") {
    forceSync = true;
  }

  if (forceSync && linkToSync) {
    const match = linkToSync.match(/channel\/([a-zA-Z0-9_-]+)/);
    if (!match || !match[1]) {
      return m.reply("❌ *Format link saluran tidak valid.* Contoh: https://whatsapp.com/channel/0029VbDaD1x0G0Xewwpomp2F");
    }

    const code = match[1];
    await m.react("⏳");

    try {
      if (typeof sock.newsletterMetadata !== "function") {
        throw new Error("Metode newsletterMetadata tidak tersedia pada socket.");
      }

      const meta = await sock.newsletterMetadata("invite", code);
      if (!meta || !meta.id) {
        throw new Error("Metadata saluran tidak ditemukan.");
      }

      const cleanId = meta.id.includes("@newsletter") ? meta.id : `${meta.id}@newsletter`;
      config.saluran.id = cleanId;
      config.saluran.link = linkToSync;
      if (meta.name) config.saluran.name = meta.name;

      await m.react("✅");
      let resText = `📢 *SINKRONISASI SALURAN BERHASIL*\n\n`;
      resText += `◦ *Nama:* ${meta.name || config.saluran.name}\n`;
      resText += `◦ *ID (JID):* \`${cleanId}\`\n`;
      if (meta.subscribers) resText += `◦ *Pengikut:* ${meta.subscribers.toLocaleString("id-ID")}\n`;
      resText += `◦ *Link:* ${config.saluran.link}\n\n`;
      resText += `> _Semua header pesan bot dan menu sekarang mengarah ke saluran ini._`;
      return m.reply(resText);
    } catch (err) {
      await m.react("❌");
      return m.reply(`❌ *Gagal mengambil metadata saluran:*\n> ${err.message}`);
    }
  }

  let infoText = `📢 *INFORMASI SALURAN BOT*\n\n`;
  infoText += `◦ *Nama:* ${config.saluran?.name || "-"}\n`;
  infoText += `◦ *ID (JID):* \`${config.saluran?.id || "-"}\`\n`;
  infoText += `◦ *Link:* ${config.saluran?.link || "-"}\n\n`;
  infoText += `💡 *Perintah Tersedia:*\n`;
  infoText += `> \`.saluran sync\` — Sinkronkan ID & Nama langsung dari WhatsApp\n`;
  infoText += `> \`.saluran <link>\` — Ubah link & sinkronkan saluran baru`;

  return m.reply(infoText);
}

export { pluginConfig as config, handler };
