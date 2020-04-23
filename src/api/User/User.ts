import { prisma, User, Post, Like, Room, Notification } from '../../generated/prisma-client';

export default {
  User: {
    posts: ({ id }): Post[] => prisma.user({ id }).posts({ orderBy: 'createdAt_DESC' }),
    following: ({ id }): User[] => prisma.user({ id }).following(),
    followers: ({ id }): User[] => prisma.user({ id }).followers(),
    likes: ({ id }): Like[] => prisma.user({ id }).likes(),
    comments: ({ id }): Comment[] => prisma.user({ id }).comments(),
    rooms: ({ id }): Room[] => prisma.user({ id }).rooms(),
    notifications: ({ id }): Notification[] => prisma.user({ id }).notifications(),
    postsCount: ({ id }): Promise<number> => prisma.postsConnection({
      where: {
        user: { id }
      }
    }).aggregate().count(),
    followingCount: ({ id }): Promise<number> => prisma.usersConnection({
      where: {
        followers_some: { id }
      }
    }).aggregate().count(),
    followersCount: ({ id }): Promise<number> => prisma.usersConnection({
      where: {
        following_some: { id }
      }
    }).aggregate().count(),
    newNotificationsCount: ({ id }): Promise<number> => prisma.notificationsConnection({
      where: {
        user: { id },
        showed: false
      }
    }).aggregate().count(),
    newMessagesCount: ({ id }): Promise<number> => prisma.messagesConnection({
      where: {
        to: { id },
        read: false
      }
    }).aggregate().count(),
    fullName: (parent: User): string => {
      return `${parent.firstName} ${parent.lastName}`
    },
    isFollowing: async (parent: User, _, { request }): Promise<boolean> => {
      const { user } = request;
      const { id: parentId } = parent;
      try {
        return await prisma.$exists.user({
          AND: [
            { id: user.id },
            { following_some: { id: parentId } }
          ]
        });
      } catch (e) {
        return false;
      }
    },
    isSelf: (parent: User, _, { request }): boolean => {
      const { user } = request;
      const { id: parentId } = parent;
      return user.id === parentId;
    },
    isRequestingSubscription: async (parent: User, _, { request }): Promise<boolean> => {
      const { user } = request;
      const { id: parentId } = parent;
      try {
        return await prisma.$exists.notification({
          AND: [
            { type: 'SUBSCRIPTION' },
            { requesting: true },
            { user: { id: parentId } },
            { subscriber: { id: user.id } }
          ]
        });
      } catch (e) {
        console.error(e);
        return false
      }
    }
  }
}
