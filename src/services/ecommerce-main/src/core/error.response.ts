import { REASON_PHRASE, STATUS_CODE } from "@/constants";

export class ErrorResponse extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);

    this.status = status;

    Object.setPrototypeOf(this, ErrorResponse.prototype);
  }
}

export class ConfigRequestError extends ErrorResponse {
  constructor(
    message: string = REASON_PHRASE.CONFLICT,
    status: number = STATUS_CODE.CONFLICT,
  ) {
    super(message, status);
  }
}

export class BadRequestError extends ErrorResponse {
  constructor(
    message: string = REASON_PHRASE.BAD_REQUEST,
    status: number = STATUS_CODE.BAD_REQUEST,
  ) {
    super(message, status);
  }
}

export class NotFoundError extends ErrorResponse {
  constructor(
    message: string = REASON_PHRASE.NOT_FOUND,
    status: number = STATUS_CODE.NOT_FOUND,
  ) {
    super(message, status);
  }
}

export class AuthFailureError extends ErrorResponse {
  constructor(
    message: string = REASON_PHRASE.UNAUTHORIZED,
    status: number = STATUS_CODE.UNAUTHORIZED,
  ) {
    super(message, status);
  }
}

export class ForbiddenError extends ErrorResponse {
  constructor(
    message: string = REASON_PHRASE.FORBIDDEN,
    status: number = STATUS_CODE.FORBIDDEN,
  ) {
    super(message, status);
  }
}
