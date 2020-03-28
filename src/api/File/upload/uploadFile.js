import * as mkdirp from 'mkdirp';
import { createWriteStream, unlinkSync } from 'fs';
import { isAuthenticated } from '../../../middlewares';
import sharp from 'sharp';


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

const processedImage = async filename => {
  const optimizedFilename = `optimized-${filename}`;
  try {
    await sharp(`${UPLOAD_DIR}/${filename}`)
      .resize(1240)
      .toFile(`${UPLOAD_DIR}/${optimizedFilename}`);
    return { optimizedFilename };
  } catch (e) {
    console.error(e);
  }
};

export default {
  Query: {
    uploads: () => {}
  },
  Mutation: {
    singleUpload: async (_, { file }, { request }) => {
      isAuthenticated(request);
      const { createReadStream, filename, mimetype, encoding } = await file;
      const stream = createReadStream();

      try {
        const { id, generateFilename } = await storeUpload({ stream, filename });
        const { optimizedFilename } = await processedImage(generateFilename);
        unlinkSync(`${UPLOAD_DIR}/${generateFilename}`);

        const path = `${STATIC_DIR}/${optimizedFilename}`;

        return { id, filename, mimetype, encoding, path }
      } catch (e) {
        console.error(e);
      }
    }
  }
}
