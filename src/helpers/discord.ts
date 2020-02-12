import { CollectorFilter, Message, MessageReaction } from "discord.js";

export const numericalEmoji: readonly string[] = [
  "\u0030\u20E3", "\u0031\u20E3", "\u0032\u20E3", "\u0033\u20E3", "\u0034\u20E3", "\u0035\u20E3", "\u0036\u20E3", "\u0037\u20E3", "\u0038\u20E3", "\u0039\u20E3", "🔟"
];

export async function createPagedMessage(
  message: Message,
  handler: (page: number, reaction: MessageReaction) => Promise<void>,
  {
    filter = (): boolean => true,
    pages_count = 10
  }: { filter: CollectorFilter, pages_count: number }
): Promise<void> {
  const f: CollectorFilter = (reaction, user) => {
    return filter(reaction, user) && numericalEmoji.includes(reaction.emoji.name);
  };

  const collector = message.createReactionCollector(f, { time: 75000 });
  collector.on("collect", async (reaction) => {
    await Promise.all(reaction.users.filter((u) => !u.bot).map((u) => reaction.remove(u)));
    const page = numericalEmoji.indexOf(reaction.emoji.name);
    await handler(page, reaction);
  });
  collector.on("end", async () => {
    await message.clearReactions();
  });

  for (let i = 1; i < pages_count + 1 && i < 11; i++) {
    await message.react(numericalEmoji[i]);
  }
}
