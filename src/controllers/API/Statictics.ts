import BaseController from "../BaseController";
import UserModel from "../../models/user/UserModel";
import { Request, Response } from "express";
import StaticticsTransaction from "../../models/statictics/StaticticsTransaction";

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

    async APIAPIStaticsObjectYear(req: Request, res: Response) {
        const year = StaticticsTransaction.getYear();
        const type = req.query.type ? req.query.type as string : `Transaction`;
        const resultPromise = StaticticsTransaction.getForYear({limit:10,year,type});
        const label = ['En', 'Fe', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

        const series: {name:string,data: number[]}[] = [];
        const result = await resultPromise;

        result.forEach(item => {
            const data = [
                item.total_month_1,
                item.total_month_2,
                item.total_month_3,
                item.total_month_4,
                item.total_month_5,
                item.total_month_6,
                item.total_month_7,
                item.total_month_8,
                item.total_month_9,
                item.total_month_10,
                item.total_month_11,
                item.total_month_12,
            ];
            series.push({ data, name:item.objectName });
        });

        return res.json({ label, series });
    }

    public LoadRoutes() {
        
        this.router.get(`/api/statictics/foryear`, this.APIStaticsForYear);
        this.router.get(`/api/statictics/generic`, this.APIAPIStaticsObjectYear);

        return this.router;
    }

}

export default new StaticticsController();
