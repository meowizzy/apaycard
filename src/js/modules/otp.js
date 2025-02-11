const BACKSPACE_KEY = 8;
const TAB_KEY = 9;
const LEFT_KEY = 37;
const RIGHT_KEY = 39;
const V_KEY = 86;

export const otp = () => {
    const pinCodeNodes = document.querySelectorAll(".form__field-code");

    if (!pinCodeNodes.length) {
        return;
    }

    const isValid = (inputs) => {
        let count = 0;

        inputs.forEach(input => {
            if (input.value) {
                count++;
            }
        });

        return count === inputs.length;
    };

    const handleKeyDown = (e, inputs, idx, hiddenInput) => {
        const target = e.target;
        const keyCode = e.keyCode;
        const key = Number(e.key);
        const next = inputs[idx + 1];
        const prev = inputs[idx - 1];

        if (Number.isFinite(key)) {
            e.preventDefault();
            target.value = key;

            if (next) {
                next.focus();
            }

            if (isValid(inputs)) {
                hiddenInput.value = inputs.map((input) => input.value).join("");
            } else {
                hiddenInput.value = "";
            }
        } else {
            if (!e.ctrlKey && keyCode !== V_KEY) {
                e.preventDefault();
            }
        }

        if (keyCode === RIGHT_KEY || keyCode === TAB_KEY) {
            e.preventDefault();
            if (next) {
                next.focus();
            }
        }

        if (keyCode === LEFT_KEY) {
            if (prev) {
                prev.focus();
            }
        }

        if (keyCode === BACKSPACE_KEY) {
            if (inputs[idx].value === "") {
                if (prev) {
                    prev.focus();
                }
            }
            hiddenInput.value = "";
            target.value = "";
        }
    };

    const handlePaste = (e, inputs, idx, hiddenInput) => {
        const clipBoardData = e.clipboardData;
        const clipBoardText = clipBoardData.getData("text");

        if (Number.isFinite(Number(clipBoardText))) {
            const splitCode = clipBoardText.split("");
            let curIndex = 0;

            splitCode.forEach((num, idx) => {
                if (inputs[idx]) {
                    inputs[idx].value = num;
                    curIndex++;
                }
            });

            if (inputs.length === splitCode.length) {
                hiddenInput.value = clipBoardText;
            } else {
                hiddenInput.value = "";
            }

            if (inputs[splitCode.length - 1]) {
                inputs[splitCode.length - 1].focus();
            }
        } else {
            e.preventDefault();
        }
    };

    pinCodeNodes.forEach(node => {
        const inputs = Array.from(node.children);
        const firstInput = inputs[0];
        const hiddenInput = document.createElement("input");

        hiddenInput.type = "hidden";
        hiddenInput.name = "otpValue";

        node.append(hiddenInput);

        firstInput.focus();

        inputs.forEach((input, idx) => {
            input.addEventListener("keydown", (e) => handleKeyDown(e, inputs, idx, hiddenInput));
            input.addEventListener("paste", (e) => handlePaste(e, inputs, idx, hiddenInput));
        })
    })
};