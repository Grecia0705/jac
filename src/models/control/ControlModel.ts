import { Prisma } from "@prisma/client";
import { CompletedControl, ControlCreate } from "../../type/control";
import AbstractModel from "../BaseModel";

class ControlModel extends AbstractModel {

    constructor () {
        super();
    }

    public async Create({ data,description,userId }: {data:ControlCreate, description:string,userId: string}) {
        try {
            console.log(data);
            this.StartPrisma();
            const result = await this.prisma.control.create({ 
                data: {
                    date: data.date,
                    gr: data.gr,
                    kg: data.kg,
                    createReference: { connect:{ userId:data.createId } },
                    machineReference: { connect:{ machineId:data.machineId } },
                    productReference: { connect:{ productId:data.productId } },
                    rawmatterReference: { connect:{ rawmatterId:data.rawmatterId } },
                }
            });

            await this.CreateHistory({
                description,
                userReference: {
                    connect: { userId: userId }
                },
                objectId: userId,
                objectName: `control`,
                objectReference: true,
            });
            this.DistroyPrisma();
            return result;
        } catch (error: any) {
            console.error(error);
            throw new Error(error);
        }
    }

    public async Update({ id, data,description,userId }: {id:string, data:ControlCreate, description:string,userId: string}) {
        this.StartPrisma();
        const result = await this.prisma.control.update({ data: {
            // createId: data.createId,
            date: data.date,
            gr: data.gr,
            kg: data.kg,
            // machineId: data.machineId,
            // rawmatterId: data.rawmatterId
            createReference: { connect:{userId:data.createId} },
            machineReference: { connect:{machineId:data.machineId} },
            rawmatterReference: { connect:{rawmatterId:data.rawmatterId} },
            productReference: { connect:{productId:data.productId} }
        }, where:{controlId:id} });

        await this.CreateHistory({
            description,
            userReference: {
                connect: { userId: userId }
            },
            objectId: userId,
            objectName: `control`,
            objectReference: true,
        });
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

    public async CountAllBy({filter}:{filter:Prisma.ControlWhereInput}) {
        this.StartPrisma();
        const result = await this.prisma.control.count({where:filter});
        this.DistroyPrisma();
        return result;
    } 
    
    public async GetPagination({ pag, limit }: {pag:number, limit:number}) {
        this.StartPrisma();
        const result = await this.prisma.control.findMany({
            include: {
                machineReference: true,
                productReference: true,
                rawmatterReference: true,
            },
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
            },
            include: {
                createReference: true,
                machineReference: true,
                productReference: true,
                rawmatterReference: true
            }
        });
        if(!result) {
            return null;
        }

        // const create = this.prisma.user.findFirst({ where:{ userId:result.createId } });
        // const machine = this.prisma.machine.findFirst({ where:{ machineId:result.machineId } });
        // const product = this.prisma.product.findFirst({ where:{ productId:result.productId } });
        // const rawmatter = this.prisma.rawmater.findFirst({ where:{ rawmatterId:result.rawmatterId } });

        // const control:CompletedControl = {
        //     controlId: result.controlId,

        //     date: result.date,
        //     gr: result.gr,
        //     kg: result.kg,

        //     createId: result.createId,
        //     machineId: result.machineId,
        //     productId: result.productId,
        //     rawmatterId: result.rawmatterId,

        //     create_at: result.create_at.toString(),
        //     update_at: result.update_at.toString(),
        //     delete_at: result.delete_at ? result.delete_at.toString() : ``,

        //     createReference: await create,
        //     machineReference: await machine,
        //     productReference: await product,
        //     rawmatterReference: await rawmatter,
        // } 
        this.DistroyPrisma();
        return result;
    }

    public async ReportEvent({filter,skip,take}:{filter:Prisma.ControlWhereInput, skip:number, take:number}) {
        this.StartPrisma();
        const result = await this.prisma.control.findMany({
            where: filter,
            skip,
            take,
            include: {
                machineReference: true,
                productReference: true,
                rawmatterReference: true,
            }
        });
        const count = await this.prisma.control.count({ where:filter });
        this.DistroyPrisma();
        return {result,count};
    }
}

export default new ControlModel();
