
const express = require('express');
const index = express();
const path = require('path');
const mysql = require("mysql2");

//const bodyParser = require('body-parser');
//const urlencodedParser = express.urlencoded({extended: false});
const jsonParser = express.json();


var cors = require ('cors');
index.use(cors());


const quotes = require("./quotes");
index.use("/quotes" , quotes);

var router = express.Router();

const connection0 = mysql.createConnection({
    host: "localhost",
    user: "root",
    database: "db1",
    password: "Mik110224"
});
const connection = mysql.createConnection({
    host: "141.8.193.236",
    user: "f0709980_mysql1",
    database: "f0709980_mysql1",
    password: "a31415926"
});
// тестирование подключения
connection.connect(function(err){
    if (err) {return console.error("Ошибка: " + err.message);}
    else{console.log("Подключение к серверу MySQL успешно установлено");}
});

connection.query("SELECT * FROM t1",
    function(err, results, fields) {
        console.log(err);
        console.log('results[0]=' , results[0]); // собственно данные
        //console.log(fields); // мета-данные полей
        console.log(new Date()); // мета-данные полей
});



const MongoClient = require("mongodb").MongoClient;
const url = "mongodb://127.0.0.1:27017/";
const mongoClient = new MongoClient(url);
var collection  ; var collection2  ; var db ;
async function run() {
console.log('..........mongo start....' , new Date() , '...................................');
console.log('mongo start....' , new Date());
try {
        // Подключаемся к серверу
        let resConnect = await mongoClient.connect();
        //console.log("resConnect=", resConnect);
        console.log("взаимодействие с базой данных") ;
        db = mongoClient.db("mongo_db1");
        collection = db.collection("t1"); collection2 = db.collection("t2");
        const count = await collection.countDocuments();
        console.log(`В коллекции users ${count} документов`);

        collection.find({country: 'Borders'}).toArray(function(err, results){
            console.log(results.slice(0,2));
            //client.close();
        });

} catch (err) {   console.log('!!!!!error=',err) }
}
run();

//------------------------------------------------------------------
index.get('/', (req, res) => res.send('localhost:3001'));
index.get('/p1', (req, res) => {res.sendFile(path.resolve('index1.html'))});
index.get('/p2', (req, res) => res.send('<h2 style="border: 2px solid black">Page  p2<h2>'));
index.get('/p3', (req, res) => res.send('<h2 style="border: 2px solid black">Page  p3<h2>'));
index.get('/p4', (req, res) => res.send({page:connection}));
index.get('/p5', (req, res) => {res.sendFile(path.resolve('index.html'))});
index.get('/p6', (req, res) => res.send({"page":connection}));
index.get('/p7', (req, res) => res.json({"page":connection}));

index.get('/p8', (req, res) => { connection.query('SELECT * FROM t1 where id>1', (error, result) =>
                                         { if (error) throw error;   res.send(result)})});
index.get('/p9',(req, res) => {connection.query('SELECT  id , t1.NameCompany   from t1', (err, rows, fields) =>
                                         {if (err) throw err ;console.log('The  is: ', rows); res.send([...rows])})}) ;

const users = [[143,"Bob"], [144,"Kate"]];

const sql5 = `INSERT INTO t1(id ,NameCompany) VALUES ?`;
index.get('/p10',(req, res) => {connection.query(sql5, [users],(err, rows, fields) =>
{if (err) throw err ;console.log('The  is: ', rows); res.send('result')})}) ;

index.get("/p11", function (request, response) {response.sendFile(__dirname + "/index3.html");});

index.post("/p12", jsonParser, function (request, response) {
    console.log('request.body=' ,request.body , new Date());
    if(!request.body) return response.sendStatus(400);
    response.json(request.body); // отправляем пришедший ответ обратно

    let obj1=request.body;

    //let user = [29, "Bryce"];
    let user=[obj1.NameCompany];
    //const sql55 = "INSERT INTO t1(id, NameCompany) VALUES(?, ?)";
    const sql55 = "INSERT INTO t1(NameCompany) VALUES(?)";

    connection.query(sql55, user, function(err, results) {
        if(err) console.log(err);
        else console.log("Данные добавлены");
    });
});


