import {
  ButtonInteraction,
  MessageActionRow,
  MessageButton,
  MessageEmbed,
} from 'discord.js';
import { getInfoFromURL } from 'mal-scraper';
import { request } from 'undici';
import { Command } from '../../Structures/Command';

export default new Command({
  name: 'anime_search',
  description: 'Find information about animes',
  options: [
    {
      name: 'type',
      description: 'Type of Search',
      type: 'STRING',
      required: true,
      choices: [
        {
          name: 'id',
          value: 'id',
        },
        {
          name: 'name',
          value: 'text',
        },
      ],
    },
    {
      name: 'query',
      description: 'Name or Id of the anime',
      type: 'STRING',
      required: true,
    },
  ],
  category: 'Info',
  run: async (client, interaction) => {
    let query = interaction.options.getString('query');
    let SearchType = interaction.options.getString('type');

    if (SearchType === 'id') {
      query = (await getInfoFromURL(`https://myanimelist.net/anime/${query}`))
        .title;
    }

    interaction.reply('Fetching all animes').then(async () => {
      let mal = await request(
        `https://myanimelist.net/search/prefix.json?type=anime&keyword=${query}`
      ).then((res) => res.body.json());
      if (mal.categories[0].items.length === 0)
        return interaction.editReply({
          content: 'no Animes found',
          embeds: [],
        });
      let AnimeSearch = mal.categories[0].items;
      let first5AnimeSearch = AnimeSearch.slice(0, 5);
      let second5AnimeSearch = AnimeSearch.slice(5, 10);
      let titles = AnimeSearch.map((m, i) => {
        let line = `${i + 1} - ${m.name}`;
        return line;
      });
      let embed = new MessageEmbed()
        .setDescription(titles.join('\n'))
        .setColor(client.config.botColor);
      let row1 = new MessageActionRow();
      let row2 = new MessageActionRow();
      for (let i = 0; i < first5AnimeSearch.length; i++) {
        row1.addComponents(
          new MessageButton()
            .setCustomId(`anime.${first5AnimeSearch[i].id.toString()}.${i}`)
            .setLabel((i + 1).toString())
            .setStyle('SECONDARY')
        );
      }
      for (let i = 0; i < second5AnimeSearch.length; i++) {
        row2.addComponents(
          new MessageButton()
            .setCustomId(
              `anime.${second5AnimeSearch[i].id.toString()}.${i + 5}`
            )
            .setLabel((i + 6).toString())
            .setStyle('SECONDARY')
        );
      }
      interaction.editReply({
        content: 'Fetched all animes select a number',
        embeds: [embed],
        components: [row1, row2],
      });
      let filter = (i: ButtonInteraction) => i.user.id === interaction.user.id;
      let collector = interaction.channel.createMessageComponentCollector({
        componentType: 'BUTTON',
        max: 1,
        filter,
        time: 20000,
      });
      collector.on('collect', async (i) => {
        if (i.customId.startsWith('anime.')) {
          let id = i.customId.split('.')[2];
          let AnimeData = await getInfoFromURL(AnimeSearch[id].url);
          let AnimeEmbed = new MessageEmbed()
            .setTitle(AnimeData.title)
            .setURL(AnimeData.url)
            .setThumbnail(AnimeData.picture)
            .setDescription(AnimeData.synopsis)
            .setColor(client.config.botColor)
            .addField(
              '🎞️ Trailer',
              `[Youtube trailer link](${
                AnimeData.trailer ? AnimeData.trailer : '_gs0cgrmzmE'
              })`,
              true
            )
            .addField(
              '⏳ Status',
              `${AnimeData.status ? AnimeData.status : 'N/A'}`,
              true
            )
            .addField('🗂️ Type', AnimeData.type, true)
            .addField(
              '➡️ Genres',
              `${
                AnimeData.genres.map((x) => x).join(', ')
                  ? AnimeData.genres.map((x) => x).join(', ')
                  : '.'
              }`,
              true
            )
            .addField(
              '🗓️ Aired',
              `${AnimeData.aired ? AnimeData.aired : 'N/A'}`,
              true
            )
            .addField(
              '📀 Total Episodes',
              `${AnimeData.episodes ? AnimeData.episodes : 'N/A'}`,
              true
            )
            .addField(
              '⏱️ Episode Duration',
              `${
                `${AnimeData.duration} (${AnimeData.scoreStats})`
                  ? AnimeData.duration
                  : '?'
              } minutes`,
              true
            )
            .addField(
              '⭐ Average Score',
              `${AnimeData.score ? AnimeData.score : '?'}/100`,
              true
            )
            .addField(
              '🏆 Rank',
              `Top ${AnimeData.ranked ? AnimeData.ranked : 'N/A'}`,
              true
            );
          interaction.editReply({
            content: 'Here is your anime info',
            embeds: [AnimeEmbed],
            components: [],
          });
        }
      });
    });
  },
});
