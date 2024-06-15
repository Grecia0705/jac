import Handlebars from "express-handlebars";

const Helpers = {
    ifeq(path: string, page: string, options: any) {

        if (path === page) {
            console.log(this);
            return options.fn(`bello`);
          }
        return options.inverse(`no bello`);
    },
    
    validRoot(userRol: string, options: any) {
        const toRetunr = userRol == `ROOT` ? options.fn(true) : options.inverse(false);
        console.log(toRetunr);
        return toRetunr;
    },

    formatDate(date: any, options: any) {
        if(typeof date == `string`) return date; 
        return `${date.toString().split(`GMT`)[0]}`
    },

    PriceQuantity(price:number, quantity:number, options: any) {
        return price*quantity;
    }
    
};

export default Helpers;
