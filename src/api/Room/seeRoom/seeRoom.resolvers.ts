import { isAuthenticated } from '../../../middlewares';
import { Message, prisma, Room, User } from '../../../generated/prisma-client';

export default {
  Query: {
    seeRoom: async (_, { id }, { request }): Promise<Room|null> => {
      isAuthenticated(request);
      const { user } = request;
      const canSee = await prisma.$exists.room({
        participants_some: {
          id: user.id
        }
      });
      if (canSee) {
        return await prisma.room({ id });
      } else {
        throw Error('You can\'t see this')
      }
    },
    seeMessages: async (_, { roomId, perPage, page }, { request }): Promise<Message[]> => {
      isAuthenticated(request);
      return await prisma.room({ id: roomId }).messages({
        last: perPage,
        skip: perPage * page,
      })
    }
  },
  Mutation: {
    readRoomMessages: async (_, { roomId }, { request }): Promise<boolean> => {
      try {
        const user: User = request.user;

        await prisma.updateManyMessages({
          data: {
            read: true
          },
          where: {
            room: { id: roomId },
            to: { id: user.id }
          }
        });

        return true;
      } catch (e) {
        console.error(e);
        return false;
      }
    }
  }
}
