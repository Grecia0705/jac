import { CompletedControl, ControlCreate } from "../../type/control";
import AbstractModel from "../BaseModel";

class ControlModel extends AbstractModel {

    constructor () {
        super();
    }

    public async Create({ data }: {data:ControlCreate}) {
        try {
            this.StartPrisma();
            const result = await this.prisma.control.create({ 
                data: {
                    createId: data.createId,
                    date: data.date,
                    gr: data.gr,
                    kg: data.kg,
                    machineId: data.machineId,
                    productId: data.productId,
                    rawmatterId: data.rawmatterId
                }
             });
            this.DistroyPrisma();
            return result;
        } catch (error: any) {
            console.error(error);
            throw new Error(error);
        }
    }

    public async Update({ id, data }: {id:string, data:ControlCreate}) {
        this.StartPrisma();
        const result = await this.prisma.control.update({ data: {
            // createId: data.createId,
            date: data.date,
            gr: data.gr,
            kg: data.kg,
            // machineId: data.machineId,
            // rawmatterId: data.rawmatterId
        }, where:{controlId:id} });
        this.DistroyPrisma();
        return result;
    }
    
    public async ToDelete({ id }: {id:string}) {
        this.StartPrisma();
        // const result = await this.prisma.control.update({ data:{}, where:{controlId:id} });
        this.DistroyPrisma();
        return null;
    }

    public async CountAll() {
        this.StartPrisma();
        const result = await this.prisma.control.count();
        this.DistroyPrisma();
        return result;
    } 
    
    public async GetPagination({ pag, limit }: {pag:number, limit:number}) {
        this.StartPrisma();
        const result = await this.prisma.control.findMany({
            // include: {
            //     // createReference: true,
            //     // machineReference: true,
            //     // productReference: true,
            //     // rawmatterReference: true,
            // },
            skip: pag*limit,
            take: limit,
        });
        this.DistroyPrisma();
        return result;
    }

    public async GetById({ id }: {id:string}) {
        this.StartPrisma();
        const result = await this.prisma.control.findFirst({
            where: {
                controlId: id,
                delete_at: false,
            }
        });
        if(!result) {
            return null;
        }

        const create = this.prisma.user.findFirst({ where:{ userId:result.createId } });
        const machine = this.prisma.machine.findFirst({ where:{ machineId:result.machineId } });
        const product = this.prisma.product.findFirst({ where:{ productId:result.productId } });
        const rawmatter = this.prisma.rawmater.findFirst({ where:{ rawmatterId:result.rawmatterId } });

        const control:CompletedControl = {
            controlId: result.controlId,

            date: result.date,
            gr: result.gr,
            kg: result.kg,

            createId: result.createId,
            machineId: result.machineId,
            productId: result.productId,
            rawmatterId: result.rawmatterId,

            create_at: result.create_at.toString(),
            update_at: result.update_at.toString(),
            delete_at: result.delete_at ? result.delete_at.toString() : ``,

            createReference: await create,
            machineReference: await machine,
            productReference: await product,
            rawmatterReference: await rawmatter,
        } 
        this.DistroyPrisma();
        return control;
    }
}

export default new ControlModel();
