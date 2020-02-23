import { isAuthenticated } from '../../../middlewares';
import { prisma } from '../../../../generated/prisma-client';

export default {
  Query: {
    myProfile: async (_, __, { request }) => {
      isAuthenticated(request);
      const { user } = request;
      return await prisma.user({ id: user.id });
    }
  }
}
