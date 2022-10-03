import { Router } from "express";
const router = Router();

export default router;

router.get("/admin", function (req, res) {
    req.app.locals.Users.findAll().then(result => res.json(result)).catch(error => res.json(error));
});

// Query account info
router.get("/", function (req, res) {
    req.app.locals.Users.findOne({ where: { useruuid: req.session.useruuid } }).then(result => res.json(result)).catch(error => res.json(error));
});

// Create account
router.put("/", function (req, res) {
    const { username, password } = req.body;
    // console.debug("Username: " + username + "\n" + "Password: " + password);
    req.app.locals.Users.create({ username: username, password: password }).then(result => res.json(result)).catch(error => res.json(error));
});

// Change username or password

// Delete account
router.delete("/", function (req, res) {
    req.app.locals.Users.destroy({ where: { useruuid: req.session.useruuid } }).then(result => {
        req.session.destroy();
        return res.json(result);
    }).catch(error => res.json(error));
});