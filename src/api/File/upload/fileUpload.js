import * as mkdirp from 'mkdirp';
import { createWriteStream } from 'fs';

const UPLOAD_DIR = process.cwd() + '/uploads';
const STATIC_DIR = '/static';

mkdirp.sync(UPLOAD_DIR);

const storeUpload = async ({ stream, filename }) => {
  const id = Math.random().toString(36).substr(2);
  const generateFilename = `${id}-${filename.trim()}`;
  const path = `${UPLOAD_DIR}/${generateFilename}`;

  return new Promise((resolve, reject) => {
    stream
      .pipe(createWriteStream(path))
      .on('finish', () => resolve({ id, path, generateFilename }))
      .on('error', reject);
  });
};

export default {
  Query: {
    uploads: () => {}
  },
  Mutation: {
    singleUpload: async (_, { file }) => {
      const { createReadStream, filename, mimetype, encoding } = await file;
      const stream = createReadStream();

      try {
        const { id, generateFilename } = await storeUpload({ stream, filename });
        const path = `${STATIC_DIR}/${generateFilename}`;

        return { id, filename, mimetype, encoding, path }
      } catch (e) {
        console.error(e);
      }
    }
  }
}
