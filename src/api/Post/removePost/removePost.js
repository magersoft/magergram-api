import { unlinkSync } from "fs";
import { isAuthenticated } from '../../../middlewares';
import { prisma } from '../../../../generated/prisma-client';

const UPLOAD_DIR = process.cwd() + '/uploads';

export default {
  Mutation: {
    removePost: async (_, { id }, { request }) => {
      isAuthenticated(request);
      try {
        const files = await prisma.post({ id }).files();
        await prisma.deletePost({ id });
        files.forEach(file => {
          try {
            const filename = file.url.replace('/static/', '');
            unlinkSync(`${UPLOAD_DIR}/${filename}`);
          } catch (e) {
            console.error(e.message);
            return false;
          }
        });
        return true;
      } catch (e) {
        console.error(e.message);
        return false;
      }
    }
  }
}
