import NodeCache from 'node-cache';

const IP_TTL = 60 * 60;
const USERNAME_TTL = 30 * 60;

const IP_PRE = 'ip-';
const USERNAME_PRE = 'u-';
const LAST_ACTIVE_PRE = 'la-';

export class Cache {
  private cache: any;

  constructor() {
    this.cache = new NodeCache();
  }

  getIp(ip: string) {
    let key = `${IP_PRE}${ip}`;

    return this.cache.get(key) || 0;
  }

  registerIp(ip: string) {
    let key = `${IP_PRE}${ip}`;
    let current = this.cache.get(key) || 0;
    let val = current + 1;

    this.cache.set(key, val, IP_TTL);

    return val;
  }

  registerLastActive(userId: string) {
    let key = `${LAST_ACTIVE_PRE}${userId}`;

    this.cache.set(key, new Date().toString());
  }

  registerUsername(username: string) {
    let key = `${USERNAME_PRE}${username}`;
    let current = this.cache.get(key) || 0;
    let val = current + 1;

    this.cache.set(key, val, USERNAME_TTL);

    return val;
  }

  getUsername(username: string) {
    let key = `${USERNAME_PRE}${username}`;

    return this.cache.get(key) || 0;
  }
}

export default new Cache();
