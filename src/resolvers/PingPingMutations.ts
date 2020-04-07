import _ from "lodash";

import ResolverMap from "./ResolverMap";
import { RegisterDeviceInput } from "../types/Request";
import { RegisterDeviceResponse } from "../types/Response";
import Context from "./Context";
import ValidationError from "../errors/ValidationError";
import { User, Device, AuthToken, AuthTokenKind } from "../models/User";
import auth from "../lib/auth";

const PingPingMutations: ResolverMap = {
  async registerDevice(
    root: any,
    args: RegisterDeviceInput,
    context: Context
  ): Promise<RegisterDeviceResponse> {
    if (args.deviceId.length < 12) {
      throw new ValidationError("device is should be at least 12 characters");
    }

    const userFound = await User.findOne({ devices: { id: args.deviceId } });

    if (userFound) {
      return {
        user: _.pick(userFound, ['profile']),
        ..._.last(userFound.tokens)
      }
    }

    const user = await User.create({});
    const device: Device = { id: args.deviceId };
    const token: AuthToken = {
      deviceId: args.deviceId,
      kind: AuthTokenKind.auth,
      validUntil: null,
      accessToken: await auth.signToken(user),
    };

    user.tokens.push(token);
    user.devices.push(device);

    return { accessToken: token.accessToken, user: _.pick(userFound, ['profile']), };
  },
};

export default PingPingMutations;
