// Environments
export const ENV_DEVELOPMENT = 'development';
export const ENV_TEST = 'test';
export const ENV_ACCEPTANCE = 'acceptance';
export const ENV_PRODUCTION = 'production';

// Admin
export const ADMIN_EMAIL = 'ADMIN_EMAIL';
export const ADMIN_PASSWORD = 'ADMIN_PASSWORD';

// Database
export const MONGO_STRING = 'MONGO_STRING';

// Security
export const SECRET = 'SECRET';
export const TOKEN_VALIDITY_MINUTES = 'TOKEN_VALIDITY_MINUTES';

// APN
export const APNS_P8 = 'APNS_P8';
export const APNS_KEY_ID = 'APNS_KEY_ID';
export const APNS_TEAM_ID = 'APNS_TEAM_ID';
export const FCM_API_KEY = 'FCM_API_KEY';

// Misc
export const SENDGRID_API_KEY = 'SENDGRID_API_KEY';
export const ENVIRONMENT = 'ENVIRONMENT';
export const CONTACT_EMAIL = 'CONTACT_EMAIL';

export const REQUIRED_CONFIG = [
  ADMIN_EMAIL,
  ADMIN_PASSWORD,
  MONGO_STRING,
  SECRET,
  TOKEN_VALIDITY_MINUTES,
  APNS_P8,
  APNS_KEY_ID,
  APNS_TEAM_ID,
  FCM_API_KEY,
  SENDGRID_API_KEY,
  ENVIRONMENT,
  CONTACT_EMAIL,
];

export default class Config {
  static assertConfig(): void | never {
    const missing: Array<string> = REQUIRED_CONFIG.filter((key: string) => {
      if (process.env[key]) {
        return false;
      }

      return true;
    });

    if (missing.length) {
      throw new Error(`Missing config: ${missing.join(', ')}`);
    }
  }
}
