import { prisma } from '../../../../generated/prisma-client';

export default {
  Query: {
    searchUsers: async (_, args) => prisma.users({
      where: {
        OR: [
          { username_starts_with: args.term },
          { firstName_starts_with: args.term },
          { lastName_starts_with: args.term },
        ]
      }
    })
  }
}
