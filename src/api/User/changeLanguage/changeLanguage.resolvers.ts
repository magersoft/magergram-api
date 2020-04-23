import { isAuthenticated } from '../../../middlewares';
import { prisma, User } from '../../../generated/prisma-client';

export default {
  Mutation: {
    changeLanguage: async (_, { lang }, { request }): Promise<boolean> => {
      isAuthenticated(request);
      const user: User = request.user;
      try {
        await prisma.updateUser({
          data: { language: lang },
          where: { id: user.id }
        });
        return true;
      } catch (e) {
        console.error(e.message);
        return false;
      }
    }
  }
}
