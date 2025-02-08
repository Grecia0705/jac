import { Request, Response } from "express";
import BaseController from "../BaseController";
import UserModel from "../../models/user/UserModel";
import TransactionModel from "../../models/transacction/TransactionModel";
import MachineModel from "../../models/control/machine/MachineModel";
// import MachineModel from "../../models/";
import ProductModel from "../../models/control/product/ProductModel";
import RawmatterModel from "../../models/control/rawmatter/RawmatterModel";
import ControlModel from "../../models/control/ControlModel";
import { UserCompleted, UserCreate } from "../../type/user";
import { OnSession } from "../../middleware/auth";
import { Prisma } from "@prisma/client";

class UserController extends BaseController {

    public async DashboardController (req: Request, res: Response) {

        const user = UserModel.CountBy({ filter:{} });
        const machine = MachineModel.CountAll();
        const product = ProductModel.CountAll();
        const rawmatter = RawmatterModel.CountAll();
        const control = ControlModel.CountAll();

        return res.render(`s/dashboard.hbs`, {
            ubication: `Resumen`,
            userCount: await user,
            machine: await machine,
            product: await product,
            rawmatter: await rawmatter,
            control: await control,
        });
    }

    public async StaticticsController (req: Request, res: Response) {

        return res.render(`s/statictics.hbs`, {
            ubication: `Resumen`,
        });
    }

    // render dashboard
    public async RenderDashboard(req: Request, res: Response) {

        const countPromise = UserModel.CountBy({ filter:{} });

        const Params = {
            count: await countPromise
        }

        return res.render(`s/user/dashboard.hbs`, Params);        
    }

    // render list
    public async RenderListHistory(req: Request, res: Response) {
        const pag = req.query.pag | 0;
        const limit = req.query.limit | 10; 

        const users = UserModel.PaginationHostory({filter:{}, limit, pag});
        const countPromise = UserModel.CountHostory({ filter:{} });

        const Params = {
            list: await users,
            next: `/history/?pag=${pag+1}`,
            previous: pag == 0 ? null : `/history/?pag=${pag-1}`,
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

        return res.render(`s/history.hbs`, Params);     
    }

    // render list
    public async RenderList(req: Request, res: Response) {
        const pag = req.params.pag | 0;
        const limit = req.params.limit | 10; 

        const users = UserModel.GetUsers({pag, limit});
        const countPromise = UserModel.CountBy({ filter:{} });

        const Params = {
            list: await users,
            next: `/users/list?pag=${pag+1}`,
            previous: pag == 0 ? null : `/users/list?pag=${pag-1}`,
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

        return res.render(`s/user/list.hbs`, Params);     
    }

    // render create
    public async RenderCreate(req: Request, res: Response) {
        const Params = {}

        return res.render(`s/user/create.hbs`, Params);  
    }

    // render show and update
    public async RenderShow(req: Request, res: Response) {
        const id = req.params.id;
        const user = await UserModel.FindUserById({id});

        if(null == user) {
            req.flash(`err`, `Usuario no encontrado.`);
            return res.redirect(`/users/list`);
        }

        const Params = {data:user};
        return res.render(`s/user/show.hbs`, Params);  
    }

    // logic register
    public async CreateUserPost(req: Request, res: Response) {
        try {
            const user = req.user as UserCompleted;
            const current: UserCreate = {
                createBy: user.userId,
                email: req.body.email,
                lastname: req.body.lastname,
                name: req.body.name,
                password: await UserModel.HashPassword({ password: req.body.password }),
                username: req.body.username
            } 

            
            const descriptionHts = `Creación de Usuario, Nombre:${current.name} Apellido:${current.lastname} Correo:${current.email} Usuario:${current.username}`;
            await UserModel.CreateUser({ data: current,description:descriptionHts });
            req.flash(`succ`, `Usuario creado.`);
            return res.redirect(`/user/list`);

        } catch (error) {
            console.log(error);
            req.flash(`err`, `No se pudo crear el usuario.`);
            return res.redirect(`/user/list`);
        }
    }

    // logic register
    public async UpdateUserPost(req: any, res: Response) {
        try {
            const id = req.user.id as string;
            const user = req.user as UserCompleted;
            const current: Prisma.UserUpdateInput = {
                email: req.body.email,
                lastname: req.body.lastname,
                name: req.body.name,
                password: await UserModel.HashPassword({ password: req.body.password }),
                username: req.body.username
            } 

            
            const descriptionHts = `Actualización de Usuario, Nombre:${current.name} Apellido:${current.lastname} Correo:${current.email} Usuario:${current.username}`;
            await UserModel.UpdateUser({ data: current, where:{ userId:id } });
            req.flash(`succ`, `Usuario actualizado.`);
            return res.redirect(`/user/list`);

        } catch (error) {
            console.log(error);
            req.flash(`err`, `No se pudo actualizar el usuario.`);
            return res.redirect(`/user/list`);
        }
    }

    public LoadRouters() {
        this.router.get(`/dashboard`, OnSession, this.DashboardController);
        this.router.get(`/statictics`, OnSession, this.StaticticsController);
        this.router.get(`/user`, OnSession, this.RenderDashboard);
        this.router.get(`/history`, OnSession, this.RenderListHistory);
        this.router.get(`/user/list`, OnSession, this.RenderList);
        this.router.get(`/user/create`, OnSession, this.RenderCreate);
        this.router.get(`/user/:id/update`, OnSession, this.RenderShow);
        this.router.post(`/user/create`, OnSession, this.CreateUserPost);
        this.router.post(`/user/:id/update`, OnSession, this.UpdateUserPost);

        return this.router;
    }
}

export default new UserController();
