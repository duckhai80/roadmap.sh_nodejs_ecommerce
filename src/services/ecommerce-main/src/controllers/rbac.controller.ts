import { SuccessResponse } from "@/core";
import { RbacService } from "@/services";
import { Request, Response } from "express";

class RbacController {
  createRole = async (req: Request, res: Response) => {
    return new SuccessResponse({
      message: "Role created successfully",
      status: 200,
      metadata: await RbacService.createRole(req.body),
    }).send(res);
  };

  findAllRoles = async (req: Request, res: Response) => {
    return new SuccessResponse({
      message: "Roles fetched successfully",
      status: 200,
      metadata: await RbacService.findAllRoles(req.query),
    }).send(res);
  };

  createResource = async (req: Request, res: Response) => {
    return new SuccessResponse({
      message: "Resource created successfully",
      status: 200,
      metadata: await RbacService.createResource(req.body),
    }).send(res);
  };

  findAllResources = async (req: Request, res: Response) => {
    return new SuccessResponse({
      message: "Resources fetched successfully",
      status: 200,
      metadata: await RbacService.findAllResources(req.query),
    }).send(res);
  };
}

export default new RbacController();
