
//get HTML elements

const userTabs = document.getElementById('tabs');
const userSets = document.getElementById('sets');
const container = document.getElementById('container');
const form = document.getElementById('form');
const warning = document.getElementById('warning');
const drilling = document.getElementById('drilling');
const collating = document.getElementById('collating');
const ink = document.getElementById('ink');

//HTML value element for displaying prices

const userTabValue = document.getElementById('userTabValue');
const userSetValue = document.getElementById('userSetValue');
const basePriceValue = document.getElementById('basePriceValue');
const drillingPriceValue = document.getElementById('drillingPriceValue');
const collatingPriceValue = document.getElementById('collatingPriceValue');
const inkPriceValue = document.getElementById('inkPriceValue');
const finalPriceEstValue = document.getElementById('finalPriceEstValue');

//reset all values

const resetValues = () => {
    //reset all values 
    finalPriceEstValue.innerHTML = `<strong>—</strong>`;
                    
    //reset drilling
    drilling.value = "none";
    drillingPrice = 0;
    drillingPriceValue.innerHTML = `+0`;

    //reset collating
    collating.value = "uncollated";
    collatingPrice = 0;
    collatingPriceValue.innerHTML = `+0`;

    //reset ink
    ink.value = "black";
    inkPrice = 0;
    inkPriceValue.innerHTML = `+0`;
}

