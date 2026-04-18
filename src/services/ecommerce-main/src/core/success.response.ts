import { REASON_PHRASE, STATUS_CODE } from "@/constants";
import { Response } from "express";

export class SuccessResponse<T> {
  message: string;
  status: number;
  metadata: T;

  constructor({
    message,
    status = STATUS_CODE.OK,
    reasonPhrase = REASON_PHRASE.OK,
    metadata,
  }: {
    message: string;
    status: number;
    reasonPhrase?: string;
    metadata: T;
  }) {
    this.message = message ? message : reasonPhrase;
    this.status = status;
    this.metadata = metadata;
  }

  send(res: Response, headers = {}) {
    return res.status(this.status).json(this);
  }
}

export class OK<T> extends SuccessResponse<T> {
  constructor({ message, metadata }: { message: string; metadata: T }) {
    super({
      message,
      status: STATUS_CODE.OK,
      reasonPhrase: REASON_PHRASE.OK,
      metadata,
    });
  }
}

export class CREATED<T> extends SuccessResponse<T> {
  options: {};

  constructor({
    message,
    metadata,
    options = {},
  }: {
    message: string;
    metadata: T;
    options?: {};
  }) {
    super({
      message,
      status: STATUS_CODE.CREATED,
      reasonPhrase: REASON_PHRASE.CREATED,
      metadata,
    });

    this.options = options;
  }
}
