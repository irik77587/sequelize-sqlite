import express from "express";
const app = express();
app.use(express.urlencoded({ extended: false }));

import session from "express-session";
app.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: false
}));

import { Users, Notes } from './models.js';
app.locals.Users = Users;
app.locals.Notes = Notes;

import auth from './routes/auth.js'
import user from './routes/user.js';
import note from './routes/note.js';

app.use("/api/auth", auth);
app.use("/api/user", user);
app.use("/api/note", note);

// For testing purpose
export default app;