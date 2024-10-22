import { Request, Response } from "express";
import BaseController from "../BaseController";
import { OnSession } from "../../middleware/auth";
import { UserCompleted } from "../../type/user";
import { TransactionCreate } from "../../type/transaction";
import TransactionInstance from "../../models/transacction/TransactionModel";
import CategoryModel from "../../models/transacction/CategoryModel";
import TypeModel from "../../models/transacction/TypeModel";
import { Languaje, TypesFlash } from "../../var";
import StaticticsTransaction from "../../models/statictics/StaticticsTransaction";

const TransactionModel = new TransactionInstance;

class TransactionController extends BaseController {

    constructor() {
        super()
    }

    public async RenderList(req: Request, res: Response) {
        const pag = req.query.pag | 0;
        const limit = req.query.limit | 10;

        const machine = TransactionModel.GetPagination({pag, limit});
        const countPromise = TransactionModel.CountAll();

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
        return res.render(`s/transaction/list.hbs`, Params)
    }
    
    public async RenderCreate(req: Request, res: Response) {
        
        const types = TypeModel.GetPaginationType({ pag:0, limit:100 });
        const category = CategoryModel.GetPaginationCategory({ pag:0, limit:100 });

        const Params = {
            types: await types,
            category: await category
        };
        return res.render(`s/transaction/create.hbs`, Params)
    }

    public async RenderUpdate(req: Request, res: Response) {
        const id = req.params.id;
        const data = TransactionModel.GetById({id});
        const Params = {
            data: await data
        }
        return res.render(`s/transaction/update.hbs`, Params)
    }

    public async CreatePost(req: Request, res: Response) {
        try {
            const user = req.user as UserCompleted;
            const {categoryId,date,mount,typeId,description} = req.body;
            const categoryPromise = CategoryModel.GetCategoryById({ id:categoryId }); 
            
            const data: TransactionCreate = {
                description,
                categoryId,
                date,
                mount: parseFloat(mount),
                typeId,
                createId:user.userId,
            };
            const categoryModel = await CategoryModel.GetCategoryById({ id:categoryId });
            const type = await TypeModel.GetTypeById({ id:typeId });

            const descriptionHts = `Creación de Movimiento, Fecha:${date} Monto:${mount} Descripción:${description} Categoria:${categoryModel?.name} Tipo:${type?.name}`;
            
            await TransactionModel.Create({data,description:descriptionHts,userId:user.userId});

            const category = await categoryPromise;
            // console.log(category?.name, data.mount);
            await StaticticsTransaction.conectOrCreate({ name:`${category?.name}`,num:data.mount });
            await StaticticsTransaction.conectOrCreate({ name:`Transaction`,num:1, type:`TransactionMount` });

            req.flash(TypesFlash.success, Languaje.messages.success.create)
            return res.redirect(`/transaction`);

        } catch (error) {
            console.log(error);
            req.flash(TypesFlash.error, Languaje.messages.danger.create)
            return res.redirect(`/transaction`);
        }
    }

    public async UpdatePost(req: Request, res: Response) {
        try {
            const user = req.user as UserCompleted;
            const id = req.params.id;
            const {categoryId,date,mount,typeId,description} = req.body;

            const data: TransactionCreate = {
                description,
                categoryId,
                date,
                mount: parseInt(mount),
                typeId,
                createId:user.userId,
            };
            
            const category = await CategoryModel.GetCategoryById({ id:categoryId });
            const type = await TypeModel.GetTypeById({ id:typeId });

            const descriptionHts = `Actualización de Movimiento, Fecha:${date} Monto:${mount} Descripción:${description} Categoria:${category?.name} Tipo:${type?.name}`;
            await TransactionModel.Update({ id, data,description:descriptionHts,userId:user.userId });
            
            req.flash(TypesFlash.success, Languaje.messages.success.create)
            return res.redirect(`/transaction`);

        } catch (error) {
            console.log(error);
            req.flash(TypesFlash.error, Languaje.messages.danger.create)
            return res.redirect(`/transaction`);
        }
    }

    public async AddDeleteAt(req: Request, res: Response) {
        const id = req.params.id;
        const user = req.user as any;
        const result = TransactionModel.AtDeleteTransaction({ id,description:`Eliminación de Transacción`,userId:user.userId });
        req.flash(`succ`, `Transacción eliminada`);
        return res.redirect(`/transaction`);
    }

    public LoadRoutes() {
        this.router.get(`/transaction/`, OnSession, this.RenderList);
        this.router.get(`/transaction/create`, OnSession, this.RenderCreate);
        this.router.get(`/transaction/update/:id`, OnSession, this.RenderUpdate);

        this.router.post(`/transaction/create`, OnSession, this.CreatePost);
        this.router.get(`/transaction/delete/:id`, OnSession, this.AddDeleteAt);
        this.router.post(`/transaction/update/:id`, OnSession, this.UpdatePost);

        return this.router;
    }
}

export default new TransactionController();
