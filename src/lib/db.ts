import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

mongoose.set('useFindAndModify', true);

class db {
  static async connect() {
    console.log('Setting up mongodb connection...');
    return await mongoose
      .connect(process.env.MONGO_STRING + '?authMechanism=SCRAM-SHA-1', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
      })
      .then((data) => {
        console.log('DB Connection set up');
        return data;
      })
      .catch((e) => {
        console.error(e);
        return e;
      });
  }
}

export default db;
