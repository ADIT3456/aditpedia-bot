import { getAssetBuffer } from "../../src/lib/ourin-asset-manager.js";
import config from "../../config.js"

const pluginConfig = {
    name: "sc",
    alias: ["script"],
    category: "main",
    description: "Link script bot wa terbaru",
    usage: ".sc",
    example: ".sc",
    isPremium: false,
    isOwner: false,
    isBanned: false,
    isAdmin: false,
    cooldown: 10,
    energi: 0,
    isBotAdmin: false,
    isEnabled: true
}

async function handler(m, { sock }) {
    return await sock.sendMessage(m.chat, {
        image: getAssetBuffer("ourin"),
        caption: `🌾 Halo kak *${m.pushName}*
        
Informasi resmi bot *${config.bot?.name || "ADITPEDIA"}* bisa kamu dapatkan melalui website kami.`,
        footer: `🌐 ${config.info?.website || "aditpedia.my.id"}`,
        interactiveButtons: [
            {
                name: "cta_url",
                buttonParamsJson: JSON.stringify({
                    display_text: `🌐 Kunjungi ${config.bot?.name || "ADITPEDIA"}`,
                    url: config.info?.website || "https://aditpedia.my.id",
                    merchant_url: config.info?.website || "https://aditpedia.my.id"
                })
            }
        ]

    }, { quoted: m })
}

export { pluginConfig as config, handler }