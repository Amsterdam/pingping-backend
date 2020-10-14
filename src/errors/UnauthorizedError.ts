class UnauthorizedError extends Error {
  constructor(message: string = 'unauthorized') {
      super(message);
      Object.setPrototypeOf(this, new.target.prototype);
  }
}

export default UnauthorizedError
