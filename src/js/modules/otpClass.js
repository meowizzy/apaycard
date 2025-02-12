export class Otp {
    #BACKSPACE_KEY = 8;
    #TAB_KEY = 9;
    #LEFT_KEY = 37;
    #RIGHT_KEY = 39;
    #V_KEY = 86;

    #FINAL_VALUE = "";
    #FILLED  = false;

    #INPUTS = null;

    #callback = null;

    constructor(selector) {
        this.selector = selector;

        const target = document.querySelector(selector);

        this.#INPUTS = target.querySelectorAll("input");

        this.#init();
    }

    #isValid() {
        let count = 0;

        this.#INPUTS.forEach(input => {
            if (input.value) {
                count++;
            }
        });

        return count === this.#INPUTS.length;
    }

    onFilled(callback) {
        if (callback) {
            this.#callback = callback;
        }
    }

    #handleKeyDown(e, idx, hiddenInput) {
        const target = e.target;
        const keyCode = e.keyCode;
        const key = Number(e.key);
        const next = this.#INPUTS[idx + 1];
        const prev = this.#INPUTS[idx - 1];

        if (Number.isFinite(key)) {
            e.preventDefault();
            target.value = key;

            if (next) {
                next.focus();
            }

            if (this.#isValid(this.#INPUTS)) {
                const code = Array.from(this.#INPUTS).map((input) => input.value).join("");

                hiddenInput.value = code;

                this.#FILLED = true;
                this.#FINAL_VALUE = code;

                if (this.#callback) {
                    this.#callback(this.#FILLED, this.#FINAL_VALUE);
                }
            } else {
                hiddenInput.value = "";

                this.#FILLED = false;
                this.#FINAL_VALUE = "";

                if (this.#callback) {
                    this.#callback(this.#FILLED, this.#FINAL_VALUE);
                }
            }
        } else {
            if (!e.ctrlKey && keyCode !== this.#V_KEY) {
                e.preventDefault();
            }
        }

        if (keyCode === this.#RIGHT_KEY || keyCode === this.#TAB_KEY) {
            e.preventDefault();
            if (next) {
                next.focus();
            }
        }

        if (keyCode === this.#LEFT_KEY) {
            if (prev) {
                prev.focus();
            }
        }

        if (keyCode === this.#BACKSPACE_KEY) {
            if (this.#INPUTS[idx].value === "") {
                if (prev) {
                    prev.focus();
                }
            }
            hiddenInput.value = "";
            target.value = "";

            this.#FILLED = false;
            this.#FINAL_VALUE = "";

            if (this.#callback) {
                this.#callback(this.#FILLED, this.#FINAL_VALUE);
            }
        }
    }

    #handlePaste(e, idx, hiddenInput) {
        const clipBoardData = e.clipboardData;
        const clipBoardText = clipBoardData.getData("text");

        if (Number.isFinite(Number(clipBoardText))) {
            const splitCode = clipBoardText.split("");
            let curIndex = 0;

            splitCode.forEach((num, idx) => {
                if (this.#INPUTS[idx]) {
                    this.#INPUTS[idx].value = num;
                    curIndex++;
                }
            });

            if (this.#INPUTS.length === splitCode.length) {
                hiddenInput.value = clipBoardText;

                this.#FINAL_VALUE = clipBoardText;
                this.#FILLED = true;

                if (this.#callback) {
                    this.#callback(this.#FILLED, this.#FINAL_VALUE);
                }
            } else {
                hiddenInput.value = "";

                this.#FILLED = false;
                this.#FINAL_VALUE = "";

                if (this.#callback) {
                    this.#callback(this.#FILLED, this.#FINAL_VALUE);
                }
            }

            if (this.#INPUTS[splitCode.length - 1]) {
                this.#INPUTS[splitCode.length - 1].focus();
            }
        } else {
            e.preventDefault();
        }
    }

    #init() {
        const firstInput = this.#INPUTS[0];
        const parent = firstInput.parentElement;
        const hiddenInput = document.createElement("input");

        hiddenInput.type = "hidden";
        hiddenInput.name = "otpValue";

        parent.append(hiddenInput);

        firstInput.focus();

        this.#INPUTS.forEach((input, idx) => {
            input.addEventListener("keydown", (e) => this.#handleKeyDown(e, idx, hiddenInput));
            input.addEventListener("paste", (e) => this.#handlePaste(e, idx, hiddenInput));
        });
    }
}