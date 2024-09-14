import { connect } from "mongoose";
import AbstractModel from "../BaseModel";

class StaticticsTransaction extends AbstractModel {

    constructor () {
        super();
    }

    // crea
    public async create({num,name,type}:{num: number,name:string,type:string}) {
        const year = this.getYear();
        const month = this.getMonth();
        this.StartPrisma();

        const result = await this.prisma.staticticsObjectsYear.create({
            data: {
                year,
                objectType: type,
                objectName: name,
                total_month_1: month == 1 ? num : 0,
                total_month_2: month == 2 ? num : 0,
                total_month_3: month == 3 ? num : 0,
                total_month_4: month == 4 ? num : 0,
                total_month_5: month == 5 ? num : 0,
                total_month_6: month == 6 ? num : 0,
                total_month_7: month == 7 ? num : 0,
                total_month_8: month == 8 ? num : 0,
                total_month_9: month == 9 ? num : 0,
                total_month_10: month == 10 ? num : 0,
                total_month_11: month == 11 ? num : 0,
                total_month_12: month == 12 ? num : 0
            }
        });

        this.DistroyPrisma();

        return result;
    }

    // return statictics
    public async conectOrCreate({name, num, type=`Transaction`}:{name:string, num:number, type?:string}) {
        const year = this.getYear();

        this.StartPrisma();
        const result = await this.prisma.staticticsObjectsYear.findFirst({
            where: {
                AND: [
                    {objectName:name},
                    {year}
                ]
            }
        });
        this.DistroyPrisma();

        if(result) {
            const id = result.staticticsForYearId;
            this.update({id,name,num});
            return result;
        }

        const create = await this.create({ name,num,type });
        return create;
    }
    
    public async getForYear({limit=3,year,type}:{limit?:number,year:number,type:string}) {
        this.StartPrisma();
        const result = await this.prisma.staticticsObjectsYear.findMany({
            skip: 0,
            take: limit,
            where: { objectType:type }
        })
        this.DistroyPrisma();
        return result;
    }
 
    // incrementa
    public async update({name, num,id}:{name:string, num:number,id:string}) {
        const year = this.getYear();
        const month = this.getMonth();
        this.StartPrisma();

        const result = await this.prisma.staticticsObjectsYear.update({
            data: {
                year,
                objectName: name,
                total_month_1: month == 1 ? {increment:num} : {increment:0},
                total_month_2: month == 2 ? {increment:num} : {increment:0},
                total_month_3: month == 3 ? {increment:num} : {increment:0},
                total_month_4: month == 4 ? {increment:num} : {increment:0},
                total_month_5: month == 5 ? {increment:num} : {increment:0},
                total_month_6: month == 6 ? {increment:num} : {increment:0},
                total_month_7: month == 7 ? {increment:num} : {increment:0},
                total_month_8: month == 8 ? {increment:num} : {increment:0},
                total_month_9: month == 9 ? {increment:num} : {increment:0},
                total_month_10: month == 10 ? {increment:num} : {increment:0},
                total_month_11: month == 11 ? {increment:num} : {increment:0},
                total_month_12: month == 12 ? {increment:num} : {increment:0}
            },
            where: {
                staticticsForYearId: id
            }
        });

        this.DistroyPrisma();

        return result;
    }

    public getYear() {
        const date = new Date();
        return date.getFullYear();
    }

    public getMonth() {
        const date = new Date();
        return date.getMonth()+1;
    }
}

export default new StaticticsTransaction();
