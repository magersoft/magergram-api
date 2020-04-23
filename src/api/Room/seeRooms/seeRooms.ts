import { isAuthenticated } from '../../../middlewares';
import { prisma, Room, User } from '../../../../generated/prisma-client';

export default {
  Query: {
    seeRooms: async (_, __, { request }): Promise<Room[]> => {
      isAuthenticated(request);
      const user: User = request.user;
      return await prisma.rooms({
        where: {
          participants_some: {
            id: user.id
          },
          messages_some: {
            id_not: null
          }
        }
      })
    }
  }
}
