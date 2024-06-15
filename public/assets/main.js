
// logic product
const doc = document.getElementById('t-servicetype');


doc.addEventListener(`change`, (ev) => {
    const val = ev.target.value;
    const extractValue = val.split(`---`)[1];
    const products = document.querySelectorAll(`.productsExpenses`);
    products.forEach((key,i) => {
        const twoValue = key.value.split(`---`);
        if(twoValue[0] == extractValue) {
            const compareName = extractValue;
            const hereText = document.getElementById('productGoHere');
            hereText.textContent = `Cuanto se gastó? (${twoValue[1]})`;
            return;
        };
    })
})