//start calculating
const quoteApp = async() => {
    let baseBeforeOther = 0;
    let drillingAddition = 0;
    let collatingAddition = 0;
    let inkAddition = 0;
    let finalPrice = 0;   

    //all initial OTHER SPECS innerHTML
    drillingPriceValue.innerHTML = `+0`;
    collatingPriceValue.innerHTML = `+0`;
    inkPriceValue.innerHTML = `+0`;
    finalPriceEstValue.innerHTML = `<strong>—</strong>`;

    //drilling, collating and ink price functions for change events
    function getDrillingPrice(event) {
        let drillingPrice = 0;
        finalPrice = baseBeforeOther;
        if (event.target.value === "drilling-two") {
            let allTabs = userTabs.value * userSets.value;
            let newVal = allTabs * 0.005;
            drillingPrice = newVal;
            drillingAddition = newVal;
        } else if (event.target.value === "drilling-three") {
            drillingPrice = 15;
            drillingAddition = 15;
        } else if (event.target.value === "drilling-four") {
             drillingPrice = 20;
             drillingAddition = 20;
        } else {
            drillingPrice = 0;
            drillingAddition = 0;
        }            
        drillingPriceValue.innerHTML = `+${drillingPrice}`;

        finalPrice = Math.trunc(finalPrice) + Math.trunc(drillingPrice) + Math.trunc(collatingAddition) + Math.trunc(inkAddition);
        finalPriceEstValue.innerHTML = `<strong>$${Math.trunc(finalPrice)}</strong>`;
    }

    function getCollatingPrice(event){
        let collatingPrice = 0;
        finalPrice = baseBeforeOther;
        if (event.target.value === "collated-one") {
            let allTabs = userTabs.value * userSets.value;
            let newVal = allTabs * 0.024;
            collatingPrice = newVal;
            collatingAddition = newVal;
        } else if (event.target.value === "collated-two") {
            let allTabs = userTabs.value * userSets.value;
            let newVal = allTabs * 0.024;
            let setAddition = userSets.value * 0.30;
            collatingPrice = newVal + setAddition;
            collatingAddition = newVal + setAddition;
        } else {
            collatingPrice = 0;
            collatingAddition = 0;
        }
        collatingPriceValue.innerHTML = `+${collatingPrice}`;
        finalPrice = Math.trunc(finalPrice) + Math.trunc(collatingPrice) + Math.trunc(drillingAddition) + Math.trunc(inkAddition);
        finalPriceEstValue.innerHTML = `<strong>$${Math.trunc(finalPrice)}</strong>`;
    }

    function getInkPrice(event){
        let inkPrice = 0;
        finalPrice = baseBeforeOther;
        if (event.target.value === "color") {
            inkPrice = 92.82;
            inkAddition = 92.82;
        } else {
            inkPrice = 0;
            inkAddition = 0;
        }
        inkPriceValue.innerHTML = `+${inkPrice}`;
        finalPrice = Math.trunc(finalPrice) + Math.trunc(inkPrice) + Math.trunc(drillingAddition) + Math.trunc(collatingAddition);
        finalPriceEstValue.innerHTML = `<strong>$${Math.trunc(finalPrice)}</strong>`;
    }
    
    //calculating
    try{
        const response = await fetch('https://github.com/a-sheeter/custom-quote/blob/main/quote.json');
        //const response = await fetch('https://statindex.wpengine.com/wp-content/stat.json');

        //check response
        if (response.ok) {
            const jsonResponse = await response.json();


            //loop through all keys
            for (const [key] of Object.entries(jsonResponse)) {
                let statKey = jsonResponse[key];

                //pricing
                let basePrice = 0;

                //if no input
                if (userSets.value >= statKey.start && userSets.value <= statKey.end) {
                    if (userTabs.value <= 20) {
                        basePrice = statKey.tabs[userTabs.value];
                    } else {
                        let excessTabs = userTabs.value - 20;
                        let extraPrice = excessTabs * statKey.adl;
                        basePrice = statKey.tabs[20] + extraPrice;
                    }
                } 

                if (basePrice > 0) {
                    //check for < $100

                    if (userTabs.value < 4 && userSets.value < 50){
                        baseBeforeOther = 100;
                        finalPrice = 100;
                    } else {
                        baseBeforeOther = Math.trunc((basePrice * userSets.value)); 
                        finalPrice = Math.trunc((basePrice * userSets.value)); 
                    }

                    //Post Prices
                    userTabValue.innerHTML = `${userTabs.value}`;
                    userSetValue.innerHTML = `${userSets.value}`;
                    basePriceValue.innerHTML = `<strong>$${finalPrice}</strong>`;

                    //drilling, collating and ink
                    drilling.addEventListener('change', getDrillingPrice);
                    collating.addEventListener('change', getCollatingPrice);
                    ink.addEventListener('change', getInkPrice);

                }

                //if tab input
                userTabs.addEventListener('input', function handleChange(event){

                    resetValues();

                    let tabQuantity = event.target.value;
                    let basePriceBaby = 0;

                    if (userSets.value >= statKey.start && userSets.value <= statKey.end) {

                        if (tabQuantity <= 20) {
                            basePriceBaby = statKey.tabs[tabQuantity];
                        } else {
                            let excessTabs = tabQuantity - 20;
                            let extraPrice = excessTabs * statKey.adl;
                            basePriceBaby = statKey.tabs[20] + extraPrice;
                        }
                    } else {
                        return
                    }
                    
                    //check for < 100

                    if (userTabs.value < 4 && userSets.value < 50) {
                        baseBeforeOther = 100;
                        finalPrice = 100;
                    } else {
                        baseBeforeOther = Math.trunc((basePriceBaby * userSets.value));
                        finalPrice = Math.trunc((basePriceBaby * userSets.value));
                    }

                    userTabValue.innerHTML = `${userTabs.value}`;
                    userSetValue.innerHTML = `${userSets.value}`;
                    basePriceValue.innerHTML = `<strong>$${finalPrice}</strong>`;

                    //drilling, collating and ink
                    drilling.addEventListener('change', getDrillingPrice);
                    collating.addEventListener('change', getCollatingPrice);
                    ink.addEventListener('change', getInkPrice);

                    })

                //if set input
                userSets.addEventListener('input', function handleChange(event){

                    resetValues();

                    let setQuantity = event.target.value;
                    let basePriceChica = 0;

                    if (setQuantity >= statKey.start && setQuantity <= statKey.end) {

                        if (userTabs.value <= 20) {
                            basePriceChica = statKey.tabs[userTabs.value];
                        } else {
                            let excessTabs = userTabs.value - 20;
                            let extraPrice = excessTabs * statKey.adl;
                            basePriceChica = statKey.tabs[20] + extraPrice;
                        }
                    } else {
                        return
                    }

                    //check if < 100

                    if (userTabs.value < 4 && userSets.value < 50) {
                        baseBeforeOther = 100;
                        finalPrice = 100;
                    } else {
                        baseBeforeOther = Math.trunc((basePriceChica * setQuantity));
                        finalPrice = Math.trunc((basePriceChica * setQuantity));
                    }
                    
                    userTabValue.innerHTML = `${userTabs.value}`;
                    userSetValue.innerHTML = `${userSets.value}`;
                    basePriceValue.innerHTML = `<strong>$${finalPrice}</strong>`;

                    //drilling, collating and ink
                    drilling.addEventListener('change', getDrillingPrice);
                    collating.addEventListener('change', getCollatingPrice);
                    ink.addEventListener('change', getInkPrice);

                    })
                
                
            }
        }

    } catch(error) {
        console.log(error)
    }

}

quoteApp();
