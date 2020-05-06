import { isAuthenticated } from '../../../middlewares';
import { prisma, User } from '../../../generated/prisma-client';

export default {
  Mutation: {
    setIpData: async (_, { ipdata }, { request }): Promise<boolean> => {
      isAuthenticated(request);
      const user: User = request.user;
      try {
        await prisma.updateUser({
          where: {
            id: user.id
          },
          data: {
            ipdata,
            latestOnline: new Date()
          }
        });
        return true;
      } catch (e) {
        console.error(e.message);
        return false;
      }
    }
  }
}
