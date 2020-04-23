import { isAuthenticated } from '../../../middlewares';
import { prisma, User } from '../../../../generated/prisma-client';

export default {
  Mutation: {
    toggleEmailNotification: async (_, { state }, { request }): Promise<boolean> => {
      isAuthenticated(request);
      const user: User = request.user;
      try {
        await prisma.updateUser({
          data: { emailNotification: state },
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
