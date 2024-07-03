import { Request, Response } from "express";
import BaseController from "../../BaseController";
import { OnSession } from "../../../middleware/auth";
import { UserCompleted } from "../../../type/user";
import { CategoryCreate } from "../../../type/transaction";
import CategoryModel from "../../../models/transacction/CategoryModel";
import { Languaje, TypesFlash } from "../../../var";

class CategoryController extends BaseController {

    constructor() {
        super()
    }

    public async RenderList(req: Request, res: Response) {
        const pag = req.query.pag | 0;
        const limit = req.query.limit | 10;

        const machine = CategoryModel.GetPaginationCategory({pag, limit});
        const countPromise = CategoryModel.CountAllCategory();

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
        return res.render(`s/transaction/category/list.hbs`, Params)
    }
    
    public async RenderCreate(req: Request, res: Response) {
        const Params = {};
        return res.render(`s/transaction/category/create.hbs`, Params)
    }

    public async RenderUpdate(req: Request, res: Response) {
        const id = req.params.id;
        const data = CategoryModel.GetCategoryById({id});
        const Params = {
            data: await data
        }
        return res.render(`s/transaction/category/update.hbs`, Params)
    }

    public async CreatePost(req: Request, res: Response) {
        try {
            const user = req.user as UserCompleted;
            const {name, description} = req.body;

            const data: CategoryCreate = {
                name,description,
                createId:user.userId,
            };
            await CategoryModel.CreateCategory({data});

            req.flash(TypesFlash.success, Languaje.messages.success.create)
            return res.redirect(`/transaction/category`);

        } catch (error) {
            console.log(error);
            req.flash(TypesFlash.error, Languaje.messages.danger.create)
            return res.redirect(`/transaction/category`);
        }
    }

    public async UpdatePost(req: Request, res: Response) {
        try {
            const user = req.user as UserCompleted;
            const id = req.params.id;
            const {name, description,code,kg,gr} = req.body;

            const data: CategoryCreate = {name,description,
                createId:user.userId,
            };
            await CategoryModel.UpdateCategory({ id, data });
            
            req.flash(TypesFlash.success, Languaje.messages.success.create)
            return res.redirect(`/transaction/category`);

        } catch (error) {
            console.log(error);
            req.flash(TypesFlash.error, Languaje.messages.danger.create)
            return res.redirect(`/transaction/category`);
        }
    }

    public async AddDeleteAt(req: Request, res: Response) {
        const id = req.params.id;
        const result = CategoryModel.AtDeleteTransaction({ id });
        req.flash(`succ`, `Categoria eliminada`);
        return res.redirect(`/transaction/category/`);
    }

    public LoadRoutes() {
        // this.router.get(`/transaction/category`, OnSession, this.RenderDashboard);
        this.router.get(`/transaction/category/`, OnSession, this.RenderList);
        this.router.get(`/transaction/category/create`, OnSession, this.RenderCreate);
        this.router.get(`/transaction/category/update/:id`, OnSession, this.RenderUpdate);

        this.router.post(`/transaction/category/create`, OnSession, this.CreatePost);
        this.router.post(`/transaction/category/delete/:id`, OnSession, this.AddDeleteAt);
        this.router.post(`/transaction/category/update/:id`, OnSession, this.UpdatePost);

        return this.router;
    }
}

export default new CategoryController();
