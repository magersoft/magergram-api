import { isAuthenticated } from '../../../middlewares';
import { prisma, User } from '../../../../generated/prisma-client';
import Notification, { INotification } from '../../../utils/Notification';

export default {
  Mutation: {
    follow: async (_, args, { request }): Promise<boolean> => {
      isAuthenticated(request);
      const { id } = args;
      const user: User = request.user;
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
              id
            }
          },
          subscriber: {
            connect: {
              id: user.id
            }
          }
        });

        const subscriberUser = await prisma.user({ id });

        if (!subscriberUser) {
          throw new Error('User not found');
        }

        const notification: INotification = new Notification(subscriberUser, {
          title: updatedUser.username
        }, 'subscription');
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
