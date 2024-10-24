"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Helpers = {
    ifeq(path, page, options) {
        if (path === page) {
            return options.fn(`bello`);
        }
        return options.inverse(`no bello`);
    },
    validRoot(userRol, options) {
        const toRetunr = userRol == `ROOT` ? options.fn(true) : options.inverse(false);
        return toRetunr;
    },
    equal(id1, id2, options) {
        const toRetunr = id1 == id2 ? options.fn(true) : options.inverse(false);
        return toRetunr;
    },
    formatDate(date, options) {
        if (typeof date == `string`)
            return date;
        return `${date.toString().split(`GMT`)[0]}`;
    },
    PriceQuantity(price, quantity, options) {
        return price * quantity;
    }
};
exports.default = Helpers;
