import { isAuthenticated } from '../../../middlewares';
import { prisma } from '../../../../generated/prisma-client';

export default {
  Query: {
    seeRooms: async (_, __, { request }) => {
      isAuthenticated(request);
      const { user } = request;
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
