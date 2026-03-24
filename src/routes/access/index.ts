import accessController from "@/controllers/access.controller";
import express from "express";

const accessRouter = express.Router();

accessRouter.post("/shop/signup", accessController.signUp);

export default accessRouter;
