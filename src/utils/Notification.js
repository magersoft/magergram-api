import webPush from '../webPush';

const APP_ICON = `${process.env.CLIENT_URL}/logo192.png`;
const APP_VIBRATE = [100, 50, 100];

const DICTIONARY = {
  like: 'поставил(-а) вашему фото "Нравится"',
  comment: 'прокомментировал(-а) ваше фото',
  subscription: 'подписался(-сь) на ваши обновления',
  requestFollow: 'отправил(-а) запрос на подписку',
  confirmFollow: 'принял(-а) ваш запрос на подписку'
}

export default class Notification {
  constructor(user, payload, type) {
    this.user = user;
    this.payload = payload;
    this.type = type
  }

  async push() {
    const { subscriptionEndpoint, username } = this.user;

    if (subscriptionEndpoint) {
      const message = `${DICTIONARY[this.type]} ${this.type === 'comment' ? this.payload.comment : ''}`;
      const endpoint = JSON.parse(subscriptionEndpoint);
      const payload = JSON.stringify({
        title: this.payload.title,
        body: message,
        icon: APP_ICON,
        vibrate: APP_VIBRATE
      });

      try {
        await webPush.sendNotification(endpoint, payload);
      } catch (e) {
        console.error(e);
      }
    } else {
      console.log(`user "${username}" or client not allowed web-push notification`)
    }
  }

  email() {}

  sms() {}
}
