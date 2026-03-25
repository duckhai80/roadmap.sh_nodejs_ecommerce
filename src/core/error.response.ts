import { ReasonPhrase, StatusCode } from "@/constants";

export class ErrorResponse extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);

    this.status = status;

    // Object.setPrototypeOf(this, ErrorResponse.prototype);
  }
}

export class ConfigRequestError extends ErrorResponse {
  constructor(
    message: string = ReasonPhrase.CONFLICT,
    status: number = StatusCode.CONFLICT,
  ) {
    super(message, status);
  }
}

export class BadRequestError extends ErrorResponse {
  constructor(
    message: string = ReasonPhrase.BAD_REQUEST,
    status: number = StatusCode.BAD_REQUEST,
  ) {
    super(message, status);
  }
}
