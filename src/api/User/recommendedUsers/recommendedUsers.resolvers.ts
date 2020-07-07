import { prisma, User } from '../../../generated/prisma-client';
import { isAuthenticated } from '../../../middlewares';

export default {
  Query: {
    recommendedUsers: async (_, __, { request }): Promise<User[]|[]> => {
      isAuthenticated(request);
      const user: User = request.user;

      try {
        const following = await prisma.user({
          id: user.id
        }).following();

        return await prisma.users({
          where: {
            id_not_in: [...following.map(user => user.id), user.id]
          }
        });
      } catch (e) {
        console.error(e.message);
        return [];
      }
    }
  }
}
