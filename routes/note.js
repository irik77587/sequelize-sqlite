import { Router } from "express";
const router = Router();

router.get("/", function(req,res) {
    req.app.locals.Notes.findAll().then(result=>res.json(result)).catch(error=>res.json(error));
});

router.post("/", function(req,res) {
    req.app.locals.Notes.create({note: req.body.note})
        .then(result=>res.json(result))
        .catch(error=>res.json(error));
});
router.delete("/", function(req,res) {
    req.app.locals.Notes.destroy({where:{hash:req.body.hash}})
        .then(result=>res.json(result))
        .catch(error=>res.json(error));
});

router.patch("/", function(req,res) {
    req.app.locals.Notes.update({note:req.body.note},{where:{hash:req.body.hash}})
        .then(result=>res.json(result))
        .catch(error=>res.json(error));
});

export default router;