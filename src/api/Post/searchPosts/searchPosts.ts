import { Post, prisma } from '../../../generated/prisma-client';

export default {
  Query: {
    searchPosts: async (_, args): Promise<Post[]> => prisma.posts({
      where: {
        OR: [
          { location_contains: args.term },
          { caption_contains: args.term },
        ]
      }
    })
  }
}
