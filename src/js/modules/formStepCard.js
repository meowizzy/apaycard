import {BASE_URL} from "../app/constants";

const cardCodes = [
    8600,
    9860,
    5614
];

const isValidCardNumber = (cardNumber) => {
    const [ cardCode ] = cardNumber.split(" ");
    const card = cardNumber.replace(/\s/g, '');
    const isValidCode = !!cardCodes.find((code) => code === Number(cardCode));

    return card.length === 16 && isValidCode;
};

const isValidCardExpire = (cardExp) => {
    const exp = cardExp.replace(/[/\s]+/g, '');

    return exp.length === 4;
};

const isValidPhoneNumber = (phoneNumber) => {
    return phoneNumber.length === 19;
};

export const formStepCard = () => {
    const form = document.querySelector("[data-step='card'] form");
    const submitButton = form.querySelector(".lp-button");
    const error = form.parentElement.querySelector(".form__body-error");

    const sendData = async (data) => {
        const {
            phone,
            cardNumber,
            cardExpire
        } = data;

        try {
            submitButton.classList.add("loading");
            const response = await fetch(`${BASE_URL}/api/web/v1/bills/card`, {
                method: 'POST',
                body: JSON.stringify({
                    expiry: cardExpire,
                    pan: cardNumber,
                    phone,
                    extId: "",
                })
            });
        } catch (e) {
            console.error(e);
        } finally {
            submitButton.classList.remove("loading");
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const phone = formData.get("phone");
        const cardNumber = formData.get("cardNumber");
        const cardExpire = formData.get("cardExpire");

        const isPhoneInputValid = isValidPhoneNumber(phone);
        const isCardNumberInputValid = isValidCardNumber(cardNumber);
        const isCardExpireInputValid = isValidCardExpire(cardExpire);

        if (isPhoneInputValid && isCardNumberInputValid && isCardExpireInputValid) {
            error.classList.add("d-none");

        } else {
            error.classList.remove("d-none");
            error.textContent = "Проверьте корректность введённых данных.";
        }
    };

    form.addEventListener("submit", handleSubmit);
};