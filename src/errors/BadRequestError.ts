class BadRequestError extends Error {
  constructor(message: string = 'bad_request') {
      super(message);
      Object.setPrototypeOf(this, new.target.prototype);
  }
}

export default BadRequestError