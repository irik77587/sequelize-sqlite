import express from "express";
const app = express();
app.use(express.urlencoded({ extended: false }));

import { Users, Notes } from './models.js';
app.locals.Users = Users;
app.locals.Users.sync();
app.locals.Notes = Notes;
app.locals.Notes.sync();

import user from './routes/user.js';
import note from './routes/note.js';

app.use("/api/user", user);
app.use("/api/note", note);

app.listen(8000, console.log("Listening at http://0.0.0.0:8000"));