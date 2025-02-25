import { RawMatterCreate } from "../../../type/rawmatter";
import AbstractModel from "../../BaseModel";

class RawmatterModel extends AbstractModel {

    constructor () {
        super();
    }

    public async Create({ data,description,userId }: {data:RawMatterCreate,description:string,userId: string}) {
        this.StartPrisma();
        const result = await this.prisma.rawmater.create({ data });
        await this.CreateHistory({
            description,
            userReference: {
                connect: { userId: userId }
            },
            objectId: userId,
            objectName: `product`,
            objectReference: true,
        });
        this.DistroyPrisma();
        return result;
    }

    public async CountAll() {
        this.StartPrisma();
        const result = await this.prisma.rawmater.count();
        this.DistroyPrisma();
        return result;
    } 

    public async Update({ id, data,description,userId }: {id:string, data:RawMatterCreate,description:string,userId: string}) {
        this.StartPrisma();
        const result = await this.prisma.rawmater.update({ data, where:{rawmatterId:id} });
        await this.CreateHistory({
            description,
            userReference: {
                connect: { userId: userId }
            },
            objectId: userId,
            objectName: `product`,
            objectReference: true,
        });
        this.DistroyPrisma();
        return result;
    }
    
    public async AtDelete({id,description,userId}:{id:string,description:string,userId: string}) {
        this.StartPrisma();
        await this.prisma.rawmater.update({ data:{ delete_at:true }, where:{rawmatterId:id} });
        await this.CreateHistory({
            description,
            userReference: {
                connect: { userId: userId }
            },
            objectId: userId,
            objectName: `product`,
            objectReference: true,
        });
        this.DistroyPrisma();
        return null
    }
    
    public async GetPagination({ pag, limit }: {pag:number, limit:number}) {
        this.StartPrisma();
        const result = await this.prisma.rawmater.findMany({
            where: {
                delete_at: false,
            },
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
                rawmatterId: id,
                delete_at: false,
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
