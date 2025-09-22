const paymentRu = require("../app-payment/localization/ru.json");
const paymentUz = require("../app-payment/localization/uz.json");
const paymentCuz = require("../app-payment/localization/cuz.json");

const cardRu = require("../app-card-attachment/localization/ru.json");
const cardUz = require("../app-card-attachment/localization/uz.json");
const cardCuz = require("../app-card-attachment/localization/cuz.json");

module.exports = {
  "PAYMENT": {
    ru: paymentRu,
    uz: paymentUz,
    cuz: paymentCuz,
  },
  "CARD_ATTACHMENT": {
    ru: cardRu,
    uz: cardUz,
    cuz: cardCuz,
  }
};