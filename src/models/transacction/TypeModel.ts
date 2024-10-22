import { TypeCreate } from "../../type/transaction";
import TrasactionModel from "./TransactionModel";

class TypeModel extends TrasactionModel {

    constructor () {
        super();
    }

    public async CreateType({ data,description,userId }: { data: TypeCreate,description:string,userId: string }) {
        this.StartPrisma();
        const result = this.prisma.transactionType.create({ data });
        await this.CreateHistory({
            description,
            userReference: {
                connect: { userId: userId }
            },
            objectId: userId,
            objectName: `transaction.type`,
            objectReference: true,
        });
        this.DistroyPrisma();
        return result;
    }

    public async UpdateType({ data, id,description,userId }: {data: TypeCreate, id: string,description:string,userId: string}) {
        this.StartPrisma();
        const result = this.prisma.transactionType.update({ data, where:{transactionTypeId:id} });
        await this.CreateHistory({
            description,
            userReference: {
                connect: { userId: userId }
            },
            objectId: userId,
            objectName: `transaction.type`,
            objectReference: true,
        });
        this.DistroyPrisma();
        return result;
    }

    public async GetTypeById({ id }: {id:string}) {
        this.StartPrisma();
        const result = await this.prisma.transactionType.findFirst({ 
            where:{
                AND: {
                    transactionTypeId:id,
                    delete_at: false,
                },
            }
        });
        this.DistroyPrisma();
        return result;
    }

    public async GetPaginationType({ pag, limit }: {pag:number, limit:number}) {
        this.StartPrisma();
        const result = await this.prisma.transactionType.findMany({
            skip: pag*limit,
            take: limit,
            where: {
                delete_at: false,
            }
        });
        this.DistroyPrisma();
        return result;
    }

    public async CountTypeAll() {
        this.StartPrisma();
        const result = await this.prisma.transactionType.count();
        this.DistroyPrisma();
        return result;
    } 

    public async AtDeleteType({id,description,userId}:{id:string,description:string,userId: string}) {
        this.StartPrisma();
        this.prisma.transactionType.update({ data:{ delete_at: true }, where:{transactionTypeId:id} });
        await this.CreateHistory({
            description,
            userReference: {
                connect: { userId: userId }
            },
            objectId: userId,
            objectName: `transaction.type`,
            objectReference: true,
        });
        this.DistroyPrisma();
        return null
    }
}

export default new TypeModel;

