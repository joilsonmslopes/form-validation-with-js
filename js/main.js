const cep = document.querySelector("#cep");
const btnSubmit = document.querySelector("#btnSubmit");
const formSubmit = document.querySelector("#formSubmit");
const fullName = document.querySelector("#name");

async function getCEP(cepValue) {
    const options = {
        method: "GET",
        mode: "cors",
        cache: "default"
    }

    try {
        const url = await `https://viacep.com.br/ws/${cepValue}/json/`;
        const response = await fetch(url, options);

        const data = await response.json();
        return data;
    } catch (error) {
        console.log(error);
        return {erro: true}
    }
}

cep.addEventListener("input", e => {
    inputCepCheck();
});

async function inputCepCheck() {
    const cepValue = cep.value.trim().replace("-", "");

    if (cepValue === "" || cepValue === null || cepValue === undefined) {
        setErrorFor(cep, "Este campo é requerido");
        hideCEPInputs();
        return false;
    }
    
    if (cepValue.length < 8 || cepValue.length > 8) {
        setErrorFor(cep, "1: Por favor, digite um CEP válido");
        hideCEPInputs();
        return false;
    }
    
    const response = await getCEP(cepValue);

    try {
        if (response.erro === true) {
            setErrorFor(cep, "2: Por favor, digite um CEP válido");
            hideCEPInputs();
            return false;
        } else {
            setSuccessFor(cep);
            showDataCEP(response);
            showCEPInputs();
            return true;
        }
    } catch (error) {
        console.log(error)
    }
        
    return false;
};

async function inputCheckAll() {
    const resultFecth = await inputCepCheck();

    return resultFecth;
}

btnSubmit.addEventListener("click", async(e) => {
    e.preventDefault();
    const inputCheckAwait = await inputCheckAll();

    if( inputCheckAwait === true ) {
        formSubmit.submit();
    }
});

function setErrorFor(input, message) {
    const inputValidation = input.parentNode;
    const span = inputValidation.querySelector("small.error");

    span.innerHTML = message;

    inputValidation.classList.remove("success");
    inputValidation.classList.add("error");
}

function setSuccessFor(input) {
    const inputValidation = input.parentNode;

    inputValidation.classList.remove("error");
    inputValidation.classList.add("success");
}

function hideCEPInputs() {
    return document.querySelectorAll(".addressVerify").forEach(item => {
        item.style.display = "none";
    });
}

function showCEPInputs() {
    return document.querySelectorAll(".addressVerify").forEach(item => {
        item.style.display = "block";
    });
}

function showDataCEP(results) {
    for(let key in results) {
        if(document.querySelector("#"+key)) {
            document.querySelector("#"+key).value = results[key];
        }
    }
};