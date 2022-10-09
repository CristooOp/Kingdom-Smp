import { EmbedBuilder } from 'discord.js';
import { Command } from '../../Structures/Command';

export default new Command({
  name: 'sourcecode',
  description: 'Get my source code',
  category: 'Info',
  run: async (client, interaction) => {
    let embed = new EmbedBuilder()
      .setDescription(
        'The source code of the bot. [Click here](https://github.com/Developer-Land/MM-Utilities)'
      )
      .setColor(client.config.botColor);

    interaction.reply({ embeds: [embed] });
  },
});
