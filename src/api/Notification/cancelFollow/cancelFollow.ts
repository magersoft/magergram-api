import { isAuthenticated } from '../../../middlewares';
import { prisma, User } from '../../../../generated/prisma-client';

export default {
  Mutation: {
    cancelFollow: async (_, { subscriberId }, { request }): Promise<boolean> => {
      isAuthenticated(request);
      const user: User = request.user;
      try {
        await prisma.deleteManyNotifications({
          AND: {
            user: { id: user.id },
            subscriber: { id: subscriberId },
            type: 'SUBSCRIPTION',
            requesting: true
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
