import { prisma, Room, User } from '../../../generated/prisma-client';

export default {
  Message: {
    from: ({ id }): User[] => prisma.message({ id }).from(),
    to: ({ id }): User[] => prisma.message({ id }).to(),
    room: ({ id }): Room => prisma.message({ id }).room(),
    isRead: async ({ id }, _, { request }): Promise<boolean> => {
      const { user } = request;

      const message = await prisma.message({ id });
      if (!message) return false;

      const fromUser = await prisma.message({ id }).from();
      if (fromUser.id === user.id) {
        return true;
      } else {
        return message.read;
      }
    }
  }
}
