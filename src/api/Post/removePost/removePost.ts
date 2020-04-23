import { isAuthenticated } from '../../../middlewares';
import { File, prisma, User } from '../../../generated/prisma-client';
import { deleteFile } from '../../File/delete/deleteFile';

const STORAGE_BUCKET = process.env.STORAGE_BUCKET;

export default {
  Mutation: {
    removePost: async (_, { id }, { request }): Promise<boolean> => {
      isAuthenticated(request);
      const currentUser: User = request.user;
      try {
        const user: User = await prisma.post({ id }).user();
        if (user.id !== currentUser.id) {
          throw new Error('Permission denied');
        }
        const files: File[] = await prisma.post({ id }).files();
        await prisma.deleteManyNotifications({ post: { id } });
        await prisma.deletePost({ id });

        for (let i = 0; i < files.length; i++) {
          try {
            const filename = files[i].url.replace(`https://storage.googleapis.com/${STORAGE_BUCKET}/`, '');
            await deleteFile(filename);
          } catch (e) {
            console.error(e.message);
            return false;
          }
        }
        return true;
      } catch (e) {
        console.error(e.message);
        return false;
      }
    }
  }
}
