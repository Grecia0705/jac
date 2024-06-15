import { Request, Response } from "express";
import BaseController from "../../BaseController";
import { OnSession } from "../../../middleware/auth";
import { UserCompleted } from "../../../type/user";
import { RawMatterCreate } from "../../../type/rawmatter";
import RawmatterModel from "../../../models/control/rawmatter/RawmatterModel";
import { Decimal } from "@prisma/client/runtime/library";
import { Languaje, TypesFlash } from "../../../var";

class RawmatterController extends BaseController {

    private view = `s/control/rawmatter`;
    private url = `/control/rawmatter`;
    private model = RawmatterModel;

    constructor() {
        super()
    }

    public async RenderList(req: Request, res: Response) {

        const pag = req.query.pag | 0;
        const limit = req.query.limit | 10;
        const list = RawmatterModel.GetPagination({pag,limit});

        const Params = {
            list: await list
        };

        return res.render(`s/control/rawmatter/list.hbs`, Params)
    }
    
    public async RenderCreate(req: Request, res: Response) {
        const Params = {};
        return res.render(`s/control/rawmatter/create.hbs`, Params)
    }

    public async RenderUpdate(req: Request, res: Response) {
        const id = req.params.id;
        const data = RawmatterModel.GetById({id});
        const Params = {
            data: await data
        }
        return res.render(`s/control/rawmatter/update.hbs`, Params)
    }

    public async CreatePost(req: Request, res: Response) {
        try {
            const user = req.user as UserCompleted;
            const {name, description, code, kg, gr} = req.body;

            const data: RawMatterCreate = {name,description,code,
                createId:user.userId,
                kg: Number(kg),
                gr: Number(gr)
            };
            await RawmatterModel.Create({data});

            req.flash(TypesFlash.success, Languaje.messages.success.create)
            return res.redirect(`/control/rawmatter`);

        } catch (error) {
            console.log(error);
            req.flash(TypesFlash.error, Languaje.messages.danger.create)
            return res.redirect(`/control/rawmatter`);
        }
    }

    public async UpdatePost(req: Request, res: Response) {
        try {
            const user = req.user as UserCompleted;
            const id = req.params.id;
            const {name, description,code,kg,gr} = req.body;

            const data: RawMatterCreate = {name,description, code,
                createId:user.userId,
                kg: Number(kg),
                gr: Number(gr) | 0
            };
            await RawmatterModel.Update({ id, data });
            
            req.flash(TypesFlash.success, Languaje.messages.success.create)
            return res.redirect(`/control/rawmatter`);

        } catch (error) {
            console.log(error);
            req.flash(TypesFlash.error, Languaje.messages.danger.create)
            return res.redirect(`/control/rawmatter`);
        }
    }


    public LoadRoutes() {
        // this.router.get(`/control/rawmatter`, OnSession, this.RenderDashboard);
        this.router.get(`/control/rawmatter/`, OnSession, this.RenderList);
        this.router.get(`/control/rawmatter/create`, OnSession, this.RenderCreate);
        this.router.get(`/control/rawmatter/update/:id`, OnSession, this.RenderUpdate);

        this.router.post(`/control/rawmatter/create`, OnSession, this.CreatePost);
        this.router.post(`/control/rawmatter/update/:id`, OnSession, this.UpdatePost);

        return this.router;
    }
}

export default new RawmatterController();
