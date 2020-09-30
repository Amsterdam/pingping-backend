import PushNotifications from 'node-pushnotifications';

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
    production: false,
  },
};

const push = new PushNotifications(settings);

export class PushNotificationUtil {
  static async send(tokens: Array<string>, title: string, body: string) {
    const custom = {
      type: 'SHOW_TEAM',
    };
    const data = {
      title,
      topic: 'org.reactjs.native.gemeente.pingpingNative',
      body,
      sound: 'default',
      custom: custom,
      priority: 'high',
      contentAvailable: true, // gcm, apn. node-apn will translate true to 1 as required by apn.
      delayWhileIdle: true, // gcm for android
      dryRun: false, // gcm for android
      badge: 1,
      alert: {
        title,
        body,
      },
      silent: false, // apn, will override badge, sound, alert and priority if set to true
      truncateAtWordEnd: true, // apn and gcm for ios
      pushType: 'alert',
    };

    try {
      await push.send(tokens, data);
    } catch (e) {
      console.error(e);
    }

    push.send(tokens, data, (err: any, result: any) => {
      if (err) {
        console.log(err);
      } else {
        console.log(result);
      }
    });
  }
}
