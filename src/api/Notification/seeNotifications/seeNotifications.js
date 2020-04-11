import { isAuthenticated } from '../../../middlewares';
import { prisma } from '../../../../generated/prisma-client';

export default {
  Query: {
    seeNotifications: async (_, __, { request }) => {
      isAuthenticated(request);
      const { user } = request;
      try {
        await prisma.updateManyNotifications({
          data: {
            showed: true
          },
          where: {
            user: { id: user.id }
          }
        })
        return await prisma.user({ id: user.id }).notifications({ orderBy: 'createdAt_DESC' });
      } catch (e) {
        console.error(e)
      }
    }
  }
}
