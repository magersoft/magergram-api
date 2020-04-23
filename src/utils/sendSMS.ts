import Twilio from 'twilio';

const twilioClient = Twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);

const sendSMS = (to: string, body: string) => twilioClient.messages.create({
  body,
  to,
  from: process.env.TWILIO_PHONE
});

export const isValidPhone = /\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/;

export const sendVerificationSMS = (to: string, key: string) => sendSMS(`+${to}`, `Magergram! You verification key is: ${key}`);
