import { isAuthenticated } from '../../../middlewares';
import { prisma, User } from '../../../generated/prisma-client';
import Notification, { INotification } from '../../../utils/Notification';

export default {
  Mutation: {
    confirmFollow: async (_, { notificationId, requestUserId }, { request }): Promise<any> => {
      isAuthenticated(request);
      const user: User = request.user;
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

        const notification: INotification = new Notification(confirmedUser, {
          title: user.username
        }, 'confirmFollow');
        await notification.push();

        if (confirmedUser.email && confirmedUser.emailNotification) {
          await notification.email();
        }

        return await prisma.deleteNotification({ id: notificationId });
      } catch (e) {
        console.error(e);
        return null;
      }
    }
  }
}
