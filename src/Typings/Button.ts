import {
  ButtonInteraction,
  GuildMember,
  PermissionResolvable,
} from 'discord.js';
import { ExtendedClient } from '../Structures/Client';

export interface ExtendedButtonInteraction extends ButtonInteraction {
  member: GuildMember;
}

export type ButtonType = {
  customId: string;
  userPermissions?: PermissionResolvable[];
  run: (client: ExtendedClient, interaction: ExtendedButtonInteraction) => any;
};
