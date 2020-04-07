import { isAuthenticated } from '../../../middlewares';
import { prisma } from '../../../../generated/prisma-client';

export default {
  Mutation: {
    privateAccount: async (_, { state }, { request }) => {
      isAuthenticated(request);
      const { user } = request;
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
