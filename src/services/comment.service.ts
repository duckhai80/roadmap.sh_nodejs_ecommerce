/* 
- Add comments (shop/user)
- Get comment list (shop/user)
- Delete a comment (admin/shop/user)
*/

import { NotFoundError } from "@/core";
import { commentModel } from "@/models";
import { Comment } from "@/models/comment.model";
import { QueryParams } from "@/types";
import { convertToObjectId, formatSelectData } from "@/utils";

class CommentService {
  static async create({
    productId,
    userId,
    parentId = null,
    content,
  }: {
    productId: string;
    userId: string;
    parentId: string | null;
    content: string;
  }) {
    const newComment = new commentModel({
      productId: convertToObjectId(productId),
      userId,
      content,
      parentId: parentId ? convertToObjectId(parentId) : null,
    });

    // Reply a comment
    if (parentId) {
      const parentComment = await commentModel.findById(
        convertToObjectId(parentId),
      );

      if (!parentComment) throw new NotFoundError("Parent comment not found");

      const parentCommentRight = parentComment.right;

      newComment.left = parentCommentRight;
      newComment.right = parentCommentRight + 1;

      // Update all comments
      await commentModel.updateMany(
        {
          productId: convertToObjectId(productId),
          right: { $gte: parentCommentRight },
        },
        { $inc: { right: 2 } },
      );
      await commentModel.updateMany(
        {
          productId: convertToObjectId(productId),
          left: { $gt: parentCommentRight },
        },
        { $inc: { left: 2 } },
      );
    }
    // Add a new root comment
    else {
      const latestComment = await commentModel
        .findOne(
          { productId: convertToObjectId(productId) },
          { right: 1 },
          { sort: { right: -1 } },
        )
        .lean();

      const maxRight = latestComment ? latestComment.right : 0;

      newComment.left = maxRight + 1;
      newComment.right = maxRight + 2;
    }

    await newComment.save();
    return newComment;
  }

  static async findAllByParentId({
    productId,
    parentId,
    limit = 50,
    skip = 0,
  }: QueryParams<Comment>) {
    if (parentId) {
      const parentComment = await commentModel.findById(
        convertToObjectId(parentId),
      );

      if (!parentComment) throw new NotFoundError("Parent comment not found");

      const comments = await commentModel
        .find({
          productId: convertToObjectId(productId),
          // If you want to get all child or just first child, toggle parentId
          // parentId: convertToObjectId(parentId),
          left: { $gt: parentComment.left },
          right: { $lt: parentComment.right },
        })
        .select(formatSelectData(["content", "parentId", "left", "right"]))
        .sort({ left: 1 })
        .limit(limit)
        .skip(skip)
        .lean();

      return comments;
    } else {
      const comments = await commentModel
        .find({
          productId: convertToObjectId(productId),
          parentId: null,
        })
        .select(formatSelectData(["content", "parentId", "left", "right"]))
        .sort({ left: 1 })
        .lean();

      return comments;
    }
  }
}

export default CommentService;
