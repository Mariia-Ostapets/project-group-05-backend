export const handleSaveError = (err, doc, next) => {
  const { name, code } = err;
  console.log(name);
  console.log(code);
  err.status = name === 'MongoServerError' && code === 11000 ? 409 : 400;
  next();
};

export const setUpdateSettings = function (next) {
  this.options.new = true;
  this.options.runValidators = true;
  next();
};
