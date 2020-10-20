class NoPermissionError extends Error {
  constructor(message: string = 'no_permission') {
      super(message);
      Object.setPrototypeOf(this, new.target.prototype);
  }
}

export default NoPermissionError
