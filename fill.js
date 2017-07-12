const Promise = require('bluebird');
const spawn = require('child_process').spawn;
const exec = require('child_process').exec;

// ssh -L 27500:10.100.44.86:27017 -N ubuntu@bastion-production.clutchanalytics.com

// const middleServer = 'ubuntu@bastion-production.clutchanalytics.com',
//       endServer = '10.100.44.86:27017',
//       localPort = 27500;
// //exec('ssh -L ' + localPort + ':' + endServer + ' -N ' + middleServer + ' &\n',
// exec('ssh -L 27500:10.100.44.86:27017 -N ubuntu@bastion-production.clutchanalytics.com &', 
// //exec('ls -la', 
//     function(error, stdout, stderr){
//         console.log('asdf');
//         if(error) {
//             console.log('some error occurred')
//             console.log(error);
//             return;
//         }
//         console.log('printing something')
//         console.log(stdout, stderr);
//         console.log('printing something end')
//         //exec('kill ' + stdout.match(/\[\d+\]\s*(\d+)/)[1]);
//     });


const portNum = 27500;
var url = 'mongodb://g.blanco:temp_password@localhost:'+ portNum + '/rater-prod?authSource=admin';

var mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Model = mongoose.Model;

mongoose.connect(url);
var PayloadModel = mongoose.model('Payload', 
            new Schema({clutchQuoteId: String}, { strict: false }), 
            'cobrapayloads'/*collection name*/);

//{clutchQuoteId: '12bbfd1120a1e4110ff2ad1d86feee5114570e692d96d95af8e4e87cc9af1dc0'}

var fvin = {
        'payload.VEHICLES': {
            $elemMatch: {vin : "JTLKE50E581014599"}
            //$elemMatch: {vin : "1HGCM66354A048424"}

        }
    };

var fqid = {
    quoteId: '0a50d90e9134d2883a24679337f431dd8f671d1e3636eddbfb91af1d8394cf2f'
}
PayloadModel.find(fqid).read('primaryPreferred').limit(20)//.slaveOk()
    .then(function(thing){
        for(var i = 0; i < thing.length; i++) {
            console.log(Object.keys(thing[i]._doc), 'qid:', thing[i]._doc.quoteId,
            'rrr', thing[i].clutchQuoteId, JSON.stringify(thing[i]._doc.payload.VEHICLES.map(v => 'vin'+v.vin+'make'+v.make+'year'+v.modelYear)), Object.keys(thing[i]) );
        } console.log(thing.length);
        //console.log('asdfd$$$$$$$$$$$$', Object.keys(thing._doc.payload), thing._doc.clutchQuoteId);
    })
    .catch(function(err){
        console.log('######################################', err);
    })






































// doesn't work. need rs.slaveOk();
// var MongoClient = require('mongodb').MongoClient;

// MongoClient.connect(url, {},function(err, db) {
//     if(err) {
//         console.log('err', err);
//         return;
//     } 
//     console.log('connected to ' + url);
//     var adminDb = db.admin();

//     //Promise.promisifyAll(adminDb);
    
//     adminDb.authenticate('g.blanco', 'temp_password')
//     .then(function(a){console.log('authenticated', a)})
//     .then(function() {
//         //adminDb.replSetGetStatus(function(info){ console.log('asdf', info) });
//     })
//     .then(function(){
//         return db.collection('cobrapayloads').findOne({});
//     })
//     .then(function(cols){
//         console.log('collections: ', cols);
//     })
//     .catch(function(err) {
//         console.log('error!!!!', err);
//     });
// });


// var MongoClient = require('mongodb').MongoClient;
// MongoClient.connect('mongodb://localhost:27500/rater-prod', function(err, db) {

//   // Grab a collection object

//   // Force the creation of the collection by inserting a document
//   // Collections are not created until the first document is inserted

//     // Use the admin database for the operation
//     var adminDb = db.admin();

//     // Add the new user to the admin database

//       // Authenticate using the newly added user
//       adminDb.authenticate('g.blanco', 'temp_password', function(err, result) {

//         // Retrive the server Info, returns error if we are not
//         // running a replicaset
//         adminDb.replSetGetStatus(function(err, info) {
//             console.log(info)
//         })
//       });

// });
