const btnSubmit = document.querySelector("#btnSubmit");
const formSubmit = document.querySelector("#formSubmit");
const fullName = document.querySelector("#name");
const cpf = document.querySelector("#cpf");
const cep = document.querySelector("#cep");
const numberAddress = document.querySelector("#numero");

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

fullName.addEventListener("input", () => {
    inputNameCheck();
});

cpf.addEventListener("input", () => {
    inputCpfCheck();
})

cep.addEventListener("input", e => {
    inputCepCheck();
});

numberAddress.addEventListener("input", () => {
    inputNumberAddressCheck();
});


function inputNameCheck() {
    const fullNameValue = fullName.value.trim();
    const re = /^[A-Za-záàâãéèêíïóôõöüúçñÁÀÂÃÉÈÍÏÓÔÕÖÜÚÇÑ ]+$/;

    if (fullNameValue === "" || fullNameValue === null || fullNameValue === undefined) {
        setErrorFor(fullName, "Este campo é requerido");
        return false;
    }

    if (fullNameValue.length < 3) {
        setErrorFor(fullName, "Este campo precisa ter pelo menos 3 caracteres");
        return false;
    }

    if(!re.test(fullNameValue)) {
        setErrorFor(fullName, "Este campo não aceita número e nem caracteres especiais");
        return false;
    }

    setSuccessFor(fullName);
    return true;

}

/** CPF Validation */
function inputCpfCheck() {
    let cpfValue = cpf.value.trim();
    let onlyNumbers = cpfValue.replace(".", "").replace(".", "").replace("-", "");
    let firstNineDigits = multiplyNumbers(9, onlyNumbers, 10);
    let firstTenDigits = multiplyNumbers(10, onlyNumbers, 11);
    let restOfDivision1 = getVerificationNumber(firstNineDigits);
    let restOfDivision2 = getVerificationNumber(firstTenDigits);
    console.log("firstNineDigits: ", firstNineDigits);
    console.log("firstTenDigits: ", firstTenDigits);
    console.log("restOfDivision1: ", restOfDivision1);
    console.log("restOfDivision2: ", restOfDivision2);

    if(cpfValue === "" || cpfValue === null || cpfValue === undefined) {
        setErrorFor(cpf, "Este campo é requerido")
        return false;
    }

    if((restOfDivision1 + restOfDivision2) !== onlyNumbers.substr(9, 2)) {
        setErrorFor(cpf, "CPF inválido");
        return false;
    }

    setSuccessFor(cpf);
    return true;
}

function getVerificationNumber(sum) {
    let result = (sum * 10) % 11;

    return result.toString();
}

function multiplyNumbers(amountOfNumbers, onlyNumbers, multiplier) {
    let firstNumbers = onlyNumbers.substr(0, amountOfNumbers);
    let sumOfNumbers = 0;

    for (let i = 0; i < firstNumbers.length; i++) {
        let number = firstNumbers.substr(i, 1);
        sumOfNumbers += number * multiplier;
        multiplier--;
    }

    return sumOfNumbers;
};

/** CEP validation */
async function inputCepCheck() {
    const cepValue = cep.value.trim().replace("-", "");

    if (cepValue === "" || cepValue === null || cepValue === undefined) {
        setErrorFor(cep, "Este campo é requerido");
        hideCEPInputs();
        return false;
    }
    
    if (cepValue.length < 8 || cepValue.length > 8) {
        setErrorFor(cep, "Por favor, digite um CEP válido");
        hideCEPInputs();
        return false;
    }
    
    const response = await getCEP(cepValue);

    try {
        if (response.erro === true) {
            setErrorFor(cep, "Por favor, digite um CEP válido");
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

/** Input Number validation */
function inputNumberAddressCheck() {
    const numberAddressValue = numberAddress.value.trim();

    if (numberAddressValue === "" || numberAddressValue === null || numberAddressValue === undefined) {
        setErrorFor(numberAddress, "Este campo é requerido");
        return false;
    }

    setSuccessFor(numberAddress);
    return true;
}

/** ONLY NUMBERS FIELD NUMBER */
numberAddress.addEventListener('keydown', function(e) {
  var numero = (e.keyCode >= 48 && e.keyCode <= 57) || (e.keyCode >= 96 && e.keyCode <= 105);
  var controlos = [8, 37, 39].includes(e.keyCode);
  if (!numero && !controlos) return e.preventDefault();
});

async function inputCheckAll() {
    const resultFecth = await inputCepCheck();

    return inputNameCheck()
    && inputCpfCheck()
    && inputNumberAddressCheck()
    && resultFecth
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