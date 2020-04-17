import { prisma } from '../../../generated/prisma-client';

export default {
  Room: {
    participants: ({ id }) => prisma.room({ id }).participants(),
    messages: ({ id }) => prisma.room({ id }).messages(),
    lastMessage: ({ id }) => prisma.room({ id }).messages({ last: 1 })
  }
}
