import { Favorite, prisma } from '../../generated/prisma-client';

export default {
  Favorite: {
    post: ({ id }): Favorite[] => prisma.favorite({ id }).post()
  }
}
