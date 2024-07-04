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
class UserModel extends BaseModel_1.default {
    constructor() {
        super();
    }
    // get users pagination
    GetUsers(_a) {
        return __awaiter(this, arguments, void 0, function* ({ pag, limit = 10 }) {
            const result = yield this.prisma.user.findMany({
                skip: pag * 10,
                take: limit,
                where: {
                    delete_at: false
                }
            });
            return result;
        });
    }
    CountBy(_a) {
        return __awaiter(this, arguments, void 0, function* ({ filter }) {
            const result = yield this.prisma.user.count({ where: filter });
            return result;
        });
    }
    // crea usuario
    CreateUser(_a) {
        return __awaiter(this, arguments, void 0, function* ({ data, rol }) {
            this.StartPrisma();
            const result = yield this.prisma.user.create({
                data: {
                    email: data.email,
                    lastname: data.lastname,
                    name: data.name,
                    password: data.password,
                    username: data.username,
                    rol: rol ? rol : `ADMIN`
                }
            });
            this.DistroyPrisma();
            // this.StaticticsUpdate({});
            return result;
        });
    }
    // busca usuario por email
    FindUserByEmail(_a) {
        return __awaiter(this, arguments, void 0, function* ({ email }) {
            this.StartPrisma();
            const result = yield this.prisma.user.findFirst({
                where: {
                    AND: {
                        email,
                        delete_at: false,
                    }
                }
            });
            this.DistroyPrisma();
            return result;
        });
    }
    // busca usuario por usuario
    FindUserByUsername(_a) {
        return __awaiter(this, arguments, void 0, function* ({ username }) {
            this.StartPrisma();
            const result = yield this.prisma.user.findFirst({
                where: {
                    username,
                    delete_at: false
                }
            });
            this.DistroyPrisma();
            return result;
        });
    }
    // busca usuario por id
    FindUserById(_a) {
        return __awaiter(this, arguments, void 0, function* ({ id }) {
            this.StartPrisma();
            const result = yield this.prisma.user.findFirst({ where: {
                    AND: {
                        delete_at: false,
                        userId: id
                    }
                } });
            this.DistroyPrisma();
            return result;
        });
    }
    // actualiza usuario por id
    UpdateUser() {
        return __awaiter(this, void 0, void 0, function* () {
            this.StartPrisma();
            this.DistroyPrisma();
        });
    }
    // agrega eliminación de uaurio
    AtDeleteUser(_a) {
        return __awaiter(this, arguments, void 0, function* ({ id }) {
            this.StartPrisma();
            yield this.prisma.user.update({ data: { delete_at: true }, where: { userId: id } });
            this.DistroyPrisma();
            return null;
        });
    }
    // elimina usuario
    DeleteUser() {
        return __awaiter(this, void 0, void 0, function* () {
            this.StartPrisma();
            this.DistroyPrisma();
        });
    }
    // compara contrasenias
    ComparePassword(_a) {
        return __awaiter(this, arguments, void 0, function* ({ password, dbPassword }) {
            const result = yield this.bcrypt.compare(password, dbPassword);
            return result;
        });
    }
    // encripta contrasenia
    HashPassword(_a) {
        return __awaiter(this, arguments, void 0, function* ({ password }) {
            const result = yield this.bcrypt.hash(password, 15);
            return result;
        });
    }
    StaticticsTopUsers(_a) {
        return __awaiter(this, arguments, void 0, function* ({ limit }) {
            // const transaction = await TransactionModel.UsersActives({ limit:5 });
            // return transaction;
            this.StartPrisma();
            const result = this.prisma.user.findMany({
                include: {
                    _count: true,
                },
                skip: 0,
                take: limit
            });
            this.DistroyPrisma();
            return result;
        });
    }
}
exports.default = new UserModel();
