import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  MessageActionRowComponentBuilder,
  TextChannel,
} from 'discord.js';
import { Ticket } from '../../Models/Ticket/ticket';
import { Button } from '../../Structures/Button';

export default new Button({
  customId: 'close_ticket',
  run: async (client, interaction) => {
    let TicketDocument = await Ticket.findOne({
      TicketChannelID: interaction.channel.id,
    });
    if (TicketDocument) {
      if (TicketDocument.TicketStatus !== 'Opened') return;
      interaction.deferUpdate();
      let ticketCreator = TicketDocument.TicketAuthorID;
      (interaction.channel as TextChannel).permissionOverwrites.delete(
        ticketCreator
      );
      let delete_btn = new ButtonBuilder()
        .setStyle(ButtonStyle.Secondary)
        .setEmoji('🗑️')
        .setLabel('Delete')
        .setCustomId('delete_ticket');
      let open_btn = new ButtonBuilder()
        .setStyle(ButtonStyle.Secondary)
        .setEmoji('🔓')
        .setLabel('Unlock')
        .setCustomId('open_ticket');
      let tr_btn = new ButtonBuilder()
        .setStyle(ButtonStyle.Secondary)
        .setEmoji('📄')
        .setLabel('Transcript')
        .setCustomId('tr_ticket');
      let ticketCloseEmbed = new EmbedBuilder()
        .setTitle('Ticket Closed')
        .setDescription(
          `The ticket has been closed by ${interaction.user} \nClick 🔓 to reopen the ticket. \nClick 📄 to save the transcript. \nClick 🗑️ to delete the ticket.`
        )
        .setThumbnail(interaction.guild.iconURL())
        .setTimestamp()
        .setColor('#7BE2CD');
      let row =
        new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents([
          open_btn,
          tr_btn,
          delete_btn,
        ]);
      interaction.channel.send({
        embeds: [ticketCloseEmbed],
        components: [row],
      });
      TicketDocument.TicketStatus = 'Closed';
      await TicketDocument.save();
    }
  },
});
