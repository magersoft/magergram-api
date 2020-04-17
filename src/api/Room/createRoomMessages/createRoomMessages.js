import { isAuthenticated } from '../../../middlewares';
import { prisma } from '../../../../generated/prisma-client';

export default {
  Mutation: {
    createRoomMessages: async (_, { toId }, { request }) => {
      isAuthenticated(request);
      const { user } = request;

      const rooms = await prisma.user({ id: user.id }).rooms({
        where: {
          participants_some: {
            id: toId
          }
        }
      });

      if (rooms.length) {
        return rooms[0];
      }

      if (user.id !== toId) {
        return await prisma.createRoom({
          participants: {
            connect: [{ id: toId }, { id: user.id }]
          }
        })
      }
    }
  }
}
