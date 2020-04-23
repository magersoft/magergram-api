import { isAuthenticated } from '../../../middlewares';
import { prisma, User } from '../../../generated/prisma-client';

export default {
  Mutation: {
    darkMode: async (_, { darkMode }, { request }): Promise<boolean> => {
      isAuthenticated(request);
      const user: User = request.user;
      try {
        await prisma.updateUser({
          data: { darkMode },
          where: { id: user.id }
        });
        return true;
      } catch (e) {
        console.error(e.message);
        return false;
      }
    }
  }
}
