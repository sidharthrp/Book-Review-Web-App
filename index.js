import express from "express";
import pg from "pg";
import bodyParser from "body-parser";
import axios from "axios";
import fs from "fs";

const app = express();
const port = 3000;

const db= new pg.Client({
    user:"postgres",
    host:"localhost",
    database: "Book",
    password: "Airhead9",
    port:5432
});
db.connect();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

app.get("/",async(req, res)=>{
    const result = await db.query("SELECT * FROM bookreview ORDER BY id ASC");
    const data = result.rows;
     //console.log(data);
    res.render("index.ejs",{data: data});
});

app.post("/new",async(req, res)=>{
    res.render("new.ejs");
});

app.post("/add", async(req, res)=>{
    console.log(req.body);
    const title = req.body.title;
    const author = req.body.author;
    const contents = req.body.contents;
    const rating = req.body.rating;
    const isbn = req.body.isbn;
    const date = new Date();
    await db.query("Insert into bookreview(title, author, contents, date, rating, isbn) values($1, $2, $3, $4, $5, $6)",[title,author,contents,date,rating,isbn]);
    res.redirect("/");
})

app.post("/delete", async(req,res)=>{
    const deleteId=req.body.deletebtn;
    await db.query("DELETE FROM bookreview WHERE id=$1",[deleteId]);
    res.redirect("/");
})

app.post("/edit", async(req,res)=>{
    const updateId = req.body.editbtn;
    console.log(updateId);
    const result = await db.query("SELECT * FROM bookreview WHERE id=$1",[updateId]);
    const details = result.rows[0];
    console.log(details);
    res.render("modify.ejs",{table : details});
})

app.post("/update", async(req,res)=>{
    const updateId = req.body.id;
    const title = req.body.title;
    const author = req.body.author;
    const contents = req.body.contents;
    const rating = req.body.rating;
    const isbn = req.body.isbn;
    const date = new Date();
    await db.query("UPDATE bookreview SET title=$1, author=$2, contents=$3, rating=$4, date=$5, isbn=$6 WHERE id =$7",[title,author,contents,rating,date,isbn,updateId]);
    res.redirect("/");
})

app.listen(port, ()=>{
    console.log(`Listening to port ${port}`);
});