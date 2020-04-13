import { isAuthenticated } from '../../../middlewares';
import { prisma } from '../../../../generated/prisma-client';
import Notification from '../../../utils/Notification';

export default {
  Mutation: {
    follow: async (_, args, { request }) => {
      isAuthenticated(request);
      const { id } = args;
      const { user } = request;
      try {
        const updatedUser = await prisma.updateUser({
          where: {
            id: user.id
          },
          data: {
            following: {
              connect: {
                id
              }
            }
          }
        });

        await prisma.createNotification({
          type: 'SUBSCRIPTION',
          user: {
            connect: {
              id: user.id
            }
          },
          subscriber: {
            connect: {
              id
            }
          }
        });

        const subscriberUser = await prisma.user({ id });
        const notification = new Notification(subscriberUser, {
          title: updatedUser.username
        }, 'subscription');
        await notification.push();

        if (subscriberUser.email && subscriberUser.emailNotification) {
          await notification.email();
        }

        return true;
      } catch (e) {
        return false;
      }
    }
  }
}
