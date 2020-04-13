import { isAuthenticated } from '../../../middlewares';
import { prisma } from '../../../../generated/prisma-client';

export default {
  Mutation: {
    toggleEmailNotification: async (_, { state }, { request }) => {
      isAuthenticated(request);
      const { user } = request;
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
