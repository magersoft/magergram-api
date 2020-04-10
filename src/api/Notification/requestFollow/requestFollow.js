import { isAuthenticated } from '../../../middlewares';
import { prisma } from '../../../../generated/prisma-client';
import Notification from '../../../utils/Notification';

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
        const notification = new Notification(subscriberUser, {
          title: requestUser.username
        }, 'requestFollow');
        notification.push();

        return true;
      } catch (e) {
        console.error(e);
        return false;
      }
    }
  }
}
