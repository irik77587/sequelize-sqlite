import Request from 'supertest';
import app from './app.js';

const supertest = Request(app);
const userapi = '/api/user', authapi = '/api/auth', useradmin = '/api/user/admin', emptyObject = {}, registered_user_credentials = "username=user1&password=123", unregistered_credentials = "username=unuser1&password=123", wrong_password = "234";

let cookie;

async function login(credentials){ 
    const res = await supertest.post(authapi).send(credentials).expect('set-cookie', /connect.sid=.*; Path=\/; HttpOnly/).expect(200);
    valid_response(res);
    cookie = res.headers['set-cookie'][0].split(";")[0];
}

function valid_response(res) {
    expect(res.body).toHaveProperty("useruuid");
    expect(res.body).toHaveProperty("username");
}

function not_valid_response(res) {
    expect(res.body).not.toHaveProperty("useruuid");
    expect(res.body).not.toHaveProperty("username");
}

async function create_user() {
    const res = await supertest.put(userapi).send(registered_user_credentials).expect(200)
    return valid_response(res);
}

describe("User and Auth API", () => {
    it("Initial user database is empty", () => supertest.get(useradmin).expect(200).then(res => {
        expect(res.body).toHaveLength(0);
    }));
    it("Empty credentials should fail to create user", () => supertest.put(userapi).then(not_valid_response));
    // it.todo("No user info if user is not logged in");
    it("No user info if user is not logged in", () => supertest.get(userapi).expect(200).then(res => {
        expect(res.body).toEqual(emptyObject);
    }));
    it("Create user", create_user);
    it("Fail to delete if user is not logged in", () => supertest.delete(userapi).then(res => {
        expect(res.body).toEqual(emptyObject);
    }));
    it("Fail to duplicate user", () => supertest.put(userapi).send(registered_user_credentials).expect(200).then(not_valid_response));
    it("Login fails for nonExistent user", () => supertest.post(authapi).send(unregistered_credentials).then(not_valid_response));
    it("Login fails for invalid password", () => supertest.post(authapi).send({username: registered_user_credentials.username, password: wrong_password}).then(not_valid_response));
    it("Login to created user", async () => await login(registered_user_credentials));
    it("Get user info of logged in user", () => supertest.get(userapi).set("Cookie", cookie).expect(200).then(valid_response));
    it("Logout", () => supertest.delete(authapi).set("Cookie", cookie).expect(200).then(res => expect(res.body).toEqual(null)));
    it("Login and delete user", async () => {
        await login(registered_user_credentials);
        let res = await supertest.delete(userapi).set("Cookie", cookie).expect(200);
        //console.log(res.body);
        expect(res.body).toEqual(1);
    });
});

async function create_note(note) {
    let res = await supertest.post(noteapi).set("Cookie", cookie).send(note).expect(200);
    expect(res.body).toHaveProperty("hash");
    expect(res.body).toHaveProperty("note");
    expect(res.body).toHaveProperty("user");
    return res.body["hash"];
    // console.log(res.body)
}

const noteapi = '/api/note', test_note = "note=simple%20test%20note",  test_note_2 = "note=test%20rather%20complicated%20note";
let hash_NoteToBeDeleted;

describe("Note API", () => {
    const invalid_cookie = "connect.sid=some_random_cookie_that_should_fail_authentication";
    it("Fail to create note without logging in first", () => supertest.post(noteapi).send(test_note).expect(200).then(res => {
        expect(res.body).not.toHaveProperty("hash");
        expect(res.body).not.toHaveProperty("note");
        // console.log(res.body);
    }));
    it("Successfully create notes after login", async () => {
        await create_user();
        await login(registered_user_credentials);
        // console.log(cookie);
        hash_NoteToBeDeleted = await create_note(test_note);
    });
    it("Retrieve all Notes", async () => {
        await create_note(test_note_2);
        let res = await supertest.get(noteapi).expect(200);
        expect(res.body).toHaveLength(2);
        res.body.forEach(note => {
            expect(note).toHaveProperty("hash");
            expect(note).toHaveProperty("note");
            expect(note).toHaveProperty("user");
            expect(note).not.toHaveProperty("UserUseruuid");
        });
        // console.log(res.body);
    });
    it("Unauthorized users cannot delete note by hash", async () => {
        await supertest.delete(noteapi).set("Cookie", invalid_cookie).send("hash=" + hash_NoteToBeDeleted).expect(200);
        let res = await supertest.get(noteapi).expect(200);
        // console.log(hash_NoteToBeDeleted); // Should not be a promise
        expect(res.body.map(noteBody => noteBody.hash)).toEqual(expect.arrayContaining([hash_NoteToBeDeleted]));
        // console.log(res.body);
        // console.log(res.body.map(noteBody => noteBody.hash));
    });
    it("Unauthorized users cannot change note by hash", async () => {
        const changedNote = "Note is changed";
        await supertest.patch(noteapi).set("Cookie", invalid_cookie).send("hash=" + hash_NoteToBeDeleted + "&note=" + changedNote).expect(200);
        let res = await supertest.get(noteapi).expect(200);
        expect(res.body.filter(({hash}) => hash == hash_NoteToBeDeleted)[0]["note"]).not.toEqual(changedNote);
    });
    it("Change note by hash", async () => {
        const changedNote = "Note is changed";
        await supertest.patch(noteapi).set("Cookie", cookie).send("hash=" + hash_NoteToBeDeleted + "&note=" + changedNote).expect(200);
        let res = await supertest.get(noteapi).expect(200);
        expect(res.body.filter(({hash}) => hash == hash_NoteToBeDeleted)[0]["note"]).toEqual(changedNote);
    });
    it("Delete note by hash", async () => {
        await supertest.delete(noteapi).set("Cookie", cookie).send("hash=" + hash_NoteToBeDeleted).expect(200);
        let res = await supertest.get(noteapi).expect(200);
        expect(res.body.map(noteBody => noteBody.hash)).not.toEqual(expect.arrayContaining([hash_NoteToBeDeleted]));
    });
});