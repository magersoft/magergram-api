import { prisma } from '../../../../generated/prisma-client';
import { isAuthenticated } from '../../../middlewares';

export default {
  Query: {
    recommendedUsers: async (_, __, { request }) => {
      isAuthenticated(request);
      const { user } = request;
      return await prisma.users({ where: { id_not: user.id }, last: 10 });
    }
  }
}
