import { MachineCreate } from "../../../type/machine";
import AbstractModel from "../../BaseModel";

class MachineModel extends AbstractModel {

    constructor () {
        super();
    }

    public async Create({ data }: {data:MachineCreate}) {
        this.StartPrisma();
        const result = await this.prisma.machine.create({ data });
        this.DistroyPrisma();
        return result;
    }

    public async Update({ id, data }: {id:string, data:MachineCreate}) {
        this.StartPrisma();
        const result = await this.prisma.machine.update({ data, where:{machineId:id} });
        this.DistroyPrisma();
        return result;
    }
    
    public async AtDelete({id}:{id:string}) {
        this.StartPrisma();
        await this.prisma.machine.update({ data:{ delete_at:true }, where:{machineId:id} })
        this.DistroyPrisma();
        return null
    }
    
    public async GetPagination({ pag, limit }: {pag:number, limit:number}) {
        this.StartPrisma();
        const result = await this.prisma.machine.findMany({
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

    public async CountAll() {
        this.StartPrisma();
        const result = await this.prisma.machine.count();
        this.DistroyPrisma();
        return result;
    } 

    public async GetById({ id }: {id:string}) {
        this.StartPrisma();
        const result = await this.prisma.machine.findFirst({
            where: {
                machineId: id,
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

export default new MachineModel();
