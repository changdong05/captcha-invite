const { Client } = require('discord.js')
const client = new Client({ intents: 32767 });
const { token } = require("./config")

['eventhandler'].forEach(handler => {
    require(`./handler/${handler}`)(client)
})

client.login(token)