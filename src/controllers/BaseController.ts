import { Request, Response } from "express";
import UserModel from "../models/user/UserModel";

import { UserCompleted, UserCreate } from "../type/user.d";
import { Router } from "express";

class BaseController {    
    public adminTest: UserCompleted | null = null
    private lan = `es`;
    public router = Router();

    public async InsertUserBase(req: Request, res: Response) {
        try {
            const listResponse = [];
            const model = UserModel;
            const superadmin: UserCreate = {
                email: `superadmin@example.com`,
                lastname: `Admin`,
                name: `Super`,
                password: await model.HashPassword({password:`super.123.`}),
                username: `superadmin`,
                createBy: null,
            }
            
            const superadminResult = await model.CreateUser({data:superadmin, rol:"ROOT", description:`Creación de usuario por defecto: Correo${superadmin.email} Nombre:${superadmin.name} Apellido:${superadmin.lastname} Usuario:${superadmin.username}`});

            listResponse.push(`UserCreate: ${superadminResult.name} ${superadminResult.lastname}`);  
            
            return res.status(200).json({body:listResponse});
        } catch (error) {
            return res.status(500).json({ok:false});   
        }
    }

    public async StartStaticticsForYear(req: Request, res: Response) {
        const date = new Date();
        const year = date.getFullYear();

        // const result = await UserModel.CreateStatictisForYear({ year });

        // return res.json({ body:result });


    }

    public async Logout(req: Request, res: Response) {
        req.logOut(() => {
            return res.redirect(`/`);
        })
    }    
}

export default BaseController;
