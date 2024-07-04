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
const passport_1 = __importDefault(require("passport"));
class AuthController extends BaseController_1.default {
    LoginRender(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // const result = await StockModel.StaticticsAll({});
            // console.log(result);
            return res.render(`p/login.hbs`);
        });
    }
    LoginController(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            passport_1.default.authenticate("local.login", {
                successRedirect: "/dashboard",
                failureRedirect: "/login",
                failureFlash: true
            })(req, res, next);
        });
    }
    LoadRouters() {
        this.router.get(`/login`, this.LoginRender);
        this.router.post(`/login`, this.LoginController);
        return this.router;
    }
}
exports.default = new AuthController();
