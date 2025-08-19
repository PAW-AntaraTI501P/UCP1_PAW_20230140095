require("dotenv").config();

const express = require("express");
const app = express();
const port = process.env.PORT;
const bukuRoutes = require("./routes/perpusDB.js");
const db = require("./database/db");
const expressLayouts = require("express-ejs-layouts");


app.use(expressLayouts);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/buku", bukuRoutes);

app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("index", {
    layout: "layouts/main-layout"
  });
});

app.get("/contact", (req, res) => {
  res.render("contact", {
    layout: "layouts/main-layout"
  });
});

app.get("/list-buku", (req, res) => {
  db.query('SELECT * FROM buku', (err, buku) => {
    if (err) return res.status(500).send('Internal Server Error');
    res.render("list-buku", { layout: "layouts/main-layout", buku: buku });
  });
});

app.get("/about", (req, res) => {
  res.render("about", {
    layout: "layouts/main-layout"
  });
});

app.use((req, res) => {
  res.status(404).send("404 - page not found");
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});