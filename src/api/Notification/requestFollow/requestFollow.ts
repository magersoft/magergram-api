import { isAuthenticated } from '../../../middlewares';
import { prisma, User } from '../../../generated/prisma-client';
import Notification, { INotification } from '../../../utils/Notification';

export default {
  Mutation: {
    requestFollow: async (_, { subscriberId }, { request }): Promise<boolean> => {
      isAuthenticated(request);
      const user: User = request.user;
      try {
        const notifications = await prisma.user({ id: user.id }).notifications({
          where: {
            AND: {
              type: 'SUBSCRIPTION',
              subscriber: { id: user.id },
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
              id: subscriberId
            }
          },
          subscriber: {
            connect: {
              id: user.id
            }
          },
          requesting: true
        });

        const subscriberUser = await prisma.user({ id: subscriberId });
        const requestUser = await prisma.user({ id: user.id });

        if (!subscriberUser || !requestUser) throw new Error('User not found');

        const notification: INotification = new Notification(subscriberUser, {
          title: requestUser.username
        }, 'requestFollow');
        await notification.push();

        if (subscriberUser.email && subscriberUser.emailNotification) {
          await notification.email();
        }

        return true;
      } catch (e) {
        console.error(e);
        return false;
      }
    }
  }
}
