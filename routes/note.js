import { Router } from "express";
const router = Router();

export default router;

router.get("/", function (req, res) {
    req.app.locals.Notes.findAll().then(result => res.json(result)).catch(error => res.json(error));
});

router.post("/", function (req, res) {
    req.app.locals.Notes.create({ note: req.body.note, user: req.session.useruuid })
        .then(result => res.json(result))
        .catch(error => res.json(error));
});
router.delete("/", function (req, res) {
    req.app.locals.Notes.destroy({ where: { hash: req.body.hash, user: req.session.useruuid } })
        .then(result => res.json(result))
        .catch(error => res.json(error));
});

router.patch("/", function (req, res) {
    req.app.locals.Notes.update({ note: req.body.note }, { where: { user: req.session.useruuid, hash: req.body.hash } })
        .then(result => res.json(result))
        .catch(error => res.json(error));
});