module.exports = function (value, options) {
  if (value == this.switch_value) {
    return options.fn(this);
  }
};