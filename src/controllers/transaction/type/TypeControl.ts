import { Request, Response } from "express";
import BaseController from "../../BaseController";
import { OnSession } from "../../../middleware/auth";
import { UserCompleted } from "../../../type/user";
import { TypeCreate } from "../../../type/transaction";
import TypeModel from "../../../models/transacction/TypeModel";
import { Languaje, TypesFlash } from "../../../var";
import CategoryModel from "../../../models/transacction/CategoryModel";

class TypeController extends BaseController {

    constructor() {
        super()
    }

    public async RenderList(req: Request, res: Response) {
        const pag = req.query.pag | 0;
        const limit = req.query.limit | 10;

        const type = TypeModel.GetPaginationType({pag, limit});
        const countPromise = TypeModel.CountTypeAll();

        const Params = {
            list: await type,
            next: `/transaction/type/?pag=${pag+1}`,
            previous: pag == 0 ? null : `/transaction/type/?pag=${pag-1}`,
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
        return res.render(`s/transaction/type/list.hbs`, Params)
    }
    
    public async RenderCreate(req: Request, res: Response) {
        const Params = {};
        return res.render(`s/transaction/type/create.hbs`, Params)
    }

    public async RenderUpdate(req: Request, res: Response) {
        const id = req.params.id;
        const data = TypeModel.GetTypeById({id});
        const Params = {
            data: await data
        }
        return res.render(`s/transaction/type/update.hbs`, Params)
    }

    public async CreatePost(req: Request, res: Response) {
        try {
            const user = req.user as UserCompleted;
            const {name, description} = req.body;

            const data: TypeCreate = {
                name,description,
                createId:user.userId,
            };
            const descriptionHts = `Creación de Tipo, Nombre:${name} Descripción:${description}`;
            await TypeModel.CreateType({data,description:descriptionHts,userId:user.userId});

            req.flash(TypesFlash.success, Languaje.messages.success.create)
            return res.redirect(`/transaction/type`);

        } catch (error) {
            console.log(error);
            req.flash(TypesFlash.error, Languaje.messages.danger.create)
            return res.redirect(`/transaction/type`);
        }
    }

    public async UpdatePost(req: Request, res: Response) {
        try {
            const user = req.user as UserCompleted;
            const id = req.params.id;
            const {name, description} = req.body;

            const data: TypeCreate = {name,description,
                createId:user.userId,
            };
            const descriptionHts = `Actualización de Tipo, Nombre:${name} Descripción:${description}`;
            await TypeModel.UpdateType({ id, data,description:descriptionHts,userId:user.userId });
            
            req.flash(TypesFlash.success, Languaje.messages.success.create)
            return res.redirect(`/transaction/type`);

        } catch (error) {
            console.log(error);
            req.flash(TypesFlash.error, Languaje.messages.danger.create)
            return res.redirect(`/transaction/type`);
        }
    }

    public async AddDeleteAt(req: Request, res: Response) {
        const id = req.params.id;
        const user = req.user as any;
        const result = TypeModel.AtDeleteType({ id,description:`Eliminación de Tipo`,userId:user.userId });
        req.flash(`succ`, `Categoria eliminada`);
        return res.redirect(`/transaction/type/`);
    }

    public LoadRoutes() {
        // this.router.get(`/transaction/type`, OnSession, this.RenderDashboard);
        this.router.get(`/transaction/type/`, OnSession, this.RenderList);
        this.router.get(`/transaction/type/create`, OnSession, this.RenderCreate);
        this.router.get(`/transaction/type/update/:id`, OnSession, this.RenderUpdate);

        this.router.get(`/transaction/type/delete/:id`, OnSession, this.AddDeleteAt);
        this.router.post(`/transaction/type/create`, OnSession, this.CreatePost);
        this.router.post(`/transaction/type/update/:id`, OnSession, this.UpdatePost);

        return this.router;
    }
}

export default new TypeController();
