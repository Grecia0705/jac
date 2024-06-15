import BaseController from "../BaseController";
import UserModel from "../../models/user/UserModel";
import { Request, Response } from "express";

class StaticticsController extends BaseController {
    
    // estadisticas por year
    async APIStaticsForYear(req: Request, res: Response) {
        const {year} = req.query;
        let yearSend = year;
        if(!year) {
            const date = new Date();
            yearSend = date.getFullYear();
        }

        // const response = await UserModel.GetStatcticByYear({ year:Number(yearSend) });
        return res.json({ body:[] });
    }

    public LoadRoutes() {
        
        this.router.get(`/api/statictics/foryear`, this.APIStaticsForYear);

        return this.router;
    }

}

export default new StaticticsController();
