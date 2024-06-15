import { UserCreate } from "../../type/user.d";
import AbstractModel from "../BaseModel";

class UserModel extends AbstractModel {

    constructor () {
        super();
    }

    // get users pagination
    public async GetUsers({pag, limit=10}: {pag:number, limit:number}) {
        const result = await this.prisma.user.findMany({
            skip: pag*10,
            take: limit
        });
        return result;
    }

    public async CountBy({ filter }: {filter:any}) {
        const result = await this.prisma.user.count({ where:filter });
        return result;
    }

    // crea usuario
    public async CreateUser({data}:{data:UserCreate}) {
        this.StartPrisma();
        const result = await this.prisma.user.create({data}); 
        this.DistroyPrisma();
        // this.StaticticsUpdate({});
        return result;
    }

    // busca usuario por email
    public async FindUserByEmail({email}: {email:string}) {
        this.StartPrisma();
        const result = await this.prisma.user.findUnique({ where:{email} });
        this.DistroyPrisma();
        return result;
    }

    // busca usuario por usuario
    public async FindUserByUsername({username}: {username:string}) {
        this.StartPrisma();
        const result = await this.prisma.user.findUnique({ where:{username} });
        this.DistroyPrisma();
        return result;
    }

    // busca usuario por id
    public async FindUserById({id}: {id:string}) {
        this.StartPrisma();
        const result = await this.prisma.user.findFirst({ where:{userId:id} });
        this.DistroyPrisma();
        return result;
    }

    // actualiza usuario por id
    public async UpdateUser() {
        this.StartPrisma();
        
        this.DistroyPrisma();
    }

    // agrega eliminación de uaurio
    public async AtDeleteUser() {
        this.StartPrisma();

        this.DistroyPrisma();
    }

    // elimina usuario
    public async DeleteUser() {
        this.StartPrisma();

        this.DistroyPrisma();
    }

    // compara contrasenias
    public async ComparePassword({password, dbPassword}:{password:string, dbPassword:string}) {
        const result = await this.bcrypt.compare(password, dbPassword);
        return result;
    }

    // encripta contrasenia
    public async HashPassword({password}:{password:string}) {
        const result = await this.bcrypt.hash(password, 15);
        return result;
    }

    public async StaticticsTopUsers({limit}:{limit:number}) {
        // const transaction = await TransactionModel.UsersActives({ limit:5 });
        // return transaction;
        this.StartPrisma();
        const result = this.prisma.user.findMany({
            include: {
                _count: true,
            },
            skip: 0,
            take: limit
        })
        this.DistroyPrisma();
        return result;
    }
}

export default new UserModel();
