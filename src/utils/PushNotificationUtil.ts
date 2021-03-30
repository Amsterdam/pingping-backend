import PushNotifications from 'node-pushnotifications';

export class PushNotificationUtil {
  static getPayload(title: string, body: string, custom: object = {}): PushNotifications.Data | any {
    return {
      title,
      topic: 'org.reactjs.native.gemeente.pingpingNative',
      body,
      sound: 'default',
      custom,
      priority: 'high',
      contentAvailable: true, // gcm, apn. node-apn will translate true to 1 as required by apn.
      delayWhileIdle: true, // gcm for android
      dryRun: false, // gcm for android
      badge: 0,
      alert: {
        title,
        body,
      },
      silent: false, // apn, will override badge, sound, alert and priority if set to true
      truncateAtWordEnd: true, // apn and gcm for ios
      pushType: 'alert',
    };
  }
  static async send(tokens: Array<string>, payload: PushNotifications.Data) {
    const APNS_P8 = process.env.APNS_P8 || '';

    const settings = {
      gcm: {
        id: process.env.FCM_API_KEY,
        phonegap: false,
      },
      apn: {
        token: {
          key: APNS_P8.replace(/\\n/g, '\n'),
          keyId: process.env.APNS_KEY_ID,
          teamId: process.env.APNS_TEAM_ID,
        },
        production: true,
      },
    };

    const push = new PushNotifications(settings);

    try {
      await push.send(tokens, payload);
    } catch (e) {
      console.error(e);
    }
  }
}
