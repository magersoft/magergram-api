import { unlinkSync } from 'fs';
import { isAuthenticated } from '../../../middlewares';

const UPLOAD_DIR = process.cwd() + '/uploads';

export default {
  Mutation: {
    fileDelete: (_, args, { request }) => {
      isAuthenticated(request);
      const { filename } = args;
      try {
        unlinkSync(`${UPLOAD_DIR}/${filename}`);
        return true;
      } catch (e) {
        console.error(e);
      }
      return false;
    }
  }
}
