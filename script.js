let phonesSelect = null;
let addPhoneButton = null;
let discountInput = null;
let unlimitedLineSelect = null;
let hasXMCButton = null;
let hasUnlimitedLineCB = null;


let DISCOUNTINPUTMAX = 1300;
let DISCOUNTINPUTMIN = 0;


const UnlimitedLineSavings = 40;
const premiumUnlimitedCost = 33;
const unlimitedCost = 23;


const UnlimitedLineOptions = {
    "Premium": "0",
    "Unlimited": "1"
};

const CARTMAXSIZE = 10;


let Cart = [];



function QualifiesForFreeLine(){
    for (const ph of Cart){
        if (ph["Free Line"] === true)
        {
            return false;
        }
    }
    return true;
}


function RemovePhoneFromCart(e){
    let parentNode = e.target.parentNode;
    let phoneName = parentNode.querySelector("h2").textContent;
    let phoneCost = parseFloat(parentNode.querySelector(".price").textContent.substr(1));

    let removeIndex = Cart.findIndex((phone) => {return phone["PhoneName"] === phoneName && phone["Cost"] == phoneCost});
    

    Cart.splice(removeIndex, 1);
    if (removeIndex === 0 && Cart.length === 1){
        Cart[0].Cost += 20;
        Cart[0].Card.querySelector(".price").textContent = Cart[0].Cost.toFixed(2);
    }

    parentNode.remove();
}


function CreatePhoneCard(phoneName, phoneCost){
    let phoneElement = document.createElement("div");
    phoneElement.classList.add("phone");

    let phoneHeader = document.createElement("div");
    phoneHeader.classList.add("phone-header");

    let phoneNameH2 = document.createElement("h2");
    phoneNameH2.textContent = phoneName;


    let phoneBody = document.createElement("div");
    phoneBody.classList.add("phone-body");
    
    let phoneBodyP1 = document.createElement("p");
    phoneBodyP1.textContent = "Estimated monthly price:";

    let phoneBodyP2 = document.createElement("p");
    phoneBodyP2.classList.add("price");
    phoneBodyP2.textContent = "$" + phoneCost.toFixed(2);

    let removeButton = document.createElement("button");
    removeButton.type = "button";
    removeButton.innerHTML = "Remove";
    removeButton.addEventListener("click", RemovePhoneFromCart);
    removeButton.addEventListener("click", Update);

    phoneHeader.appendChild(phoneNameH2);

    phoneBody.appendChild(phoneBodyP1);
    phoneBody.appendChild(phoneBodyP2);

    phoneElement.appendChild(phoneHeader);
    phoneElement.appendChild(phoneBody);
    phoneElement.appendChild(removeButton);


    document.getElementById("phones-deck").appendChild(phoneElement);
    
    return phoneElement;
}


function CalculatePhoneCost(phone, discount, unlimitedLineCost, hasXMC){
    let phonePrice = Math.floor((phone.Price / 24) * 100) / 100;
    let xmcPrice = phone[phoneParams.XMCPrice];
    let monthlyDiscount = Math.floor((discount / 24) * 100) / 100;


    if (QualifiesForFreeLine() && hasUnlimitedLineCB.checked){

        if (Cart.length == 0){
            unlimitedLineCost = unlimitedLineCost - UnlimitedLineSavings;
        }else{
            unlimitedLineCost = unlimitedLineCost - (UnlimitedLineSavings / 2);
        }
    }


    if (Cart.length === 0){
        phonePrice += 20;
    }
    if (!hasXMC){
        return Math.max((unlimitedLineCost + phonePrice) - monthlyDiscount, 0);
    }
    else{
        return Math.max((unlimitedLineCost + phonePrice + xmcPrice) - monthlyDiscount, 0);
    }
}



function InitializePhonesSelect(){
    if (!ValidatePhonesSelect()){
        return;
    }
    for (const phone of phones){
        let phoneOption = document.createElement("option");
        phoneOption.value = phone["PhoneName"];
        phoneOption.innerHTML = phone["PhoneName"];
        phonesSelect.appendChild(phoneOption);
    }

}


function ValidatePhonesSelect(){
    if (phonesSelect.tagName !== "SELECT"){
        console.error("Invalid type for phonesSelect");
        return false;
    }
    return true;

}

