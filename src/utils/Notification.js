import webPush from '../webPush';
import nodemailer from 'nodemailer';
import sgTransport from 'nodemailer-sendgrid-transport';

const APP_ICON = `${process.env.CLIENT_URL}/logo192.png`;
const APP_VIBRATE = [100, 50, 100];

const DICTIONARY = {
  like: 'поставил(-а) вашему фото "Нравится"',
  comment: 'прокомментировал(-а) ваше фото',
  subscription: 'подписался(-сь) на ваши обновления',
  requestFollow: 'отправил(-а) запрос на подписку',
  confirmFollow: 'принял(-а) ваш запрос на подписку',
  newPost: 'опубликовал(-а) новую публикацию'
}

const ICON = {
  like: '❤️',
  comment: '📝',
  subscription: '👤',
  requestFollow: '✉️',
  confirmFollow: '✅',
  newPost: '🏞'
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

  email() {
    if (this.user.email) {
      const options = {
        auth: {
          api_user: process.env.SENDGRID_USERNAME,
          api_key: process.env.SENDGRID_PASSWORD
        }
      };
      const client = nodemailer.createTransport(sgTransport(options));
      const email = {
        from: 'push@magergram.com',
        to: this.user.email,
        subject: `${ICON[this.type]} Magergram Notification`,
        html: `${this.payload.title} ${DICTIONARY[this.type]} <br />
               ${this.type === 'comment' ? this.payload.comment : ''}<br />
               Чтобы посмотреть это уведомление авторизуйтесь в приложении Magergram<br /><br /><br />
               <a href="${process.env.CLIENT_URL}">Войти в приложение</a>`
      }
      client.sendMail(email);
    } else {
      console.log(`user ${this.user.username} not use email`);
    }
  }

  sms() {}
}
