import { isAuthenticated } from '../../../middlewares';
import { Post, prisma, User } from '../../../../generated/prisma-client';

const shuffle = (array): [] => {
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
    seeExplore: async (_, __, { request }): Promise<Post[]> => {
      isAuthenticated(request);
      const user: User = request.user;
      const currentUserFollowingPostsIds = [];
      const currentUserFollowings = await prisma.user({ id: user.id }).following();
      const currentUserPosts = await prisma.user({ id: user.id }).posts();

      for (let i = 0; i < currentUserFollowings.length; i++) {
        const followingUserId = currentUserFollowings[i].id;
        const followingPosts: Post[] = await prisma.user({ id: followingUserId }).posts();
        // @ts-ignore
        currentUserFollowingPostsIds.push(followingPosts.map(post => post.id));
      }

      const excludePostIds = [...currentUserPosts.map(post => post.id), ...currentUserFollowingPostsIds.join().split(',')];

      const posts: Post[] = await prisma.posts({
        where: {
          id_not_in: excludePostIds,
          user: {
            isPrivate: false
          }
        }
      });

      return shuffle(posts);
    }
  }
}
