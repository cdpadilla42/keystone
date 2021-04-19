exports.handleErrors = function (fn) {
  return function (...params) {
    return fn(...params).catch((err) =>
      console.error('Something went wrong!', err)
    );
  };
};
