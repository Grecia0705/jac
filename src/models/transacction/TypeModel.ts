import { TypeCreate } from "../../type/transaction";
import TrasactionModel from "./TransactionModel";

class TypeModel extends TrasactionModel {

    constructor () {
        super();
    }

    public async CreateType({ data }: { data: TypeCreate }) {
        this.StartPrisma();
        const result = this.prisma.transactionType.create({ data });
        this.DistroyPrisma();
        return result;
    }

    public async UpdateType({ data, id }: {data: TypeCreate, id: string}) {
        this.StartPrisma();
        const result = this.prisma.transactionType.update({ data, where:{transactionTypeId:id} });
        this.DistroyPrisma();
        return result;
    }

    public async GetTypeById({ id }: {id:string}) {
        this.StartPrisma();
        const result = await this.prisma.transactionType.findFirst({ 
            where:{transactionTypeId:id},
        });
        this.DistroyPrisma();
        return result;
    }

    public async GetPaginationType({ pag, limit }: {pag:number, limit:number}) {
        this.StartPrisma();
        const result = await this.prisma.transactionType.findMany({
            skip: pag*limit,
            take: limit,
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
}

export default new TypeModel;

