const { GuildMember, MessageAttachment, MessageEmbed, Message } = require('discord.js')
const { Captcha } = require('captcha-canvas')
module.exports = {
    name: "guildMemberAdd",
    /**
     * @param {GuildMember} member 
     * @param {String[]} args
     */
    async execute(member, args) {
        var timeout = true;

        const captcha = new Captcha();
        captcha.async = true;
        captcha.addDecoy();
        captcha.drawTrace()
        captcha.drawCaptcha()

        const captchaAttachment = new MessageAttachment(
            await captcha.png,
            "captcha.png"
        )

        const captchaEmbed = new MessageEmbed()
        .setTitle("보안문자를 입력하세요!")
        .setImage("attachment://captcha.png");

        const msg = await member.send({
            files: [captchaAttachment],
            embeds: [captchaEmbed],
        })

        /**
         * @param {Message} message 
         */
        var success = false;
        const filter = (message) => {
            if (message.author.id !== member.id) return;
            if (message.content == captcha.text) {
                success = true
                timeout = false
                member.roles.add('123456789101123456') //Role ID Here.
                member.send({ embeds: [
                    new MessageEmbed()
                    .setTitle("✅ㅣ인증 완료!")
                    .setDescription("인증이 완료되었습니다!\nTeam.Cloud에 오신것을 진심으로 환영합니다.")
                    .setColor(0x00ffee)
                    .setTimestamp()
                ]})
                return
            }
            else return member.send("보안문자가 일치하지 않습니다!");
        }
        try {
            const response = await msg.channel.awaitMessages({
                filter,
                max: 3,
                time: 60000,
                errors: ["time"]
            }).then(() => {
                if(success == false) {
                    timeout = false
                    member.send({ embeds: [
                        new MessageEmbed()
                        .setTitle("❌ㅣ인증 거부")
                        .setDescription("보안문자 3회를 잘못 입력하여\n해당서버에서 킥을 당하였습니다.")
                        .setColor(0xff4242)
                        .setTimestamp()
                    ]}).then(() => member.kick("인증에 응답을 하지 않았습니다!"))
                }
            })
        } catch (err) {
            if(timeout == true) { 
                member.send({ embeds: [
                new MessageEmbed()
                .setTitle("❌ㅣ시간 초과")
                .setDescription("인증시간(60초)이 초과되었습니다!\n처음부터 다시 진행해주세요!")
                .setColor(0xff4242)
                .setTimestamp()
            ]}).then(() => { return member.kick("인증시간을 초과하여 추방되었습니다.")}) }
        }
    }
}