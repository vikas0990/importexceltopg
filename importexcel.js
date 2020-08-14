const express=require('express');
const app=express();
const cors = require('cors');
var multer  = require('multer')
var path=require('path');
var fs=require('fs');
 
const readXlsxFile = require('read-excel-file/node');

app.use(express.json());
app.use(cors())

const { Pool, Client } = require("pg");
const { request } = require('http');
// -> Multer Upload Storage
global.__basedir = __dirname;


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
       cb(null, __basedir + '/uploads/')
    },
    filename: (req, file, cb) => {
       cb(null, file.fieldname + "-" + Date.now() + "-" + file.originalname)
    }
  });


const upload = multer({storage: storage});

app.post('/uploadfile',upload.single('uploadfile'),(req,res)=>{
    let filename=__dirname+'/uploads/'+req.file.filename;

importFileIntoPG(filename);
res.end();
});

function importFileIntoPG(filename){
    console.log(filename);


    readXlsxFile(filename).then((rows)=>{

    rows.shift();

    const pool = new Pool({
        user: "postgres",
        host: "localhost",
        database: "postgres",
        password: "postgres",
        port: "5432"
      });
      let query = `INSERT INTO public.customer (id, address, name, age) VALUES($1,$2,$3,$4)`;
       
      rows.forEach(row=>{
        pool.query(query, row,(error, response) => {
            console.log(error || response);
      });


      });
    

    })
}

let port= 5000;
app.listen(port,()=>console.log(`listening to port ${port}`));



