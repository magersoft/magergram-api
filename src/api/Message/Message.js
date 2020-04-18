import { prisma } from '../../../generated/prisma-client';

export default {
  Message: {
    from: ({ id }) => prisma.message({ id }).from(),
    to: ({ id }) => prisma.message({ id }).to(),
    room: ({ id }) => prisma.message({ id }).room(),
    isRead: async ({ id }, _, { request }) => {
      const { user } = request;

      const message = await prisma.message({ id });

      const fromUser = await prisma.message({ id }).from();
      if (fromUser.id === user.id) {
        return true;
      } else {
        return message.read;
      }
    }
  }
}
