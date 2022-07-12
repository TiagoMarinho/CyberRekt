const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('rename')
		.setDescription('Change the name of multiple things at once')
		.setDefaultMemberPermissions(0)

		.addSubcommandGroup (subcommandGroup =>
			subcommandGroup
				.setName(`channels`)
				.setDescription(`Only rename server channels`)
				.addSubcommand(subcommand => 
					subcommand
						.setName(`prefix`)
						.setDescription(`Adds a string to the start of every channel name`)
						.addStringOption(option => 
							option.setName('prefix')
							.setDescription(`String to add to start of the channel name`)
							.setRequired(true))
				)
				.addSubcommand(subcommand => 
					subcommand
						.setName(`suffix`)
						.setDescription(`Adds a string to the end of every channel name`)
						.addStringOption(option => 
							option.setName('suffix')
							.setDescription(`String to add to end of the channel name`)
							.setRequired(true))
				)
				.addSubcommand(subcommand => 
					subcommand
						.setName(`affix`)
						.setDescription(`Adds a string to the start and end of every channel name`)
						.addStringOption(option => 
							option.setName('prefix')
							.setDescription(`String to add to start of the channel name`)
							.setRequired(true))
						.addStringOption(option => 
							option.setName('suffix')
							.setDescription(`String to add to end of the channel name`)
							.setRequired(true))
				)
		),
	async execute(interaction) {
		await interaction.deferReply({ephemeral: true})
		const prefix = interaction.options.getString(`prefix`) || ``
		const suffix = interaction.options.getString(`suffix`) || ``
		const datablocks = interaction.guild[interaction.options.getSubcommandGroup()].cache
		for (const datablock of datablocks) {
			await interaction.guild[interaction.options.getSubcommandGroup()].edit(datablock[0], {name: `${prefix}${datablock[1].name}${suffix}`})
				.catch(console.error)
		}
		interaction.editReply(`Successfully renamed channels`)
	},
};