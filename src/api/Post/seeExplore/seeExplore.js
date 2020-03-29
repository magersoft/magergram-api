import { isAuthenticated } from '../../../middlewares';
import { prisma } from '../../../../generated/prisma-client';

const shuffle = array => {
  let currentIndex = array.length, temporaryValue, randomIndex;

  while (0 !== currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
};

export default {
  Query: {
    seeExplore: async (_, __, { request }) => {
      isAuthenticated(request);
      const { user } = request;
      const currentUserFollowingPostsIds = [];
      const currentUserFollowings = await prisma.user({ id: user.id }).following();
      const currentUserPosts = await prisma.user({ id: user.id }).posts();

      for (let i = 0; i < currentUserFollowings.length; i++) {
        const followingUserId = currentUserFollowings[i].id;
        const followingPosts = await prisma.user({ id: followingUserId }).posts();
        currentUserFollowingPostsIds.push(followingPosts.map(post => post.id));
      }

      const excludePostIds = [...currentUserPosts.map(post => post.id), ...currentUserFollowingPostsIds.join().split(',')];

      const posts = await prisma.posts({
        where: {
          id_not_in: excludePostIds
        }
      });

      return shuffle(posts);
    }
  }
}
