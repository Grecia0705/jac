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
const UserModel_1 = __importDefault(require("../models/user/UserModel"));
const express_1 = require("express");
class BaseController {
    constructor() {
        this.adminTest = null;
        this.lan = `es`;
        this.router = (0, express_1.Router)();
    }
    InsertUserBase(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const listResponse = [];
                const model = UserModel_1.default;
                const superadmin = {
                    email: `superadmin@example.com`,
                    lastname: `Admin`,
                    name: `Super`,
                    password: yield model.HashPassword({ password: `super.123.` }),
                    username: `superadmin`,
                    createBy: null,
                };
                const superadminResult = yield model.CreateUser({ data: superadmin, rol: "ROOT", description: `Creación de usuario por defecto: Correo${superadmin.email} Nombre:${superadmin.name} Apellido:${superadmin.lastname} Usuario:${superadmin.username}` });
                listResponse.push(`UserCreate: ${superadminResult.name} ${superadminResult.lastname}`);
                return res.status(200).json({ body: listResponse });
            }
            catch (error) {
                return res.status(500).json({ ok: false });
            }
        });
    }
    StartStaticticsForYear(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const date = new Date();
            const year = date.getFullYear();
            // const result = await UserModel.CreateStatictisForYear({ year });
            // return res.json({ body:result });
        });
    }
    Logout(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            req.logOut(() => {
                return res.redirect(`/`);
            });
        });
    }
}
exports.default = BaseController;
