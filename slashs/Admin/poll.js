const Discord = require(`discord.js`);

module.exports = {
	name: `poll`,
	description: `Start a multiple choice poll`,
	userPerms: [`MANAGE_GUILD`],
	botPerms: [`VIEW_CHANNEL`, `SEND_MESSAGES`, `EMBED_LINKS`, `ADD_REACTIONS`, `READ_MESSAGE_HISTORY`],
	options: [
		{
			name: `question`,
			description: `What is the poll about?`,
			type: `STRING`,
			required: true,
		},
		{
			name: `choices`,
			description: `Provide at least 2 choices (max 10) separated by commas`,
			type: `STRING`,
			required: true,
		},
		{
			name: `channel`,
			description: `Channel to send the poll to. If blank defaults to Guild Config Poll channel`,
			type: `CHANNEL`,
			channelTypes: [`GUILD_TEXT`],
		},
	],
	run: async (client, interaction, LANG) => {

		const emoji = [`🍏`, `🍎`, `🍐`, `🍊`, `🍋`, `🍌`, `🍉`, `🍇`, `🫐`, `🍓`, `🍈`, `🍒`, `🍑`, `🥭`, `🍍`, `🥥`, `🥝`, `🍅`, `🥑`, `🥒`];
		let choicemsg = ``;

		const pollchannel = interaction.options.getChannel(`channel`) || interaction.guild.channels.cache.find(c => c.id === (client.settings.get(interaction.guild.id, `pollchannel`)));
		if (!pollchannel) return interaction.reply({ ephemeral: true, embeds: [client.chill.error(LANG.no_channel)] });

		const question = interaction.options.getString(`question`);
		if (question.length > 256) return interaction.reply({ ephemeral: true, embeds: [client.chill.error(LANG.too_long)] });

		let choices = interaction.options.getString(`choices`);

		if (choices.endsWith(`,`) === true) choices = choices.slice(0, (choices.length - 1)); // remove last "," from choices string
		choices = choices.split(`,`); // convert choices to an array
		if (choices.length > 10 || choices.length < 2) return interaction.reply({ ephemeral: true, embeds: [client.chill.error(LANG.bad_choices)] });

		for (let i = emoji.length - 1; i > 0; i--) { // scramble emoji array
			const j = Math.floor(Math.random() * (i + 1));
			const temp = emoji[i];
			emoji[i] = emoji[j];
			emoji[j] = temp;
		}

		for (let i = 0; i < choices.length; i++) { // prepare choice msg
			choicemsg += `${emoji[i]} ${choices[i]}\n`;
		}
		const pollEmbed = new Discord.MessageEmbed()
			.setColor(`RANDOM`)
			.setTitle(`${question}`)
			.setDescription(LANG.description(choicemsg))
			.setTimestamp();

		if (pollEmbed.description.length > 4096) return interaction.reply({ ephemeral: true, embeds: [client.chill.error(LANG.choices_too_long)] });

		pollchannel.send({ embeds: [pollEmbed] }).then(msg => {
			const doneEmbed = new Discord.MessageEmbed()
				.setColor(`RANDOM`)
				.setDescription(LANG.success(pollchannel));
			interaction.reply({ ephemeral: true, embeds: [doneEmbed] });
			for (let i = 0; i < choices.length; i++) {
				msg.react(emoji[i]);
			}
		});
	},
};