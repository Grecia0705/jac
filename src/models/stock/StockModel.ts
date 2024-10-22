import { CreateStock } from "../../type/stock.d";
import AbstractModel from "../BaseModel";

class StockModel extends AbstractModel {

    constructor () {
        super();
    }

    public async Create({ data,description,userId }: {data:CreateStock,description:string,userId: string}) {
        this.StartPrisma();
        const result = await this.prisma.stock.create({ data });
        await this.CreateHistory({
            description,
            userReference: {
                connect: { userId: userId }
            },
            objectId: userId,
            objectName: `stock`,
            objectReference: true,
        });
        this.DistroyPrisma();
        return result;
    }

    public async Update({ id, data,description,userId }: {id:string, data:CreateStock,description:string,userId: string}) {
        this.StartPrisma();
        const result = await this.prisma.stock.update({ data, where:{stockId:id} });
        await this.CreateHistory({
            description,
            userReference: {
                connect: { userId: userId }
            },
            objectId: userId,
            objectName: `stock`,
            objectReference: true,
        });
        this.DistroyPrisma();
        return result;
    }
    
    public async ToDelete({ id }: {id:string}) {
        this.StartPrisma();
        // const result = await this.prisma.stock.update({ data:{}, where:{controlId:id} });
        this.DistroyPrisma();
        return null;
    }
    
    public async GetPagination({ pag, limit }: {pag:number, limit:number}) {
        this.StartPrisma();
        const result = await this.prisma.stock.findMany({
            include: {
                createReference: true
            },
            where: {
                delete_at: false,
            },
            skip: pag*limit,
            take: limit,
        });
        this.DistroyPrisma();
        return result;
    }

    public async GetById({ id }: {id:string}) {
        this.StartPrisma();
        const result = await this.prisma.stock.findFirst({
            where: {
                stockId: id,
                delete_at: false,

            },
            include: {
                createReference: true,
            }
        });
        this.DistroyPrisma();
        return result;
    }

    public async AtDeleteStock({id,description,userId}:{id:string,description:string,userId: string}) {
        this.StartPrisma();
        await this.prisma.stock.update({ data:{ delete_at:true }, where:{stockId:id} });
        await this.CreateHistory({
            description,
            userReference: {
                connect: { userId: userId }
            },
            objectId: userId,
            objectName: `stock`,
            objectReference: true,
        });
        this.DistroyPrisma();
        return null
    }
}

export default new StockModel();
