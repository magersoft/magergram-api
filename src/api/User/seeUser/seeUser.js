import { isAuthenticated } from '../../../middlewares';
import { prisma } from '../../../../generated/prisma-client';

export default {
  Query: {
    seeUser: async (_, args, { request }) => {
      isAuthenticated(request);
      const { id } = args;
      return await prisma.user({ id });
    }
  }
}
