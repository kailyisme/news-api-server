exports.notFound = function (req, res, next) {
  res.status(404).send({ msg: "Not Found" });
};

exports.serverError = function (err, req, res, next) {
  res.status(500).send({ err });
};
