import { Users, Notes } from './models.js';

// Authentication
export function login(req, res) {
    const { username, password } = req.body;
    // console.debug("Username: " + username + "\n" + "Password: " + password);
    Users.findOne({ where: { username: username } }).then(user => {
        let hash = user.hashing(user.useruuid + password);
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
}

export function logout(req, res) {
    req.session.destroy();
    res.json(null);
}

// User database
export function user_admin(req, res) {
    Users.findAll().then(result => res.json(result)).catch(error => res.json(error));
}

export function user_details(req, res) {
    Users.findOne({ where: { useruuid: req.session.useruuid } }).then(result => res.json(result)).catch(error => res.json(error));
}

export function create_user(req, res) {
    const { username, password } = req.body;
    // console.debug("Username: " + username + "\n" + "Password: " + password);
    Users.create({ username: username, password: password }).then(result => res.json(result)).catch(error => res.json(error));
}

export function delete_user(req, res) {
    Users.destroy({ where: { useruuid: req.session.useruuid } }).then(result => {
        req.session.destroy();
        return res.json(result);
    }).catch(error => res.json(error));
}

// Note database
export function note_retrieve(req, res) {
    Notes.findAll().then(result => res.json(result)).catch(error => res.json(error));
}

export function note_create(req, res) {
    Notes.create({ note: req.body.note, user: req.session.useruuid })
        .then(result => res.json(result))
        .catch(error => res.json(error));
}

export function note_update(req, res) {
    Notes.update({ note: req.body.note }, { where: { user: req.session.useruuid, hash: req.body.hash } })
        .then(result => res.json(result))
        .catch(error => res.json(error));
}

export function note_delete(req, res) {
    Notes.destroy({ where: { hash: req.body.hash, user: req.session.useruuid } })
        .then(result => res.json(result))
        .catch(error => res.json(error));
}