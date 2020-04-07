import _ from "lodash";
import jwt from "jsonwebtoken";
import moment from "moment";

import AuthenticationError from "../errors/AuthenticationError";
import { UserDocument, User, AuthToken, AuthTokenKind } from '../models/User';

const TOKEN_VALIDITY_MINUTES = process.env.TOKEN_VALIDITY_MINUTES || 180;

class auth {
  static async login(username:string, password:string) {
    const user = await User.findOne({ email: username });

    const res = await  user.comparePassword(password)

    if (!res) {
      throw new AuthenticationError();
    }

    const token = await auth.createToken(user);

    return {
      accessToken: token.accessToken,
      user: _.pick(user, "id", "profile", "email")
    };
  }

  static signToken(user:UserDocument):string {
    const token = jwt.sign({ userId: user._id }, process.env.SECRET);

    return token;
  }

  static getRandomPassword(len = 8) {
    return Math.random()
      .toString(36)
      .slice(len * -1);
  }

  static async createToken(user:UserDocument): Promise<AuthToken> {

    let tokenObj:AuthToken = {
      kind: AuthTokenKind.auth,
      deviceId: null,
      accessToken: this.signToken(user),
      validUntil: moment().add(TOKEN_VALIDITY_MINUTES, "minutes").toDate()
    }

    user.tokens.push(tokenObj)
    user.save()

    return tokenObj
  }

  static async createUser(fullName:string, email:string, password:string) {
    try {
      const user = await User.create({ profile: { fullName }, email, password });

      return user;
    } catch (error) {
      if (error.name === "MongoError" && error.code === 11000) {
        throw new Error("user already exists");
      }

      throw error;
    }
  }

  static async getUser(headerToken:string) {
    let token:any;
    try {
      token = jwt.verify(headerToken, process.env.SECRET);
      const user = await this.userQuery(token.userId);

      return _.pick(user, ["id", "profile", "email"]);
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  static async userQuery(userId:string) {
    return await User.findOne({ _id: userId });
  }
}

export default auth;
