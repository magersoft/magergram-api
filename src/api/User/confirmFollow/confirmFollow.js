import { isAuthenticated } from '../../../middlewares';
import { prisma } from '../../../../generated/prisma-client';
import Notification from '../../../utils/Notification';

export default {
  Mutation: {
    confirmFollow: async (_, { notificationId, requestUserId }, { request }) => {
      isAuthenticated(request);
      const { user } = request;
      try {
        const confirmedUser = await prisma.updateUser({
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

        const notification = new Notification(confirmedUser, {
          title: user.username
        }, 'confirmFollow');
        notification.push();

        return await prisma.deleteNotification({ id: notificationId });
      } catch (e) {
        console.error(e);
        return null;
      }
    }
  }
}
