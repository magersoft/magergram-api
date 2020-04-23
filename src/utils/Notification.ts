import webPush from '../webPush';
import nodemailer from 'nodemailer';
import sgTransport from 'nodemailer-sendgrid-transport';
import { User } from '../../generated/prisma-client';

type NotificationType = 'like' | 'comment' | 'subscription' | 'requestFollow' | 'confirmFollow' | 'newPost';

interface INotificationType {
  like: string,
  comment: string,
  subscription: string,
  requestFollow: string,
  confirmFollow: string,
  newPost: string
}

export interface INotification {
  user: User;
  payload: any;
  type: NotificationType;
  push(): Promise<any>
  email(): void
  sms(): void
}

const APP_ICON: string = `${process.env.CLIENT_URL}/logo192.png`;
const APP_VIBRATE: number[] = [100, 50, 100];

const DICTIONARY: INotificationType = {
  like: 'поставил(-а) вашему фото "Нравится"',
  comment: 'прокомментировал(-а) ваше фото',
  subscription: 'подписался(-сь) на ваши обновления',
  requestFollow: 'отправил(-а) запрос на подписку',
  confirmFollow: 'принял(-а) ваш запрос на подписку',
  newPost: 'опубликовал(-а) новую публикацию'
}

const ICON: INotificationType = {
  like: '❤️',
  comment: '📝',
  subscription: '👤',
  requestFollow: '✉️',
  confirmFollow: '✅',
  newPost: '🏞'
}

export default class Notification implements INotification {
  user: User;
  payload: any;
  type: NotificationType

  constructor(user, payload, type) {
    this.user = user;
    this.payload = payload;
    this.type = type
  }

  async push(): Promise<void> {
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

  email(): void {
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
