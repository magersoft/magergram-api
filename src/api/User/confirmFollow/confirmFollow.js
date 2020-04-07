import { isAuthenticated } from '../../../middlewares';
import { prisma } from '../../../../generated/prisma-client';

export default {
  Mutation: {
    confirmFollow: async (_, { notificationId, requestUserId }, { request }) => {
      isAuthenticated(request);
      const { user } = request;
      try {
        await prisma.updateUser({
          where: {
            id: requestUserId
          },
          data: {
            following: {
              connect: {
                id: user.id
              }
            }
          }
        });

        await prisma.createNotification({
          type: 'CONFIRM',
          user: {
            connect: {
              id: requestUserId
            }
          },
          subscriber: {
            connect: {
              id: user.id
            }
          }
        });

        return await prisma.deleteNotification({ id: notificationId });
      } catch (e) {
        console.error(e);
        return null;
      }
    }
  }
}
