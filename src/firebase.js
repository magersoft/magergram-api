import * as firebase from 'firebase-admin';

const uuid = require('uuid-v4');
const privateKey = require('./firebase_key');

const {
  FIREBASE_PROJECT_ID,
  FIREBASE_KEY_ID,
  FIREBASE_CLIENT_EMAIL,
  FIREBASE_CLIENT_ID,
  FIREBASE_CLIENT_AUTH_URL
} = process.env;

const serviceAccount = {
  'type': 'service_account',
  'project_id': FIREBASE_PROJECT_ID,
  'private_key_id': FIREBASE_KEY_ID,
  'private_key': privateKey['private_key'],
  'client_email': FIREBASE_CLIENT_EMAIL,
  'client_id': FIREBASE_CLIENT_ID,
  'auth_uri': 'https://accounts.google.com/o/oauth2/auth',
  'token_uri': 'https://oauth2.googleapis.com/token',
  'auth_provider_x509_cert_url': 'https://www.googleapis.com/oauth2/v1/certs',
  'client_x509_cert_url': FIREBASE_CLIENT_AUTH_URL
};

firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount),
  storageBucket: process.env.STORAGE_BUCKET
});

const bucket = firebase.storage().bucket();

export { bucket, uuid };
