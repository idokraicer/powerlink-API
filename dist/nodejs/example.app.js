const { Type, Fireberry } = require("./fireberry.js");
const fb = new Fireberry("xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxx");

fb.object(Type.ACCOUNT)
    .getAll()
    .then((accounts) => {
        console.log(accounts);
    });
