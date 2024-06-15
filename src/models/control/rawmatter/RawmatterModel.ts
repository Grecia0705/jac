import { RawMatterCreate } from "../../../type/rawmatter";
import AbstractModel from "../../BaseModel";

class RawmatterModel extends AbstractModel {

    constructor () {
        super();
    }

    public async Create({ data }: {data:RawMatterCreate}) {
        this.StartPrisma();
        const result = await this.prisma.rawmater.create({ data });
        this.DistroyPrisma();
        return result;
    }

    public async CountAll() {
        this.StartPrisma();
        const result = await this.prisma.rawmater.count();
        this.DistroyPrisma();
        return result;
    } 

    public async Update({ id, data }: {id:string, data:RawMatterCreate}) {
        this.StartPrisma();
        const result = await this.prisma.rawmater.update({ data, where:{rawmatterId:id} });
        this.DistroyPrisma();
        return result;
    }
    
    public async ToDelete({ id }: {id:string}) {
        this.StartPrisma();
        // const result = await this.prisma.rawmater.update({ data:{}, where:{controlId:id} });
        this.DistroyPrisma();
        return null;
    }
    
    public async GetPagination({ pag, limit }: {pag:number, limit:number}) {
        this.StartPrisma();
        const result = await this.prisma.rawmater.findMany({
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
        const result = await this.prisma.rawmater.findFirst({
            where: {
                rawmatterId: id
            },
            include: {
                createReference: true
            }
        });
        this.DistroyPrisma();
        return result;
    }
}

export default new RawmatterModel();
