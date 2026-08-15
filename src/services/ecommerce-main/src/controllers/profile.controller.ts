import { SuccessResponse } from "@/core";
import { Request, Response } from "express";

const dataProfiles = [
  {
    id: 1,
    name: "messi",
    avatar: "image.com/user/1",
  },
  {
    id: 2,
    name: "ronaldo",
    avatar: "image.com/user/2",
  },
  {
    id: 3,
    name: "neymar",
    avatar: "image.com/user/3",
  },
  {
    id: 4,
    name: "khai",
    avatar: "image.com/user/4",
  },
];

class ProfileController {
  findAll = async (req: Request, res: Response) => {
    return new SuccessResponse({
      message: "Profiles fetched successfully",
      status: 200,
      metadata: dataProfiles,
    }).send(res);
  };

  findOne = async (req: Request, res: Response) => {
    return new SuccessResponse({
      message: "Profile fetched successfully",
      status: 200,
      metadata: dataProfiles.find(
        (profile) => profile.id === Number(req.query.id),
      ),
    }).send(res);
  };
}

export default new ProfileController();
