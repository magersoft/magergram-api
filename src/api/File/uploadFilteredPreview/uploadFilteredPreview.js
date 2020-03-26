import * as mkdirp from 'mkdirp';
import { createWriteStream } from 'fs';
import { isAuthenticated } from '../../../middlewares';

const UPLOAD_DIR = process.cwd() + '/uploads/filters';
const STATIC_DIR = '/static/filters';

mkdirp.sync(UPLOAD_DIR);

const storeUpload = async ({ stream, filename }) => {
  const id = Math.random().toString(36).substr(2);
  const path = `${UPLOAD_DIR}/${filename}`;

  return new Promise((resolve, reject) => {
    stream
      .pipe(createWriteStream(path))
      .on('finish', () => resolve({ id, path }))
      .on('error', reject);
  });
};

export default {
  Mutation: {
    uploadFilteredPreview: async (_, { file }, { request }) => {
      isAuthenticated(request);
      const { createReadStream, filename, mimetype, encoding } = await file;
      const stream = createReadStream();

      try {
        const { id } = await storeUpload({ stream, filename });
        const path = `${STATIC_DIR}/${filename}`;

        return { id, filename, mimetype, encoding, path }
      } catch (e) {
        console.error(e);
      }
    }
  }
}
