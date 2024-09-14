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
class StaticticsTransaction extends BaseModel_1.default {
    constructor() {
        super();
    }
    // crea
    create(_a) {
        return __awaiter(this, arguments, void 0, function* ({ num, name, type }) {
            const year = this.getYear();
            const month = this.getMonth();
            this.StartPrisma();
            const result = yield this.prisma.staticticsObjectsYear.create({
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
        });
    }
    // return statictics
    conectOrCreate(_a) {
        return __awaiter(this, arguments, void 0, function* ({ name, num, type = `Transaction` }) {
            const year = this.getYear();
            this.StartPrisma();
            const result = yield this.prisma.staticticsObjectsYear.findFirst({
                where: {
                    AND: [
                        { objectName: name },
                        { year }
                    ]
                }
            });
            this.DistroyPrisma();
            if (result) {
                const id = result.staticticsForYearId;
                this.update({ id, name, num });
                return result;
            }
            const create = yield this.create({ name, num, type });
            return create;
        });
    }
    getForYear(_a) {
        return __awaiter(this, arguments, void 0, function* ({ limit = 3, year, type }) {
            this.StartPrisma();
            const result = yield this.prisma.staticticsObjectsYear.findMany({
                skip: 0,
                take: limit,
                where: { objectType: type }
            });
            this.DistroyPrisma();
            return result;
        });
    }
    // incrementa
    update(_a) {
        return __awaiter(this, arguments, void 0, function* ({ name, num, id }) {
            const year = this.getYear();
            const month = this.getMonth();
            this.StartPrisma();
            const result = yield this.prisma.staticticsObjectsYear.update({
                data: {
                    year,
                    objectName: name,
                    total_month_1: month == 1 ? { increment: num } : { increment: 0 },
                    total_month_2: month == 2 ? { increment: num } : { increment: 0 },
                    total_month_3: month == 3 ? { increment: num } : { increment: 0 },
                    total_month_4: month == 4 ? { increment: num } : { increment: 0 },
                    total_month_5: month == 5 ? { increment: num } : { increment: 0 },
                    total_month_6: month == 6 ? { increment: num } : { increment: 0 },
                    total_month_7: month == 7 ? { increment: num } : { increment: 0 },
                    total_month_8: month == 8 ? { increment: num } : { increment: 0 },
                    total_month_9: month == 9 ? { increment: num } : { increment: 0 },
                    total_month_10: month == 10 ? { increment: num } : { increment: 0 },
                    total_month_11: month == 11 ? { increment: num } : { increment: 0 },
                    total_month_12: month == 12 ? { increment: num } : { increment: 0 }
                },
                where: {
                    staticticsForYearId: id
                }
            });
            this.DistroyPrisma();
            return result;
        });
    }
    getYear() {
        const date = new Date();
        return date.getFullYear();
    }
    getMonth() {
        const date = new Date();
        return date.getMonth() + 1;
    }
}
exports.default = new StaticticsTransaction();
