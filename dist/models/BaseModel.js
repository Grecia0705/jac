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
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt_1 = require("bcrypt");
class AbstractModel {
    constructor() {
        this.prisma = new client_1.PrismaClient();
        this.bcrypt = { compare: bcrypt_1.compare, hash: bcrypt_1.hash };
        this.prisma = new client_1.PrismaClient();
        this.bcrypt = { compare: bcrypt_1.compare, hash: bcrypt_1.hash };
    }
    StartPrisma() {
        return this.prisma = new client_1.PrismaClient();
    }
    DistroyPrisma() {
        return __awaiter(this, void 0, void 0, function* () {
            this.prisma.$disconnect();
        });
    }
}
exports.default = AbstractModel;
