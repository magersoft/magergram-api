import { isAuthenticated } from '../../../middlewares';
import { prisma, Room, User } from '../../../../generated/prisma-client';

export default {
  Mutation: {
    createRoomMessages: async (_, { toId }, { request }): Promise<Room|null> => {
      isAuthenticated(request);
      const user: User = request.user;

      try {
        const rooms: Room[] = await prisma.user({ id: user.id }).rooms({
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

        throw new Error('Room cannot create');
      } catch (e) {
       console.error(e.message);
       return null;
      }
    }
  }
}
