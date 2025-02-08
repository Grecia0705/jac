import { Request, Response } from "express";
import BaseController from "../BaseController";
import { OnSession } from "../../middleware/auth";
import { UserCompleted } from "../../type/user";
import { CreateStock } from "../../type/stock";
import StockModel from "../../models/stock/StockModel";
import { Languaje, TypesFlash } from "../../var";

class RawmatterController extends BaseController {

    private pathView = `s/stock`;
    private pathUrl = `/stock`;
    private model = StockModel;

    constructor() {
        super()
    }

    public async RenderDashboard(req: Request, res: Response) {
        return res.render(`s/stock/dashboard.hbs`)
    }

    public async RenderList(req: Request, res: Response) {
        const limit = req.query.limit | 10;
        const pag = req.query.pag | 0;
        const list = StockModel.GetPagination({pag, limit});

        const Params = {
            list: await list
        };
        return res.render(`s/stock/list.hbs`, Params)
    }
    
    public async RenderCreate(req: Request, res: Response) {
        return res.render(`s/stock/create.hbs`)
    }

    public async RenderUpdate(req: Request, res: Response) {
        const id = req.params.id;
        const data = StockModel.GetById({id});
        const Params = {
            data: await data
        };
        return res.render(`s/stock/update.hbs`, Params)
    }

    public async CreatePost(req: Request, res: Response) {
        try {
            const user = req.user as UserCompleted;
            const {description,quantity,price} = req.body;

            const data: CreateStock = {description, createId:user.userId, 
                price: parseFloat(price), 
                quantity:Number(quantity)
            };
            const descriptionHts = `Creación de inventario de Inventario, Descripción:${description} Cantidad:${quantity} Precio:${price}`;
            await StockModel.Create({ data,description:descriptionHts,userId:user.userId });
            req.flash(`succ`, `Creación exitosa.`);
            console.log(req.flash);
            return res.redirect(`/stock`);

        } catch (error) {
            console.log(`# # # # # # # # # # # # #`)
            console.log(error);
            req.flash(`err`, `Error al crear.`)
            return res.redirect(`/stock`);
        }
    }

    public async UpdatePost(req: Request, res: Response) {
        try {
            const user = req.user as UserCompleted;
            const id = req.params.id;
            const {description,quantity,price} = req.body;
            
            const descriptionHts = `Actualización de Inventario, Descripción:${description} Cantidad:${quantity} Precio:${price}`;

            const data: CreateStock = {description, createId:user.userId,price,quantity:Number(quantity)};
            await StockModel.Update({id,data,description:descriptionHts,userId:user.userId});
            req.flash(TypesFlash.success, Languaje.messages.success.create)
            return res.redirect(`/stock`);

        } catch (error) {
            console.log(error);
            req.flash(TypesFlash.error, Languaje.messages.danger.create)
            return res.redirect(`/stock`);
        }
    }

    public async AddDeleteAt(req: Request, res: Response) {
        try {
            const id = req.params.id;
            const user = req.user as any;
            console.log(user)
            const result = StockModel.AtDeleteStock({ id,description:`Eliminación de Inventario`,userId:user.userId });
            req.flash(`succ`, `Transacción eliminada`);
        } catch (error) {
            console.log(error);
        }
        return res.redirect(`/stock`);
    }

    public LoadRoutes() {
        this.router.get(`/stock`, OnSession, this.RenderList);
        this.router.get(`/stock/list`, OnSession, this.RenderList);
        this.router.get(`/stock/create`, OnSession, this.RenderCreate);
        this.router.get(`/stock/update/:id`, OnSession, this.RenderUpdate);

        this.router.post(`/stock/create`, OnSession, this.CreatePost);
        this.router.get(`/stock/delete/:id`, OnSession, this.AddDeleteAt);
        this.router.post(`/stock/update/:id`, OnSession, this.UpdatePost);

        return this.router;
    }
}

export default new RawmatterController();
