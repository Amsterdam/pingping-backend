import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

mongoose.set('useFindAndModify', false);

class db {
  static async connect() {
    console.log('Setting up mongodb connection...', process.env.NODE_ENV);

    // const dbString =
    //   process.env.NODE_ENV === 'test' ? 'mongodb://localhost:27017/pingping_test' : process.env.MONGO_STRING;

    return await mongoose
      .connect(process.env.MONGO_STRING, {
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
