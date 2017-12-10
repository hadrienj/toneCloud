import PouchDB from 'pouchdb';


class Data {
  constructor(dbName) {
    this.db = new PouchDB('http://127.0.0.1:5984/'+dbName);
  }
  get(id) {
    return new Promise((resolve, reject)=> {
      this.db.get(id, {allDocs:true}).then((docs)=>{
        resolve(docs);
      }).catch((err)=>{
        console.log(err);
      });
    })
  }
}

export default Data;