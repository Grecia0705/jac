import { CreateStock } from "../../type/stock.d";
import AbstractModel from "../BaseModel";

class StockModel extends AbstractModel {

    constructor () {
        super();
    }

    public async Create({ data }: {data:CreateStock}) {
        this.StartPrisma();
        const result = await this.prisma.stock.create({ data });
        this.DistroyPrisma();
        return result;
    }

    public async Update({ id, data }: {id:string, data:CreateStock}) {
        this.StartPrisma();
        const result = await this.prisma.stock.update({ data, where:{stockId:id} });
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
                stockId: id
            },
            include: {
                createReference: true,
            }
        });
        this.DistroyPrisma();
        return result;
    }
}

export default new StockModel();
