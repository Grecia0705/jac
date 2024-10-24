"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BaseModel_1 = __importDefault(require("../BaseModel"));
class ControlModel extends BaseModel_1.default {
    constructor() {
        super();
    }
    Create(_a) {
        return __awaiter(this, arguments, void 0, function* ({ data, description, userId }) {
            try {
                console.log(data);
                this.StartPrisma();
                const result = yield this.prisma.control.create({
                    data: {
                        date: data.date,
                        gr: data.gr,
                        kg: data.kg,
                        createReference: { connect: { userId: data.createId } },
                        machineReference: { connect: { machineId: data.machineId } },
                        productReference: { connect: { productId: data.productId } },
                        rawmatterReference: { connect: { rawmatterId: data.rawmatterId } },
                    }
                });
                yield this.CreateHistory({
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
            catch (error) {
                console.error(error);
                throw new Error(error);
            }
        });
    }
    Update(_a) {
        return __awaiter(this, arguments, void 0, function* ({ id, data, description, userId }) {
            this.StartPrisma();
            const result = yield this.prisma.control.update({ data: {
                    // createId: data.createId,
                    date: data.date,
                    gr: data.gr,
                    kg: data.kg,
                    // machineId: data.machineId,
                    // rawmatterId: data.rawmatterId
                    createReference: { connect: { userId: data.createId } },
                    machineReference: { connect: { machineId: data.machineId } },
                    rawmatterReference: { connect: { rawmatterId: data.rawmatterId } },
                    productReference: { connect: { productId: data.productId } }
                }, where: { controlId: id } });
            yield this.CreateHistory({
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
        });
    }
    ToDelete(_a) {
        return __awaiter(this, arguments, void 0, function* ({ id }) {
            this.StartPrisma();
            // const result = await this.prisma.control.update({ data:{}, where:{controlId:id} });
            this.DistroyPrisma();
            return null;
        });
    }
    CountAll() {
        return __awaiter(this, void 0, void 0, function* () {
            this.StartPrisma();
            const result = yield this.prisma.control.count();
            this.DistroyPrisma();
            return result;
        });
    }
    CountAllBy(_a) {
        return __awaiter(this, arguments, void 0, function* ({ filter }) {
            this.StartPrisma();
            const result = yield this.prisma.control.count({ where: filter });
            this.DistroyPrisma();
            return result;
        });
    }
    GetPagination(_a) {
        return __awaiter(this, arguments, void 0, function* ({ pag, limit }) {
            this.StartPrisma();
            const result = yield this.prisma.control.findMany({
                include: {
                    machineReference: true,
                    productReference: true,
                    rawmatterReference: true,
                },
                skip: pag * limit,
                take: limit,
            });
            this.DistroyPrisma();
            return result;
        });
    }
    GetById(_a) {
        return __awaiter(this, arguments, void 0, function* ({ id }) {
            this.StartPrisma();
            const result = yield this.prisma.control.findFirst({
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
            if (!result) {
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
        });
    }
    ReportEvent(_a) {
        return __awaiter(this, arguments, void 0, function* ({ filter, skip, take }) {
            this.StartPrisma();
            const result = yield this.prisma.control.findMany({
                where: filter,
                skip,
                take,
                include: {
                    machineReference: true,
                    productReference: true,
                    rawmatterReference: true,
                }
            });
            const count = yield this.prisma.control.count({ where: filter });
            this.DistroyPrisma();
            return { result, count };
        });
    }
}
exports.default = new ControlModel();
