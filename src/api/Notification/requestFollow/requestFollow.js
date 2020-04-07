import { isAuthenticated } from '../../../middlewares';
import { prisma } from '../../../../generated/prisma-client';

export default {
  Mutation: {
    requestFollow: async (_, { subscriberId }, { request }) => {
      isAuthenticated(request);
      const { user } = request;
      try {
        const notifications = await prisma.user({ id: user.id }).notifications({
          where: {
            AND: {
              type: 'SUBSCRIPTION',
              subscriber: { id: subscriberId },
              requesting: true
            }
          }
        });

        if (notifications.length) {
          return false;
        }

        await prisma.createNotification({
          type: 'SUBSCRIPTION',
          user: {
            connect: {
              id: user.id
            }
          },
          subscriber: {
            connect: {
              id: subscriberId
            }
          },
          requesting: true
        });
        return true;
      } catch (e) {
        console.error(e);
        return false;
      }

    }
  }
}
