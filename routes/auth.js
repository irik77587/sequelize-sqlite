import { Router } from "express";
const router = Router();

export default router;

import hashing from "../hashing.js";

// Login
router.post("/", function (req, res) {
    const { username, password } = req.body;
    // console.debug("Username: " + username + "\n" + "Password: " + password);
    req.app.locals.Users.findOne({ where: { username: username } }).then(user => {
        let hash = hashing(user.useruuid + password);
        // console.debug(hash);
        if (hash !== user.password)
            throw new Error({"ERROR": "AUTHENTICATION FAILED"});
        else {
            req.session.useruuid = user.useruuid;
            delete user.password;
            // console.debug(user);
            res.json(user);
        }
    }).catch(error => res.json(error));
});

// Logout
router.delete("/", function (req, res) {
    req.session.destroy();
    res.json(null);
});