const express = require("express");
const path = require("path");
const db = require("./db");
const session = require("express-session");

const app = express();
const PORT = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(session({
    secret: "socialmedia_secret",
    resave: false,
    saveUninitialized: true
}));
app.set("view engine", "ejs");

// Home Page
// Home Page
app.get("/", (req, res) => {
    res.render("index");
});

// Register Page
app.get("/register", (req, res) => {
    res.render("register");
});

// Register User
app.post("/register", (req, res) => {
    const { name, email, password } = req.body;

    const sql = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";

    db.query(sql, [name, email, password], (err) => {
        if (err) {
            console.log(err);
            return res.send("Registration Failed");
        }

        res.redirect("/login");
    });
});

// Login Page
app.get("/login", (req, res) => {
    res.render("login");
});

// Login User
app.post("/login", (req, res) => {
    const { email, password } = req.body;

    const sql = "SELECT * FROM users WHERE email = ? AND password = ?";

    db.query(sql, [email, password], (err, results) => {
        if (err) {
            console.log(err);
            return res.send("Database Error");
        }

        console.log(results);

        if (results.length > 0) {
            req.session.user = results[0];
            res.redirect("/home");
        } else {
            res.send("Invalid Email or Password");
        }
    });
});

// Home Page
app.get("/home", (req, res) => {
    res.render("home");
});

// Profile Page
app.get("/profile", (req, res) => {
    if (!req.session.user) {
        return res.redirect("/login");
    }

    res.render("profile", {
        name: req.session.user.name,
        email: req.session.user.email
    });
});
app.listen(PORT, () => {
    console.log("Server running at http://localhost:3000");
});
app.get("/logout", (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.send("Error logging out");
        }
        res.redirect("/login");
    });
});