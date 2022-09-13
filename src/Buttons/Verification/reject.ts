import { Button } from '../../Structures/Button';
import { MessageActionRow, MessageButton } from "discord.js";

export default new Button({
  customId: '\\d+\\.verification.reject',
  run: async (client, interaction) => {
    if (!interaction.member.roles.cache.has("1008423362911031367")) {
      return interaction.reply({
        content: "You are not a gatekeeper.",
        ephemeral: true
      })
    }
    
    interaction.reply({
      content: 'Denying the verification request will kick the member. Do you still want to continue?',
      ephemeral: true,
      components: [
        new MessageActionRow()
          .addComponents(
            new MessageButton()
              .setStyle('DANGER')
              .setLabel("I know what I'm doing")
              .setCustomId(`${interaction.message.id}.verification.rejectConfirmed`),
            
            new MessageButton()
              .setStyle('SECONDARY')
              .setLabel('Never mind')
              .setCustomId(`verification.rejectCancelled`)
          )
      ]
      
    });
  },
});
