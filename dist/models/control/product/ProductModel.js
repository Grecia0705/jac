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
const BaseModel_1 = __importDefault(require("../../BaseModel"));
class ProductModel extends BaseModel_1.default {
    constructor() {
        super();
    }
    Create(_a) {
        return __awaiter(this, arguments, void 0, function* ({ data }) {
            this.StartPrisma();
            const result = yield this.prisma.product.create({ data });
            this.DistroyPrisma();
            return result;
        });
    }
    Update(_a) {
        return __awaiter(this, arguments, void 0, function* ({ id, data }) {
            this.StartPrisma();
            const result = yield this.prisma.product.update({ data, where: { productId: id } });
            this.DistroyPrisma();
            return result;
        });
    }
    AtDelete(_a) {
        return __awaiter(this, arguments, void 0, function* ({ id }) {
            this.StartPrisma();
            yield this.prisma.product.update({ data: { delete_at: true }, where: { productId: id } });
            this.DistroyPrisma();
            return null;
        });
    }
    GetPagination(_a) {
        return __awaiter(this, arguments, void 0, function* ({ pag, limit }) {
            this.StartPrisma();
            const result = yield this.prisma.product.findMany({
                where: {
                    delete_at: false,
                },
                include: {
                    createReference: true
                },
                skip: pag * limit,
                take: limit,
            });
            this.DistroyPrisma();
            return result;
        });
    }
    CountAll() {
        return __awaiter(this, void 0, void 0, function* () {
            this.StartPrisma();
            const result = yield this.prisma.product.count();
            this.DistroyPrisma();
            return result;
        });
    }
    GetById(_a) {
        return __awaiter(this, arguments, void 0, function* ({ id }) {
            this.StartPrisma();
            const result = yield this.prisma.product.findFirst({
                where: {
                    productId: id,
                    delete_at: false,
                },
                include: {
                    createReference: true
                }
            });
            this.DistroyPrisma();
            return result;
        });
    }
}
exports.default = new ProductModel();
