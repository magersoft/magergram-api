import webpush from 'web-push';

webpush.setGCMAPIKey(process.env.FIREBASE_PUSH_TOKEN);
webpush.setVapidDetails(process.env.WEB_PUSH_CONTACT, process.env.PUBLIC_VAPID_KEY, process.env.PRIVATE_VAPID_KEY);

export default webpush;
