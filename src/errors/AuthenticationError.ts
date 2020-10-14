class AuthenticationError extends Error {
  constructor(message: string = 'invalid_credentials') {
      super(message);
      Object.setPrototypeOf(this, new.target.prototype);
  }
}

export default AuthenticationError