import { Request, Response } from "express";
import BaseController from "../../BaseController";
import { OnSession } from "../../../middleware/auth";
import { UserCompleted } from "../../../type/user";
import { ProductCreate } from "../../../type/product";
import ProductModel from "../../../models/control/product/ProductModel";
import { Languaje, TypesFlash } from "../../../var";

class ProductController extends BaseController {

    private view = `s/control/product`;
    private url = `/control/product`;
    private model = ProductModel;

    constructor() {
        super()
    }

    // public async RenderDashboard(req: Request, res: Response) {
    //     // const 

    //     const Params = {};
    //     return res.render(`s/control/product/dashboard.hbs`, Params)
    // }

    public async RenderList(req: Request, res: Response) {

        const pag = req.query.pag | 0;
        const limit = req.query.limit | 10;
        const list = ProductModel.GetPagination({pag,limit});

        const Params = {
            list: await list
        };

        return res.render(`s/control/product/list.hbs`, Params)
    }
    
    public async RenderCreate(req: Request, res: Response) {
        const Params = {};
        return res.render(`s/control/product/create.hbs`, Params)
    }

    public async RenderUpdate(req: Request, res: Response) {
        const id = req.params.id;
        const data = ProductModel.GetById({id});
        const Params = {
            data: await data
        }
        return res.render(`s/control/product/update.hbs`, Params)
    }

    public async CreatePost(req: Request, res: Response) {
        try {
            const user = req.user as UserCompleted;
            const {name, description} = req.body;
            const descriptionHts = `Creación de Producto: Nombre:${name} Descripción:${description}`; 
            const data: ProductCreate = {name,description, createId:user.userId};
            await ProductModel.Create({data,userId:user.userId,description:descriptionHts});

            req.flash(TypesFlash.success, Languaje.messages.success.create)
            return res.redirect(`/control/product`);

        } catch (error) {
            console.log(error);
            req.flash(TypesFlash.error, Languaje.messages.danger.create)
            return res.redirect(`/control/product`);
        }
    }

    public async UpdatePost(req: Request, res: Response) {
        try {
            const user = req.user as UserCompleted;
            const id = req.params.id;
            const {name, description} = req.body;

            const data: ProductCreate = {name,description, createId:user.userId};
            const descriptionHts = `Actualización de producto: Nombre:${name} Descripción:${description}`;
            await ProductModel.Update({ id, data,userId:user.userId,description:descriptionHts });
            
            req.flash(TypesFlash.success, Languaje.messages.success.create)
            return res.redirect(`/control/product`);

        } catch (error) {
            console.log(error);
            req.flash(TypesFlash.error, Languaje.messages.danger.create)
            return res.redirect(`/control/product`);
        }
    }

    public async AddDeleteAt(req: Request, res: Response) {
        const id = req.params.id;
        const user = req.user as any;
        const result = ProductModel.AtDelete({ id,userId:user.userId,description:`Eliminación de producto` });
        req.flash(`succ`, `Producto eliminada`);
        return res.redirect(`/control/product`);
    }

    public LoadRoutes() {
        // this.router.get(`${this.pathUrl}`, OnSession, this.RenderDashboard);
        this.router.get(`/control/product/`, OnSession, this.RenderList);
        this.router.get(`/control/product/create`, OnSession, this.RenderCreate);
        this.router.get(`/control/product/update/:id`, OnSession, this.RenderUpdate);

        this.router.post(`/control/product/create`, OnSession, this.CreatePost);
        this.router.post(`/control/product/update/:id`, OnSession, this.UpdatePost);
        this.router.get(`/control/product/delete/:id`, OnSession, this.AddDeleteAt);

        return this.router;
    }
}

export default new ProductController();
