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
exports.pushPdf = void 0;
// import PDFDocument from "pdfkit";
const pdfkit_table_1 = __importDefault(require("pdfkit-table"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const pushPdf = (_a) => __awaiter(void 0, [_a], void 0, function* ({ title, headers, rows, filter, count }) {
    const date = new Date();
    const ext = `pdf`;
    const datetime = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDay()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
    const name = `report.pdf`;
    const doc = new pdfkit_table_1.default({ margin: 30, size: 'A4' });
    doc.font('Times-Roman');
    const downlaodPath = `/docs/report/${name}`;
    // doc.text('Reporte', 0, 0);
    doc.text(`Manufacturas JAC - Reporte ${datetime}`);
    (function () {
        return __awaiter(this, void 0, void 0, function* () {
            doc.text(`Resultados: ${count}`, { height: 10 });
            filter.forEach((item) => {
                doc.text(item);
            });
            const table = {
                title,
                headers,
                rows
            };
            doc.table(table, { title: `Reporte` });
            doc.end();
        });
    })();
    doc.pipe(fs_1.default.createWriteStream(path_1.default.join(`public/docs/report/${name}`)));
    return { path: ``, download: downlaodPath };
});
exports.pushPdf = pushPdf;
