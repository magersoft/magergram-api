import { bucket } from '../../../firebase';
import { isAuthenticated } from '../../../middlewares';

const STORAGE_BUCKET = process.env.STORAGE_BUCKET;

export const deleteFile = async filename => {
  try {
    await bucket.file(filename).delete();
    console.log(`gs://${STORAGE_BUCKET}/${filename} deleted.`);
  } catch (e) {
    console.error(e);
  }
};

export default {
  Mutation: {
    fileDelete: async (_, args, { request }): Promise<boolean> => {
      isAuthenticated(request);
      const { src } = args;
      const filename = src.replace(`https://storage.googleapis.com/${STORAGE_BUCKET}/`, '');
      try {
        await deleteFile(filename);
        return true;
      } catch (e) {
        console.error(e);
      }
      return false;
    }
  }
}
