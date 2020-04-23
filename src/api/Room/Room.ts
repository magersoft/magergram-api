import { Message, prisma, User } from '../../generated/prisma-client';

export default {
  Room: {
    participants: ({ id }): User[] => prisma.room({ id }).participants(),
    messages: ({ id }): Message[] => prisma.room({ id }).messages(),
    lastMessage: ({ id }): Message[] => prisma.room({ id }).messages({ last: 1 })
  }
}
