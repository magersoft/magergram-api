import { prisma, User } from '../../../generated/prisma-client';

export default {
  Query: {
    searchUsers: (_, args): Promise<User[]|[]> => prisma.users({
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
