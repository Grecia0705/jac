import { Request, Response } from "express";
import BaseController from "../BaseController";
import { OnSession } from "../../middleware/auth";
import ControlModel from "../../models/control/ControlModel";
import { ControlCreate } from "../../type/control";
import { UserCompleted } from "../../type/user";
import RawmatterModel from "../../models/control/rawmatter/RawmatterModel";
import MachineModel from "../../models/control/machine/MachineModel";
import ProductModel from "../../models/control/product/ProductModel";
import { RawMatterCreate } from "../../type/rawmatter";
import { Languaje, TypesFlash } from "../../var";
import StaticticsTransaction from "../../models/statictics/StaticticsTransaction";


class ControlController extends BaseController {

    private view = `s/control`;
    private url = `/control`;
    private model = ControlModel;

    constructor() {
        super()
    }

    public async RenderDashboard(req: Request, res: Response) {
        // const 

        const Params = {};
        return res.render(`s/control/dashboard.hbs`, Params)
    }

    public async RenderList(req: Request, res: Response) {

        const pag = req.query.pag | 0;
        const limit = req.query.limit | 10;

        const list = ControlModel.GetPagination({pag, limit});
        const countPromise = ControlModel.CountAll();


        const Params = {
            list: await list,
            next: `/control/list/?pag=${pag+1}`,
            previous: pag == 0 ? null : `/control/list/?pag=${pag-1}`,
            count: await countPromise,

            nowTotal: ``,
            requirePagination: false,
            nowPath: pag,
            nowPathOne: pag!=0 ? true : false,
            nowPathEnd: false,
        };

        Params.nowTotal = `${Params.list.length+(pag*10)} / ${Params.count}`;
        Params.nowPathEnd = (Params.list.length-9)>0 ? true : false;
        
        Params.requirePagination = Params.count > 10 ? true : false;

        return res.render(`s/control/list.hbs`, Params)
    }
    
    public async RenderCreate(req: Request, res: Response) {

        const machine = MachineModel.GetPagination({ pag:0, limit:30 });
        const product = ProductModel.GetPagination({ pag:0, limit:30 });
        const rawmatter = RawmatterModel.GetPagination({ pag:0, limit:30 });

        const Params = {
            machineList: await machine,
            productList: await product,
            rawmatterList: await rawmatter,
        };
        return res.render(`s/control/create.hbs`, Params)
    }

    public async RenderUpdate(req: Request, res: Response) {
        const id = req.params.id;
        const data = ControlModel.GetById({id});
        const Params = {
            data: await data
        }
        console.log(Params);
        return res.render(`s/control/update.hbs`, Params)
    }

    public async CreatePost(req: Request, res: Response) {
        try {
            const user = req.user as UserCompleted;

            const {
                machineId, productId, rawmatterId,
                date,
                kg, gr,
            } = req.body;

            const data: ControlCreate = {
                date,
                gr: parseInt(gr),
                kg: parseInt(kg),
                machineId,
                productId,
                rawmatterId,
                createId:user.userId,                
            };

            const machinePromise = MachineModel.GetById({ id:data.machineId });
            const producPromise = ProductModel.GetById({ id:data.productId });
            // const rawmatterPromise = RawmatterModel.GetById({ id:data.rawmatterId });

            const createPromise = ControlModel.Create({data});
            const raw = await RawmatterModel.GetById({ id: data.rawmatterId });
            if(raw != null) {
                raw.kg -= Number(kg);
                raw.gr -= Number(gr);

                const UpdateRaw:RawMatterCreate = {
                    code: raw.code,
                    createId: raw.createId,
                    description: raw.description ? raw.description : ``,
                    gr: raw.gr,
                    kg: raw.gr,
                    name: raw.name
                } 

                await StaticticsTransaction.conectOrCreate({ name:`${raw.name}`,num:1, type:`Rawmatter` });
                await RawmatterModel.Update({ id:raw.rawmatterId, data:UpdateRaw });
            }

            const machine = await machinePromise;
            const product = await producPromise;
            
            await StaticticsTransaction.conectOrCreate({ name:`Control`,num:1, type:`Control` });
            await StaticticsTransaction.conectOrCreate({ name:`${machine?.name}`,num:1, type:`Machine` });
            await StaticticsTransaction.conectOrCreate({ name:`${product?.name}`,num:1, type:`Product` });

            await createPromise;

            req.flash(TypesFlash.success, Languaje.messages.success.create)
            return res.redirect(`/control`);

        } catch (error) {
            console.log(error);
            req.flash(TypesFlash.error, Languaje.messages.danger.create)
            return res.redirect(`/control`);
        }
    }

    public async UpdatePost(req: Request, res: Response) {
        try {
            const user = req.user as UserCompleted;
            const id = req.params.id;

            const {
                machineId, productId, rawmatterId,
                date,
                kg, gr
            } = req.body;

            const data: ControlCreate = {
                date,
                gr: parseInt(gr),
                kg: parseInt(kg),
                machineId,
                productId,
                rawmatterId,
                createId:user.userId,                
            };

            await ControlModel.Update({ id, data });
            
            req.flash(TypesFlash.success, Languaje.messages.success.create)
            return res.redirect(`/control/list`);

        } catch (error) {
            console.log(error);
            req.flash(TypesFlash.error, Languaje.messages.danger.create)
            return res.redirect(`/control/list`);
        }
    }


    public LoadRoutes() {
        this.router.get(`/control`, OnSession, this.RenderList);
        this.router.get(`/control/list`, OnSession, this.RenderList);
        this.router.get(`/control/create`, OnSession, this.RenderCreate);
        this.router.get(`/control/update/:id`, OnSession, this.RenderUpdate);

        this.router.post(`/control/create`, OnSession, this.CreatePost);
        this.router.post(`/control/update/:id`, OnSession, this.UpdatePost);

        return this.router;
    }
}

export default new ControlController();
