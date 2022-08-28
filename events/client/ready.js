const { Client } = require('discord.js')

module.exports = {
    name: "ready",
    /**
     * @param {Client} client 
     */
    execute(client) {
        console.log(`${client.user.tag} is Ready!`)
        client.user.setActivity("Captcha", { type: "PLAYING" })
    }
}