//...................................................................................
//...................................................................................
index.get('/p98',(req, res) => {
async function p98() {

    let r1= await collection.aggregate([
        {$unwind: "$students"},
        {
            $group: {_id: "$country", qty: {$sum: "$students.number"}}
        }
    ]).toArray(); console.log('r1=', r1);

/*
    db.sales.aggregate([
        {
            $group: {
                _id: '$country',
                totalCnt: { $cnt: '$quantity' },
            },
        },
    ]);
*/
    var res5 =await collection.aggregate([
                                           {"$group" : {_id:"$country", count:{$sum:1}}}
                                         ]).toArray() ;
    let colQd=db.collection("qd"); console.log('qd.toArray()=',db.collection("qd") , new Date());
    colQd.deleteMany({});
    colQd.insertMany(res5, function(err, result){if(err){return console.log(err)}});


    let r2 =await collection2.find({}).toArray();
    //console.log('r2=' , r2) ;

    await collection.find().forEach(function (item) {
            collection.updateOne({_id: item._id}, {
            $set: {
                "altitude": item.location.ll[0],
                "longitude": item.location.ll[1],
                "overallStudents": r1.filter(itemR1=>itemR1._id==item.country)[0].qty,
                "overallSum": item.students.reduce((sm, itemR) => sm + itemR.number, 0)
            }
        });
    })

}
p98();


}) ;
//.......................................................................................
index.get('/p99',(req, res) =>
{
    (async function(){
        console.log('..........p99............', new Date());
        let rescol = await collection.find().toArray();
        console.log(rescol[0]);
        res.send(rescol);
    })();
}) ;
//.......................................................................................

index.get('/p13', (req, res) => {
try {
     let dd=new Date();
     const options = {
                      method: 'GET',
                      headers:{ "Authorization": "Bearer " +
                                "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6ImVjN2Q5ZDYwYTk4ZWY0Y2Q2ZmY1Yzk5ZGVjZ" +
                                "jFlYTdmM2I4NGFiNWJmZDU1ZDQ4ZmQ1MjY5OTc3OWI3YzBmMzRkYzIzNWE0OGYxNmE0OTBmIn0.eyJhd" +
                                "WQiOiJjOTcyMGE0YS0zYzIwLTRmM2MtYmVmZC03YWY4MjZhMGVjNTgiLCJqdGkiOiJlYzdkOWQ2MGE5O" +
                                "GVmNGNkNmZmNWM5OWRlY2YxZWE3ZjNiODRhYjViZmQ1NWQ0OGZkNTI2OTk3NzliN2MwZjM0ZGMyMzVhND" +
                                "hmMTZhNDkwZiIsImlhdCI6MTY2MjIyODYwMSwibmJmIjoxNjYyMjI4NjAxLCJleHAiOjE2NjIzMTUwMDEs" +
                                "InN1YiI6Ijg1MTg1MjgiLCJhY2NvdW50X2lkIjozMDM3NTIyNiwic2NvcGVzIjpbInB1c2hfbm90aWZpY2F" +
                               "0aW9ucyIsImZpbGVzIiwiY3JtIiwiZmlsZXNfZGVsZXRlIiwibm90aWZpY2F0aW9ucyJdfQ.LrLvELdbSzU" +
                               "FHWQyf4WtpJuXyd9_uUDHYmJCH25I3sbPxoX77JEljK_V36gqan7zIdfMRqVUg-4yEAQ819jO-0OYdL8B5q" +
                                "C-HMvAtf67TCa8syinUHUtUgFkB4YAKQqGXp8yHbN4_SKBjFq3T3a5owLTDgqWi08FHtmeWemUtYEtoeHd" +
                               "A_9WCPaC9FUKxXjy174Q-bpedlQeRDKqnooOuUrpC-02SqOTWMVs8g6fLW_d6HvAJZSkORBIkuA892fFUZI" +
                               "ijbOwL6dcAvI4AOilPXZkLcPBFK9OrvxmmJMVDYtftjWf_vVE8fkZ2-NtKoxLJeG0RrNpl_PJUI2n9t6Xbg"
                             }
                     }
        fetch("https://mfvgml.amocrm.ru/api/v4/leads", options ).then(res=>res.json()).then(r=>res.send(r._embedded.leads));
    }  catch (err) {    console.error('err1=',err,'****');  }
});


//......................................................................
const port = process.env.PORT || 3001   ;
index.listen(port, () => console.log(`Server running on ${port}, port ${port}  ${new Date()}`));
module.exports = router;





