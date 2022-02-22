const Discord = require("discord.js");

module.exports = {
    name: "channel",
    description: "Create or Delete a channel",
    userPerms: ['MANAGE_CHANNELS'],
    botPerms: ['ADMINISTRATOR'],
    options: [
        {
            name: 'create',
            description: 'Create a new channel',
            type: 'SUB_COMMAND',
            options: [
                {
                    name: 'name',
                    description: 'New channel name',
                    type: 'STRING',
                    required: true,
                },
                {
                    name: 'type',
                    description: 'Select a channel type',
                    type: 'STRING',
                    required: true,
                    choices: [
                        {name:'Text',value:'GUILD_TEXT'},
                        {name:'Voice',value:'GUILD_VOICE'},
                        {name:'Stage Voice',value:'GUILD_STAGE_VOICE'},
                        {name:'Category',value:'GUILD_CATEGORY'},
                        {name:'News',value:'GUILD_NEWS'},
                    ]
                },
            ]
        },
        {
            name: 'delete',
            description: 'Delete a channel. Careful with this, you can\'t get back your channel.',
            type: 'SUB_COMMAND',
            options: [
                {
                    name: 'channel',
                    description: 'Channel to delete',
                    type: 'CHANNEL',
                    required: true,
                },
            ]
        },
    ],
    run: async (client, interaction, arg) => {
        
        if (interaction.options.getSubcommand() === 'create') {
            const toolongEmbed = new Discord.MessageEmbed()
                .setColor(`RED`)
                .setDescription(`⛔ Channel name can't be longer than 100 characters.`)
    
            const channeltype = interaction.options.getString('type');
            const channelname = interaction.options.getString('name');
    
            if (channelname.length > 100) return interaction.reply({ephemeral:true, embeds:[toolongEmbed]});
    
            interaction.guild.channels.create(channelname, {type: channeltype}).then(channel => {
                const createdEmbed = new Discord.MessageEmbed()
                    .setColor(`GREEN`)
                    .setDescription(`✅ Successfully created a new **\`${channeltype.split('_')[1]}\`** channel: **${channel}**`)
                interaction.reply({embeds:[createdEmbed]});
            })
        } else {
            const channel = interaction.options.getChannel('channel');
            channel.delete();
            const deletedEmbed = new Discord.MessageEmbed()
                .setColor(`GREEN`)
                .setDescription(`✅ Successfully deleted channel: **${channel.name}**`)
            interaction.reply({embeds:[deletedEmbed]});
        }
    }
}