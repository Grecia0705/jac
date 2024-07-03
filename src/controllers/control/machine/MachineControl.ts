import { Request, Response } from "express";
import BaseController from "../../BaseController";
import { OnSession } from "../../../middleware/auth";
import { UserCompleted } from "../../../type/user.d";
import { MachineCreate } from "../../../type/machine.d";
import MachineModel from "../../../models/control/machine/MachineModel";
import { Languaje, TypesFlash } from "../../../var";

class MachineController extends BaseController {
    // private model = MachineModel;

    constructor() {
        super();
    }

    // public async RenderDashboard(req: Request, res: Response) {
    //     // const 

    //     const Params = {};
    //     return res.render(`s/control/machine/dashboard.hbs`, Params)
    // }

    public async RenderList(req: Request, res: Response) {

        const pag = req.query.pag | 0;
        const limit = req.query.limit | 10;

        const machine = MachineModel.GetPagination({pag, limit});
        const countPromise = MachineModel.CountAll();

        const Params = {
            list: await machine,
            next: `/machine/?pag=${pag+1}`,
            previous: pag == 0 ? null : `/machine/?pag=${pag-1}`,
            count: await countPromise,

            nowTotal: ``,
            requirePagination: false,
            nowPath: pag,
            nowPathOne: pag!=0 ? true : false,
            nowPathEnd: false,
        }

        Params.nowTotal = `${Params.list.length+(pag*10)} / ${Params.count}`;
        Params.nowPathEnd = (Params.list.length-9)>0 ? true : false;
        
        Params.requirePagination = Params.count > 10 ? true : false;

        return res.render(`s/control/machine/list.hbs`, Params)
    }
    
    public async RenderCreate(req: Request, res: Response) {
        const Params = {};
        return res.render(`s/control/machine/create.hbs`, Params)
    }

    public async RenderUpdate(req: Request, res: Response) {
        const id = req.params.id;
        const data = MachineModel.GetById({id});
        const Params = {
            data: await data
        }
        return res.render(`s/control/machine/update.hbs`, Params)
    }

    public async CreatePost(req: Request, res: Response) {
        try {
            const user = req.user as UserCompleted;
            const {name, description} = req.body;

            const data: MachineCreate = {name,description, createId:user.userId};
            await MachineModel.Create({data});

            req.flash(TypesFlash.success, Languaje.messages.success.create)
            return res.redirect(`/control/machine`);

        } catch (error) {
            console.log(error);
            req.flash(TypesFlash.error, Languaje.messages.danger.create)
            return res.redirect(`/control/machine`);
        }
    }

    public async UpdatePost(req: Request, res: Response) {
        try {
            const user = req.user as UserCompleted;
            const id = req.params.id;
            const {name, description} = req.body;

            const data: MachineCreate = {name,description, createId:user.userId};
            await MachineModel.Update({ id, data });
            
            req.flash(TypesFlash.success, Languaje.messages.success.create)
            return res.redirect(`/control/machine`);

        } catch (error) {
            console.log(error);
            req.flash(TypesFlash.error, Languaje.messages.danger.create)
            return res.redirect(`/control/machine`);
        }
    }

    public async AddDeleteAt(req: Request, res: Response) {
        const id = req.params.id;
        const result = MachineModel.AtDelete({ id });
        req.flash(`succ`, `Maquina eliminada`);
        return res.redirect(`/control/machine`);
    }

    public LoadRoutes() {
        // this.router.get(`${this.pathUrl}`, OnSession, this.RenderDashboard);
        this.router.get(`/control/machine/`, OnSession, this.RenderList);
        this.router.get(`/control/machine/create`, OnSession, this.RenderCreate);
        this.router.get(`/control/machine/update/:id`, OnSession, this.RenderUpdate);

        this.router.post(`/control/machine/create`, OnSession, this.CreatePost);
        this.router.post(`/control/machine/delete/:id`, OnSession, this.AddDeleteAt);
        this.router.post(`/control/machine/update/:id`, OnSession, this.UpdatePost);

        return this.router;
    }
}

export default new MachineController();
