import { Request, Response } from "express";
import BaseController from "./BaseController";

class PublicController extends BaseController {

    constructor() {
        super();
    }

}

export default new PublicController();
