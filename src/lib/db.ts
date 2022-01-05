import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

class db {
  static async connect() {
    console.info('Setting up mongodb connection...', process.env.ENVIRONMENT);

    return await mongoose
      .connect(process.env.MONGO_STRING)
      .then((data) => {
        console.info('DB Connection set up');
        return data;
      })
      .catch((e) => {
        console.error(e);
        return e;
      });
  }
}

export default db;
