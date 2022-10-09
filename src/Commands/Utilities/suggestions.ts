import {
  ApplicationCommandOptionType,
  EmbedBuilder,
  GuildTextBasedChannel,
} from 'discord.js';
import { Suggestion } from '../../Models/Suggestion/suggestion';
import { Command } from '../../Structures/Command';

export default new Command({
  name: 'suggest',
  description: 'Suggest something',
  options: [
    {
      type: ApplicationCommandOptionType.String,
      name: 'suggestion',
      description: 'Input suggestion here',
      required: true,
    },
  ],

  category: 'Utilities',
  run: async (client, interaction) => {
    let channel = interaction.guild.channels.cache.find(
      (c) => c.name === 'suggestions'
    ) as GuildTextBasedChannel;

    let errorembed = new EmbedBuilder()
      .setDescription(
        "<:TickRed:904760060725571615> Suggestions channel doesn't exist! \n\nPlease create a channel named `suggestions`."
      )
      .setColor(client.config.botColor);

    if (!channel)
      return interaction.reply({ embeds: [errorembed], ephemeral: true });

    let oldSuggestion = await Suggestion.findOne().sort('-_id');

    let message = interaction.options.getString('suggestion');

    let embed = new EmbedBuilder()
      .setColor('#37B3C8')
      .setTitle(
        `Suggestion #${String(
          parseInt(oldSuggestion.SuggestionNumber) + 1
        )} (Pending)`
      )
      .setDescription(`${message}`)
      .setAuthor({
        name: `${interaction.user.tag}`,
        iconURL: interaction.member.displayAvatarURL(),
      })
      .setFooter({ text: '⬆️Upvote〡⬇️Downvote' });

    channel.send({ embeds: [embed] }).then((msg) => {
      msg.react('⬆️');
      msg.react('⬇️');
      new Suggestion({
        SuggestionMessageID: msg.id,
        SuggestionAuthorID: interaction.user.id,
        SuggestionMessage: message,
        SuggestionNumber: String(parseInt(oldSuggestion.SuggestionNumber) + 1),
      }).save();
    });

    await interaction.reply({ content: `Done! ${channel}`, ephemeral: true });
  },
});
