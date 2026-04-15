import { SuccessResponse } from "@/core";
import { Comment } from "@/models/comment.model";
import { CommentService } from "@/services";
import { QueryParams } from "@/types";
import { Request, Response } from "express";

class CommentController {
  create = async (req: Request, res: Response) => {
    return new SuccessResponse({
      message: "Comment created successfully",
      status: 201,
      metadata: await CommentService.create(req.body),
    }).send(res);
  };

  delete = async (req: Request, res: Response) => {
    return new SuccessResponse({
      message: "Comment deleted successfully",
      status: 200,
      metadata: await CommentService.delete(req.body),
    }).send(res);
  };

  findAllByParentId = async (req: Request, res: Response) => {
    return new SuccessResponse({
      message: "Comment created successfully",
      status: 200,
      metadata: await CommentService.findAllByParentId(
        req.query as QueryParams<Comment>,
      ),
    }).send(res);
  };
}

export default new CommentController();
