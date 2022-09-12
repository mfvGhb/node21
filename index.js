
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

//......................................................................
const port = process.env.PORT || 3001   ;
index.listen(port, () => console.log(`Server running on ${port}, port ${port}  ${new Date()}`));
module.exports = router;





