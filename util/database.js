const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;

let _db; 

const mongoConnect = (callback) => {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    throw new Error('MONGO_URI is not set. Add it to your .env file.');
  }
  MongoClient.connect(uri)
    .then((client) => {
      console.log('Connected to MongoDB');
      _db = client.db();
      callback();
    })
    .catch((err) => {
      console.log(err);
    });
};

const getDb = () =>{
  if (_db){
    return _db;
  }
  throw 'No database found!';
}

exports.getDb = getDb;
exports.mongoConnect = mongoConnect;