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
const BaseController_1 = __importDefault(require("../BaseController"));
const StaticticsTransaction_1 = __importDefault(require("../../models/statictics/StaticticsTransaction"));
class StaticticsController extends BaseController_1.default {
    // estadisticas por year
    APIStaticsForYear(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { year } = req.query;
            let yearSend = year;
            if (!year) {
                const date = new Date();
                yearSend = date.getFullYear();
            }
            // const response = await UserModel.GetStatcticByYear({ year:Number(yearSend) });
            return res.json({ body: [] });
        });
    }
    APIAPIStaticsObjectYear(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const year = StaticticsTransaction_1.default.getYear();
            const type = req.query.type ? req.query.type : `Transaction`;
            const resultPromise = StaticticsTransaction_1.default.getForYear({ limit: 10, year, type });
            const label = ['En', 'Fe', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
            const series = [];
            const result = yield resultPromise;
            result.forEach(item => {
                const data = [
                    item.total_month_1,
                    item.total_month_2,
                    item.total_month_3,
                    item.total_month_4,
                    item.total_month_5,
                    item.total_month_6,
                    item.total_month_7,
                    item.total_month_8,
                    item.total_month_9,
                    item.total_month_10,
                    item.total_month_11,
                    item.total_month_12,
                ];
                series.push({ data, name: item.objectName });
            });
            return res.json({ label, series });
        });
    }
    LoadRoutes() {
        this.router.get(`/api/statictics/foryear`, this.APIStaticsForYear);
        this.router.get(`/api/statictics/generic`, this.APIAPIStaticsObjectYear);
        return this.router;
    }
}
exports.default = new StaticticsController();
