var CpfCnpjMaskBehavior = function (val) {
    return val.replace(/\D/g, '').length <= 11 ? '000.000.000-009' : '00.000.000/0000-00';
},
cpfCnpjpOptions = {
onKeyPress: function(val, e, field, options) {
  field.mask(CpfCnpjMaskBehavior.apply({}, arguments), options);
}
};

$(document).ready(function() {
    $("#cpf").mask(CpfCnpjMaskBehavior, cpfCnpjpOptions);
    $("#cep").mask("00000-000");
    $("#telefone").mask("(00) 00000-0000");
})

const btnSubmit = document.querySelector("#btnSubmit");
const formSubmit = document.querySelector("#formSubmit");
const fullName = document.querySelector("#name");
const cpf = document.querySelector("#cpf");
const cep = document.querySelector("#cep");
const address = document.querySelector("#logradouro");
const numberAddress = document.querySelector("#numero");
const uf = document.querySelector("#uf");
const city = document.querySelector("#localidade");
const phone = document.querySelector("#telefone");
const email = document.querySelector("#email");
const emailConfirm = document.querySelector("#email-confirm");

async function getCEP(cepValue) {
    const options = {
        method: "GET",
        mode: "cors",
        cache: "default"
    };

    try {
        const url = await `https://viacep.com.br/ws/${cepValue}/json/`;
        const response = await fetch(url, options);

        const data = await response.json();
        return data;
    } catch (error) {
        console.log(error);
        return {erro: true}
    }
};

fullName.addEventListener("input", () => {
    inputNameCheck();
});

cpf.addEventListener("input", () => {
    inputCpfCheck();
});

cep.addEventListener("input", e => {
    inputCepCheck();
});

address.addEventListener("input", () => {
    inputAddressCheck();
});

numberAddress.addEventListener("input", () => {
    inputNumberAddressCheck();
});

uf.addEventListener("input", () => {
    inputUfCheck();
});

city.addEventListener("input", () => {
    inputCityCheck();
});

phone.addEventListener("input", () => {
    inputPhoneCheck();
});

email.addEventListener("input", () => {
    inputEmailCheck();
});

emailConfirm.addEventListener("input", () => {
    inputEmailConfirmCheck();
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

};

/** CPF Validation */
function inputCpfCheck() {
    let cpfValue = cpf.value.trim();
    let onlyNumbers = cpfValue.replace(".", "").replace(".", "").replace("-", "");
    let firstNineDigits = multiplyNumbers(9, onlyNumbers, 10);
    let firstTenDigits = multiplyNumbers(10, onlyNumbers, 11);
    let restOfDivision1 = getVerificationNumber(firstNineDigits);
    let restOfDivision2 = getVerificationNumber(firstTenDigits);

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

function inputAddressCheck() {
    const addressValue = address.value.trim();

    if (addressValue === "" || addressValue === null || addressValue === undefined) {
        setErrorFor(address, "Este campo é requerido");
        return false;
    }

    setSuccessFor(address);
    return true;
};


function inputNumberAddressCheck() {
    const numberAddressValue = numberAddress.value.trim();

    if (numberAddressValue === "" || numberAddressValue === null || numberAddressValue === undefined) {
        setErrorFor(numberAddress, "Campo requerido");
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

function inputUfCheck() {
    const ufValue = uf.value.trim();
    const re = /^[A-Z]+$/;

    if (ufValue === "" || ufValue === null || ufValue === undefined) {
        setErrorFor(uf, "Campo requerido");
        return false;
    }

    if(!re.test(ufValue) || ufValue.length < 2) {
        setErrorFor(uf, "Ex: SP");
        return false;
    }

    setSuccessFor(uf);
    return true;
}

function inputCityCheck() {
    const cityValue = city.value.trim();
    const re = /^[A-Za-záàâãéèêíïóôõöüúçñÁÀÂÃÉÈÍÏÓÔÕÖÜÚÇÑ ]+$/;

    if (cityValue === "" || cityValue === null || cityValue === undefined) {
        setErrorFor(city, "Este campo é requerido");
        return false;
    }

    if(!re.test(cityValue)) {
        setErrorFor(city, "Apenas letras e acentuações");
        return false;
    }

    setSuccessFor(city);
    return true;
};

function inputPhoneCheck() {
    const phoneValue = phone.value.trim().replace(/\D/g, "").replace("(", "").replace(")", "").replace(" ", "").replace("-", "");
    console.log(phoneValue)

    if (phoneValue === "" || phoneValue === null || phoneValue === undefined) {
        setErrorFor(phone, "Este campo é requerido");
        return false;
    }

    if (phoneValue.length < 10) {
        setErrorFor(phone, "Por favor, preencher um celular válido");
        return false;
    }


    setSuccessFor(phone);
    return true;
}

function inputEmailCheck() {
    const emailValue = email.value.trim();

    if (emailValue === "" || emailValue === null || emailValue === undefined) {
        setErrorFor(email, "Este campo é requerido");
        return false;
    }

    if (!isEmail(emailValue)) {
        setErrorFor(email, "Por favor, preencher um e-mail válido");
        return true;
    }

    setSuccessFor(email);
    return true;
}

function inputEmailConfirmCheck() {
    const emailConfirmValue = emailConfirm.value.trim();
    const emailValue = email.value.trim();

    if (emailConfirmValue === "" || emailConfirmValue === null || emailConfirmValue === undefined) {
        setErrorFor(emailConfirm, "Este campo é requerido");
        return false;
    }

    if (!isEmail(emailConfirmValue)) {
        setErrorFor(emailConfirm, "Por favor, preencher um e-mail válido");
        return true;
    }

    if(emailConfirmValue !== emailValue) {
        setErrorFor(emailConfirm, "Por favor, fornecer o mesmo e-mail")
        return false;
    }

    setSuccessFor(emailConfirm);
    return true;
}


async function inputCheckAll() {
    const resultFecth = await inputCepCheck();

    return inputNameCheck()
    && inputCpfCheck()
    && resultFecth
    && inputAddressCheck()
    && inputNumberAddressCheck()
    && inputUfCheck()
    && inputCityCheck()
    && inputPhoneCheck()
    && inputEmailCheck()
    && inputEmailConfirmCheck()
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


// regex de email
function isEmail(email) {
	return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email);
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