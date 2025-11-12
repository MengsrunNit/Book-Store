const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;

let _db; 

const mongoConnect = (callback) =>{
  MongoClient.connect('mongodb+srv://nitmengsrun_db:Mengsrun27@cluster0.7bivgbo.mongodb.net/book-store?appName=Cluster0')
    .then(client => {
      console.log('Connected to MongoDB');
      _db = client.db();
      callback();
    })
    .catch(err =>{
      console.log(err);
    })
};

const getDb = () =>{
  if (_db){
    return _db;
  }
  throw 'No database found!';
}

exports.getDb = getDb;
exports.mongoConnect = mongoConnect;