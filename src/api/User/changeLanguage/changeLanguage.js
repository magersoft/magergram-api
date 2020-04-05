import { isAuthenticated } from '../../../middlewares';
import { prisma } from '../../../../generated/prisma-client';

export default {
  Mutation: {
    changeLanguage: async (_, { lang }, { request }) => {
      isAuthenticated(request);
      const { user } = request;
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
