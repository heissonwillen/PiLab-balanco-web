const express = require("express");
const app = express();

app.use(express.json());

const balances = [
    { name: "ativo1" },
    { name: "ativo2" },
    { name: "ativo3" },
];

app.get("/balance", (req, res) => {
    res.send(balances);
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));