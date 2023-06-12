const {SlashCommandBuilder} = require('discord.js')

module.exports = {
    data : new SlashCommandBuilder()
    .setName('user')
    .setDescription('provide information'),
    async execute(interaction){
      await interaction.reply(`this command was run by ${interaction.user.usename}.`)
    },

};