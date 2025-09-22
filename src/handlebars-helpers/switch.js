module.exports = function (value, options) {
  this.switch_value = value;
  return options.fn(this);
};