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
        return __awaiter(this, arguments, void 0, function* ({ data }) {
            try {
                this.StartPrisma();
                const result = yield this.prisma.control.create({
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
            }
            catch (error) {
                console.error(error);
                throw new Error(error);
            }
        });
    }
    Update(_a) {
        return __awaiter(this, arguments, void 0, function* ({ id, data }) {
            this.StartPrisma();
            const result = yield this.prisma.control.update({ data: {
                    // createId: data.createId,
                    date: data.date,
                    gr: data.gr,
                    kg: data.kg,
                    // machineId: data.machineId,
                    // rawmatterId: data.rawmatterId
                }, where: { controlId: id } });
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
    GetPagination(_a) {
        return __awaiter(this, arguments, void 0, function* ({ pag, limit }) {
            this.StartPrisma();
            const result = yield this.prisma.control.findMany({
                // include: {
                //     // createReference: true,
                //     // machineReference: true,
                //     // productReference: true,
                //     // rawmatterReference: true,
                // },
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
                }
            });
            if (!result) {
                return null;
            }
            const create = this.prisma.user.findFirst({ where: { userId: result.createId } });
            const machine = this.prisma.machine.findFirst({ where: { machineId: result.machineId } });
            const product = this.prisma.product.findFirst({ where: { productId: result.productId } });
            const rawmatter = this.prisma.rawmater.findFirst({ where: { rawmatterId: result.rawmatterId } });
            const control = {
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
                createReference: yield create,
                machineReference: yield machine,
                productReference: yield product,
                rawmatterReference: yield rawmatter,
            };
            this.DistroyPrisma();
            return control;
        });
    }
}
exports.default = new ControlModel();
