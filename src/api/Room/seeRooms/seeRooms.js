import { isAuthenticated } from '../../../middlewares';

export default {
  Query: {
    seeRooms: async (_, __, { request }) => {
      isAuthenticated(request);
      const { user } = request;
      return await prisma.rooms({
        where: {
          participants_some: {
            id: user.id
          }
        }
      })
    }
  }
}
