exports.notFound = function (req, res, next) {
  res.status(404).send({ msg: "Not Found" });
};

exports.customErrors = function (err, req, res, next) {
  if (err.status && err.msg) {
    const {status, msg} = err;
    res.status(status).send({ msg });
  } else next(err);
};

exports.serverError = function (err, req, res, next) {
  res.status(500).send({ err });
};
