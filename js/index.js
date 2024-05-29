
var productNameInput = document.getElementById('productName');
var productPriceInput = document.getElementById('productPrice');
var productCategoryInput = document.getElementById('productCategory');
var productDescInput = document.getElementById('productDesc');
var productImgInput = document.getElementById('productImg');
var body = document.getElementById('tbody');
var addBtn = document.getElementById('add-btn');
var updateBtn = document.getElementById('update-btn');
var cancelBtn = document.getElementById('cancel-btn');
var productList= [];

var inputs = {
    productName : {
        isValid : false,
        regex: /^[A-Z][a-z]{3,8}\s[a-zA-Z0-9]{2,10}$/
    },
    productPrice : {
        isValid : false,
        regex : /^(([1-9]\d\d{0,3})|100000)$/
    },
    productCategory : {
        isValid: false,
        regex : /^(TV|Mobile|Labtop)$/
    },
    productDesc : {
        isValid: false,
        regex: /\w{4,100}/
    },
    productImg :{
        isValid : false
    }
}

var inputsIterate ={
    prodcutName : productNameInput,
    productPrice: productPriceInput,
    productCategory : productCategoryInput,
    productDesc : productDescInput,
    productImg : productImgInput
}

function iterateForUpdate(){
    for(var input in inputsIterate){
        if(inputsIterate[input].id == "productImg")
            validateImg(inputsIterate[input]);
        else
            validateInput(inputsIterate[input]);
    }
}


if(localStorage.getItem('userProduct')){
    productList = JSON.parse(localStorage.getItem('userProduct'));
    displayData(productList);
}



function addProduct(){

    var product = {
        name: productNameInput.value,
        price: productPriceInput.value,
        categroy: productCategoryInput.value,
        desc: productDescInput.value,
        img: productImgInput.files[0]?.name
    }
    console.log(productImgInput.files[0]);
    productList.push(product);
    
    localStorage.setItem('userProduct', JSON.stringify(productList));
    emptyForm();
    displayData(productList);
    reset(inputs)
}

function emptyForm(){
    productNameInput.value = '';
    productPriceInput.value = '';
    productCategoryInput.value = '';
    productDescInput.value = '';
    productImgInput.value = '';
}

function displayData(arr){
    var container='';
    for(var i = 0; i < arr.length; i++){
        container +=`
        <tr>
            <td>${i+1}</td>
            <td>${arr[i].name}</td>
            <td>${arr[i].price}</td>
            <td> 
                <div class="img-container">
                    <img src="images/${arr[i].img}"></td>
                </div>
            <td>${arr[i].desc}</td>
            <td>${arr[i].categroy}</td>
            <td>
                <button onclick="deleteProduct(${i})" class="btn btn-danger btn-sm">Delete</button>
                <button onclick="setFormToUpdate(${i})" class="btn btn-warning btn-sm">Update</button>
            </td>
        </tr>
        `
    }
    body.innerHTML = container;
}


function deleteProduct(index){
    productList.splice(index, 1);
    localStorage.setItem('userProduct', JSON.stringify(productList));
    displayData(productList);
}


function enableUpdateBtns(){
    addBtn.classList.replace("d-block", "d-none");
    updateBtn.classList.replace("d-none", "d-block");
    cancelBtn.classList.replace("d-none", "d-block");
}

function disableUpdateBtns(){
    addBtn.classList.replace("d-none", "d-block");
    updateBtn.classList.replace("d-block", "d-none");
    cancelBtn.classList.replace("d-block", "d-none");
    emptyForm();
}

var updateIndex;
function setFormToUpdate(index){
    productNameInput.value= productList[index].name;
    productPriceInput.value = productList[index].price;
    productCategoryInput.value = productList[index].categroy;
    productDescInput.value = productList[index].desc;

    if(productList[index].img){
        var file = new File([productList[index].img], productList[index].img,
            {type: "image/jpg"}
        );
        var dataTransfer = new DataTransfer();
        
        dataTransfer.items.add(file);
        productImgInput.files = dataTransfer.files;
    }
    else{
        var dataTransfer = new DataTransfer();

        productImgInput.files = dataTransfer.files;
    }
    
    enableUpdateBtns();
    iterateForUpdate();

    updateIndex = index;
}


function updateProduct(){
    var product = {
        name: productNameInput.value,
        price: productPriceInput.value,
        categroy: productCategoryInput.value,
        desc: productDescInput.value,
        img: productImgInput.files[0]?.name
    }
    productList[updateIndex] = product;
    displayData(productList);
    localStorage.setItem('userProduct', JSON.stringify(productList));

    disableUpdateBtns();
    reset(inputs);
}

function cancelUpdate(){
    disableUpdateBtns();
}


function searchProduct(keySearch){
    var searchArr = [];
    for(var i = 0; i < productList.length; ++i){
        if(productList[i].name.toLowerCase().includes(keySearch.toLowerCase())){
            searchArr.push(productList[i]);
        }
    }

    displayData(searchArr);
}

function makeInputInvalid(input){
    input.classList.add("is-invalid");
    inputs[input.id].isValid = false;
}

function makeInputValid(input){
    input.classList.replace("is-invalid", "is-valid");
    inputs[input.id].isValid = true;
}

function validateForm(){
    if(isFormValid(inputs)) {
        addBtn.disabled = false;
        updateBtn.disabled = false;
    }
    else {
        addBtn.disabled = true;
        updateBtn.disabled = true;
    }   
}

function validateImg(input){
    var allowedExtensions = ["jpg", "jpeg", "png"];
    if(input.files[0] == undefined){
        makeInputInvalid(input);
        validateForm();
        return;
    }
    var extension = input.files[0].name.split('.').pop().toLowerCase();
    if(allowedExtensions.indexOf(extension) == -1){
        makeInputInvalid(input);
    }
    else{
        makeInputValid(input);  
    }
    validateForm();
}


function validateInput(input){
    if(inputs[input.id].regex.test(input.value)){
        makeInputValid(input);
    }
    else{
        makeInputInvalid(input);
    }

    validateForm();
}



function isFormValid(inputs){
    console.log(inputs);
    for(var input in inputs){
        if(!inputs[input].isValid) return false;
        
    }
    return true;
}


function reset(inputs){
    for(var input in inputs){
        inputs[input].isValid = false;
        var element = document.getElementById(input);
        if(element.classList.contains("is-valid"))
            element.classList.remove("is-valid");
        else if(element.classList.contains("is-invalid"))
            element.classList.remove("is-invalid");
    }
    addBtn.disabled = true;
}