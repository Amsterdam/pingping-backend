export type RegisterDeviceResponse = {
  accessToken: string
  user: {
    profile: {
      dateOfBirth: Date
    }
  }
}