function ValidateUnlimitedLineSelect(){
    if (unlimitedLineSelect.tagName !== "SELECT"){
        console.error("Invalid type for unlimitedLineSelect");
        return false;
    }
    return true;
}

function ValidateDiscountInput(){
    if (discountInput.tagName !== "INPUT" || discountInput.type !== "number"){
        console.error("Invalid type for discountInput");
        return false;
    }

    if (discountInput.value < DISCOUNTINPUTMIN){
        discountInput.value = DISCOUNTINPUTMIN;
    }
    else if (discountInput.value > DISCOUNTINPUTMAX){
        discountInput.value = DISCOUNTINPUTMAX;
    }

    return true;

}

function GetUnlimitedLineCost(){
    const unlimitedPlan = unlimitedLineSelect.value;    
    if (unlimitedPlan === null || unlimitedPlan === undefined){
        return 0;
    }
    if (unlimitedPlan === UnlimitedLineOptions.Premium){
        return 33;
    }else if (unlimitedPlan === UnlimitedLineOptions.Unlimited){
        return 23;
    }else{
        return 0;
    }
}

function AddPhoneToCart(){
    if (addPhoneButton.tagName !== "BUTTON"){
        console.error("Invalid type for addPhoneButton");
        return;
    }

    if (!(ValidateDiscountInput() && ValidatePhonesSelect() && ValidateUnlimitedLineSelect())){
        return;
    }


    if (Cart.length + 1 > CARTMAXSIZE){
        return;
    }


    const phoneName = phonesSelect.value;
    let discount = discountInput.value;
    const hasXmc = hasXMCButton.checked;
    let phone = phones.find((element)=>{return element["PhoneName"] === phoneName});


    if (phone === undefined){
        console.error("Unable to find phone in collection");
        return;
    }




    let phoneCost = parseFloat(CalculatePhoneCost(phone, discount, GetUnlimitedLineCost(), hasXmc));    
    let phoneCard = CreatePhoneCard(phone.PhoneName, phoneCost);    
    Cart.push({"PhoneName":phone.PhoneName, "Cost":phoneCost, "Card": phoneCard, "Free Line": hasUnlimitedLineCB.checked});
    ResetForm(phones[0]);
}


function UpdateParagraphPrice(phone, discount, hasXMC){
    let priceParagraph = document.getElementById("main-price");
    priceParagraph.textContent = "$" + CalculatePhoneCost(phone, discount, GetUnlimitedLineCost(), hasXMC).toFixed(2);

}


function ResetForm(ph){
    discountInput.value = 0.00;
    hasXMCButton.checked = false;
    UpdateParagraphPrice(ph, discountInput.value, hasXMCButton.checked);
}


function ValidateFreeLineCheckbox(){
    if (!QualifiesForFreeLine()){
        hasUnlimitedLineCB.checked = false;
        hasUnlimitedLineCB.disabled = true;
    }
    else{
        hasUnlimitedLineCB.disabled = false;
    }
}


function Update(e){    
    console.log("Update Triggered", e.target);
    let phone = phones.find((ph) => {return ph.PhoneName === phonesSelect.value});
    let discount = discountInput.value;
    let hasXMC = hasXMCButton.checked;

    if (hasXMC === null || hasXMC === undefined){
        hasXMC = false;
    }
    

    ValidateFreeLineCheckbox();

    UpdateParagraphPrice(phone, discount, hasXMC);

}


function Initialize(){
    phonesSelect = document.getElementById("phones");

    if (phonesSelect !== null){
        InitializePhonesSelect();
        phonesSelect.addEventListener("change", Update);
    }

    discountInput = document.getElementById("discount");
    if (discountInput !== null){
        discountInput.addEventListener("change", ValidateDiscountInput);
        discountInput.addEventListener("change", Update);
    }
    addPhoneButton = document.getElementById("add-phone");

    if (addPhoneButton !== null){
        addPhoneButton.addEventListener("click", AddPhoneToCart);
    }

    unlimitedLineSelect = document.getElementById("unlimited-line-options");
    unlimitedLineSelect.addEventListener("change", Update);

    hasXMCButton = document.getElementById("xmc");
    hasXMCButton.addEventListener("change", Update);

    hasUnlimitedLineCB = document.getElementById("free-line");
    hasUnlimitedLineCB.addEventListener("change", Update);

}





document.addEventListener("DOMContentLoaded", Initialize);