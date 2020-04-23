import { isAuthenticated } from '../../../middlewares';
import { prisma, User } from '../../../generated/prisma-client';

export default {
  Mutation: {
    privateAccount: async (_, { state }, { request }): Promise<boolean> => {
      isAuthenticated(request);
      const user: User = request.user;
      try {
        await prisma.updateUser({
          data: {
            isPrivate: state
          },
          where: {
            id: user.id
          }
        });

        if (!state) {
          await prisma.deleteManyNotifications({
            AND: {
              user: { id: user.id },
              type: 'SUBSCRIPTION',
              requesting: true
            }
          })
        }

        return true;
      } catch (e) {
        console.error(e.message);
        return false;
      }
    }
  }
}
