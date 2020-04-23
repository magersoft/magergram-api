import { isAuthenticated } from '../../../middlewares';
import { prisma, User } from '../../../../generated/prisma-client';

export default {
  Query: {
    myProfile: async (_, __, { request }): Promise<User|null> => {
      isAuthenticated(request);
      const user: User = request.user;

      try {
        return await prisma.user({ id: user.id });
      } catch (e) {
        console.error(e.message);
        return null
      }
    }
  }
}
