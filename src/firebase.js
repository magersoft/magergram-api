import * as firebase from 'firebase-admin';

const uuid = require('uuid-v4');
const privateKey = require('./firebase_key');

const {
  FIREBASE_TYPE,
  FIREBASE_PROJECT_ID,
  FIREBASE_KEY_ID,
  FIREBASE_CLIENT_EMAIL,
  FIREBASE_CLIENT_ID,
  FIREBASE_AUTH_URI,
  FIREBASE_TOKEN_URI,
  FIREBASE_AUTH_PROVIDER_URL,
  FIREBASE_CLIENT_AUTH_URL
} = process.env;

const serviceAccount = {
  "type": FIREBASE_TYPE,
  "project_id": FIREBASE_PROJECT_ID,
  "private_key_id": FIREBASE_KEY_ID,
  "private_key": privateKey['private_key'],
  "client_email": FIREBASE_CLIENT_EMAIL,
  "client_id": FIREBASE_CLIENT_ID,
  "auth_uri": FIREBASE_AUTH_URI,
  "token_uri": FIREBASE_TOKEN_URI,
  "auth_provider_x509_cert_url": FIREBASE_AUTH_PROVIDER_URL,
  "client_x509_cert_url": FIREBASE_CLIENT_AUTH_URL
};

firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount),
  storageBucket: process.env.STORAGE_BUCKET
});

const bucket = firebase.storage().bucket();

export { bucket, uuid };
