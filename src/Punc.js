function Punc(str) {
    this.str = str;
}
module.exports = Punc;

Punc.prototype.isPunc = true;

Punc.prototype.__defineGetter__("newline", function() {
  return this.str.indexOf("\n") != -1;
});
