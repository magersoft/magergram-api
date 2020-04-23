import { isAuthenticated } from '../../../middlewares';
import { prisma, User } from '../../../../generated/prisma-client';

export default {
  Query: {
    seeUsersForMessage: async (_, __, { request }): Promise<User[]> => {
      isAuthenticated(request);
      const { user } = request;
      const followers = await prisma.user({ id: user.id }).followers();
      const following = await prisma.user({ id: user.id }).following();
      return followers
        .filter(followersItem =>
          !following.find(followingItem => followingItem['id'] === followersItem['id']))
        .concat(following);
    }
  }
}
