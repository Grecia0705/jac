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
    LoadRoutes() {
        this.router.get(`/api/statictics/foryear`, this.APIStaticsForYear);
        return this.router;
    }
}
exports.default = new StaticticsController();
