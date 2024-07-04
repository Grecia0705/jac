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
class StockModel extends BaseModel_1.default {
    constructor() {
        super();
    }
    Create(_a) {
        return __awaiter(this, arguments, void 0, function* ({ data }) {
            this.StartPrisma();
            const result = yield this.prisma.stock.create({ data });
            this.DistroyPrisma();
            return result;
        });
    }
    Update(_a) {
        return __awaiter(this, arguments, void 0, function* ({ id, data }) {
            this.StartPrisma();
            const result = yield this.prisma.stock.update({ data, where: { stockId: id } });
            this.DistroyPrisma();
            return result;
        });
    }
    ToDelete(_a) {
        return __awaiter(this, arguments, void 0, function* ({ id }) {
            this.StartPrisma();
            // const result = await this.prisma.stock.update({ data:{}, where:{controlId:id} });
            this.DistroyPrisma();
            return null;
        });
    }
    GetPagination(_a) {
        return __awaiter(this, arguments, void 0, function* ({ pag, limit }) {
            this.StartPrisma();
            const result = yield this.prisma.stock.findMany({
                include: {
                    createReference: true
                },
                where: {
                    delete_at: false,
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
            const result = yield this.prisma.stock.findFirst({
                where: {
                    stockId: id,
                    delete_at: false,
                },
                include: {
                    createReference: true,
                }
            });
            this.DistroyPrisma();
            return result;
        });
    }
    AtDeleteStock(_a) {
        return __awaiter(this, arguments, void 0, function* ({ id }) {
            this.StartPrisma();
            yield this.prisma.stock.update({ data: { delete_at: true }, where: { stockId: id } });
            this.DistroyPrisma();
            return null;
        });
    }
}
exports.default = new StockModel();
