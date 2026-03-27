import { ReasonPhrase, StatusCode } from "@/constants";
import { Response } from "express";

export class SuccessResponse {
  message: string;
  status: number;
  metadata: any;

  constructor({
    message,
    status = StatusCode.OK,
    reasonPhrase = ReasonPhrase.OK,
    metadata,
  }: {
    message: string;
    status: number;
    reasonPhrase?: string;
    metadata: any;
  }) {
    this.message = message ? message : reasonPhrase;
    this.status = status;
    this.metadata = metadata;
  }

  send(res: Response, headers = {}) {
    return res.status(this.status).json(this);
  }
}

export class OK extends SuccessResponse {
  constructor({ message, metadata }: { message: string; metadata: any }) {
    super({
      message,
      status: StatusCode.OK,
      reasonPhrase: ReasonPhrase.OK,
      metadata,
    });
  }
}

export class CREATED extends SuccessResponse {
  options: {};

  constructor({
    message,
    metadata,
    options = {},
  }: {
    message: string;
    metadata: any;
    options: {};
  }) {
    super({
      message,
      status: StatusCode.CREATED,
      reasonPhrase: ReasonPhrase.CREATED,
      metadata,
    });

    this.options = options;
  }
}
