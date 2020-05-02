import { isAuthenticated } from '../../../middlewares';
import { Favorite, prisma, User } from '../../../generated/prisma-client';

export default {
  Query: {
    seeFavorite: async (_, __, { request }): Promise<Favorite[]> => {
      isAuthenticated(request);
      const user: User = request.user;
      return await prisma.favorites({
        where: {
          user: {
            id: user.id
          }
        },
        orderBy: 'createdAt_DESC'
      })
    }
  }
}
