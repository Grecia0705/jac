
import { NextFunction, Request, Response } from "express";
import BaseController from "../BaseController";
import passport from "passport";

class AuthController extends BaseController {

    public async LoginRender(req: Request, res: Response) {
        // const result = await StockModel.StaticticsAll({});
        // console.log(result);
        return res.render(`p/login.hbs`);
    }

    public async LoginController(req: Request, res: Response, next: NextFunction) {
        passport.authenticate("local.login", {
            successRedirect: "/dashboard",
            failureRedirect: "/login",
            failureFlash: true
        })(req, res, next);
    }

    public LoadRouters() {
        this.router.get(`/login`, this.LoginRender);
        this.router.post(`/login`, this.LoginController);

        return this.router;
    }

}

export default new AuthController();

