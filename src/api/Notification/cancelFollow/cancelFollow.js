import { isAuthenticated } from '../../../middlewares';
import { prisma } from '../../../../generated/prisma-client';

export default {
  Mutation: {
    cancelFollow: async (_, { subscriberId }, { request }) => {
      isAuthenticated(request);
      const { user } = request;
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
