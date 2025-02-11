import IMask from "imask";

export const inputMaskInit = () => {
    const cardInputs = document.querySelectorAll(".input-card");
    const cardExpInputs = document.querySelectorAll(".input-exp");
    const cvvInputs = document.querySelectorAll(".input-cvv");
    const phoneInputs = document.querySelectorAll(".input-phone");

    if (cardInputs.length) {
        cardInputs.forEach((input) => {
            IMask(input, {
                mask: "0000 0000 0000 0000"
            });
        });
    }

    if (cardExpInputs.length) {
        cardExpInputs.forEach((input) => {
            IMask(input, {
                mask: "00 / 00"
            });
        });
    }

    if (cvvInputs.length) {
        cvvInputs.forEach((input) => {
            IMask(input, {
                mask: "000"
            })
        });
    }

    if (phoneInputs.length) {
        phoneInputs.forEach((input) => {
            const iMask = IMask(input, {
                mask: "+998 (00) 000-00-00",
            });

            input.addEventListener("focus", () => {
                if (!iMask.value) {
                    iMask.value = "+998 ("
                }
            });

            input.addEventListener("blur", () => {
                if (iMask.value.length === 6) {
                    iMask.value = "";
                }
            });
        })
    }
};