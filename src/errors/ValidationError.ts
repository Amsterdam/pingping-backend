class ValidationError extends Error {
  constructor(message: string = 'validation_error') {
      super(message);
      Object.setPrototypeOf(this, new.target.prototype);
  }
}

export default ValidationError
