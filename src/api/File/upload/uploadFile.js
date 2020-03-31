import { bucket, uuid } from '../../../firebase';
import * as mkdirp from 'mkdirp';
import { createWriteStream, unlinkSync } from 'fs';
import { isAuthenticated } from '../../../middlewares';
import sharp from 'sharp';

const UPLOAD_DIR = process.cwd() + '/uploads';
const STATIC_SERVER = process.env.STATIC_SERVER || 'http://localhost:4000';
const STATIC_DIR = 'static';
const RESIZE_PX = 1240;

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

const processedImage = async (filename, optimized) => {
  const optimizedFilename = `optimized-${filename}`;
  try {
    await sharp(`${UPLOAD_DIR}/${filename}`)
      .resize({
        width: optimized ? optimized[0] : RESIZE_PX,
        height: optimized ? optimized[1] : null
      })
      .toFile(`${UPLOAD_DIR}/${optimizedFilename}`);
    unlinkSync(`${UPLOAD_DIR}/${filename}`);
    return { optimizedFilename };
  } catch (e) {
    console.error(e);
  }
};

const uploadToStorage = async filename => {
  const path = `${UPLOAD_DIR}/${filename}`;
  const currentYearFolder = new Date().getFullYear();
  const currentMonthFolder = ('0' + (new Date().getMonth() + 1)).slice(-2);
  const destination = `uploads/${currentYearFolder}/${currentMonthFolder}/${filename}`;

  try {
    const metadata = {
      metadata: {
        firebaseStorageDownloadToken: uuid()
      },
      contentType: 'image/jpeg',
      cacheControl: 'public, max-age=31536000',
    };

    await bucket.upload(path, {
      destination,
      metadata
    });

    const url = `https://storage.googleapis.com/${process.env.STORAGE_BUCKET}/${destination}`;

    await bucket.file(destination).makePublic();

    unlinkSync(`${UPLOAD_DIR}/${filename}`);

    console.log('Uploaded for Google Cloud:', url);
    return url;
  } catch (e) {
    console.error(e);
    throw new Error(e);
  }
};

export default {
  Query: {
    uploads: () => {}
  },
  Mutation: {
    singleUpload: async (_, { file, optimized, toGoogleStorage }, { request }) => {
      isAuthenticated(request);
      const { createReadStream, filename, mimetype, encoding } = await file;
      const stream = createReadStream();

      try {
        const { id, generateFilename } = await storeUpload({ stream, filename });
        const { optimizedFilename } = await processedImage(generateFilename, optimized);

        const path = toGoogleStorage
          ? await uploadToStorage(optimizedFilename)
          : `${STATIC_SERVER}/${STATIC_DIR}/${optimizedFilename}`;

        return { id, filename, mimetype, encoding, path }
      } catch (e) {
        console.error(e);
      }
    }
  }
}
