const app = require("./app");

const PORT = 8080;

app.listen(PORT, (err) => {
  if (err) {
    console.log("We've got an error Houston!\n", err);
  } else {
    console.log(`Listening to you beautifuls at port ${PORT}`);
  }
});
