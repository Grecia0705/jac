import { Prisma, PrismaClient } from '@prisma/client';
import { compare, hash } from 'bcrypt';

class AbstractModel {

    public prisma = new PrismaClient();
    public bcrypt = {compare, hash};

    constructor () {
        this.prisma = new PrismaClient();
        this.bcrypt = {compare, hash};
    }

    StartPrisma() {
        return this.prisma = new PrismaClient();
    }

    async DistroyPrisma() {
        this.prisma.$disconnect();
    }

    async CreateHistory (data: Prisma.HistoryCreateInput) {
        this.StartPrisma();
        return this.prisma.history.create({ data });
    }

    async PaginationHostory({ filter,pag,limit }: { filter:Prisma.HistoryWhereInput, pag:number, limit:number }) {
        return await this.prisma.history.findMany({
            where: filter,
            skip: pag*10,
            take: limit,
            include: {
                userReference: true
            },
            orderBy: {
                createAt: 'asc'
            }
        })
    }

    async CountHostory({ filter }: { filter:Prisma.HistoryWhereInput }) {
        return await this.prisma.history.count({
            where: filter
        })
    }

    // async CreateTransaction({data}: {data: TransactionCreate}) {
    //     this.StartPrisma();
    //     const result = await this.prisma.$transaction.create({data});
    //     this.DistroyPrisma();
    //     return result;
    // }

    // async CreateStatictisForYear({year}:{year:number}) {
    //     this.StartPrisma();

    //     const validYear = await this.prisma.staticticsForYear.findFirst({ where:{ year } });

    //     if(validYear) {
    //         return;
    //     }

    //     const result = await this.prisma.staticticsForYear.create({ data:{year} });
    //     this.DistroyPrisma();
    //     return result;
    // }

    // async StaticticsUpdate({}:{}) {
    //     this.StartPrisma();
    //     const date = new Date();
    //     const month = date.getMonth()+1;
    //     const year = date.getFullYear();

    //     const result = await this.prisma.staticticsForYear.findFirst({ where:{
    //         year
    //     }});

    //     if(!result) {
    //         this.CreateStatictisForYear({ year });
    //         return null;
    //     }

    //     const UpdateSet = {
    //         enero: result.enero,
    //         febrero: result.febrero,
    //         marzo: result.marzo,
    //         abril: result.abril,
    //         mayo: result.mayo,
    //         junio: result.junio,
    //         julio: result.julio,
    //         agosto: result.agosto,
    //         septiembre: result.septiembre,
    //         octubre: result.octubre,
    //         noviembre: result.noviembre,
    //         diciembre: result.diciembre
    //     };


    //     if(month == 1) UpdateSet.enero += 1;
    //     else if(month == 2) UpdateSet.febrero += 1;
    //     else if(month == 3) UpdateSet.marzo += 1;
    //     else if(month == 4) UpdateSet.abril += 1;
    //     else if(month == 5) UpdateSet.mayo += 1;
    //     else if(month == 6) UpdateSet.junio += 1;
    //     else if(month == 7) UpdateSet.julio += 1;
    //     else if(month == 8) UpdateSet.agosto += 1;
    //     else if(month == 9) UpdateSet.septiembre += 1;
    //     else if(month == 10) UpdateSet.octubre += 1;
    //     else if(month == 11) UpdateSet.noviembre += 1;
    //     else if(month == 12) UpdateSet.diciembre += 1;

    //     const response = await this.prisma.staticticsForYear.update({ data:UpdateSet, where:{ staticticsForYearId:result.staticticsForYearId }});

    //     this.DistroyPrisma();
    //     return response;
    // }

    // async GetStatcticByYear({year}:{year:number}) {
    //     this.StartPrisma();
    //     const result = this.prisma.staticticsForYear.findFirst({ where:{year} })
    //     const date = new Date();
    //     this.DistroyPrisma();
    //     return { statictic: await result, yearRecive:year,yearNow:date.getFullYear() }

    // }

    // async GetYears({}:{}) {
    //     this.StartPrisma();
    //     const result = this.prisma.staticticsForYear.findMany({ select:{year:true,staticticsForYearId:true} });
    //     this.DistroyPrisma();
    //     return result;
    // }
}

export default AbstractModel;
