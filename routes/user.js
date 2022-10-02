import { Router } from "express";
const router = Router();

import { createHash } from 'node:crypto';
function hashing(password) {
    return createHash("sha256").update(password,"binary").digest("base64");
}

router.get("/admin", function(req,res) {
    req.app.locals.Users.findAll().then(result=>res.json(result)).catch(error=>res.json(error));
});

router.get("/", function(req,res) {
    req.app.locals.Users.findOne({where: { footmark : req.body.footmark }}).then(result=>res.json(result)).catch(error=>res.json(error));
});

// Login
router.post("/", function(req,res) {
    req.app.locals.Users.findOne({where:{username: req.body.username}}).then(user=>{
        req.app.locals.Users.update({footmark: true}, {where:{username: req.body.username, password: hashing(user.useruuid + req.body.password)}}).then(result=>res.json(result))
    }).catch(error=>res.json(error));
});

// Create account
router.put("/", function(req,res) {
    const { username, password } = req.body;
    console.log("Username: " + username + "\n" + "Password: " + password);
    req.app.locals.Users.create({username: username, password: password, footmark: true}).then(result=>res.json(result)).catch(error=>res.json(error));
});

// Delete account
router.delete("/", function(req,res) {
    req.app.locals.Users.findOne({where:{footmark: req.body.footmark}}).then(user=>{
        req.app.locals.Users.destroy({where:{footmark:req.body.footmark, password: hashing(user.useruuid + req.body.password)}}).then(result=>res.json(result))
    }).catch(error=>res.json(error));
});

// Logout
router.patch("/", function(req,res) {
    req.app.locals.Users.update({footmark:null},{where:{footmark:req.body.footmark}}).then(result=>res.json(result)).catch(error=>res.json(error));
});

export default router;