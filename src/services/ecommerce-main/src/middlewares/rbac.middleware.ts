import { AuthFailureError } from "@/core";
import { RbacService } from "@/services";
import { NextFunction, Request, Response } from "express";
import { accessControllerMiddleware } from "./role.middleware";

export const grantAccess = (action: string, resource: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      accessControllerMiddleware.setGrants(
        await RbacService.findAllRoles(req.query),
      );

      const roleName = req.query.role as string;

      const permission = (accessControllerMiddleware.can(roleName) as any)[
        action as any
      ](resource);

      if (!permission.granted) {
        throw new AuthFailureError("You don't have permission.");
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};
