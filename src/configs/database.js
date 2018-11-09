const moongose = require('moongose');
const {mongodb} = require('./keys');

moongose.connect(mongodb.URI,{
    useNewUrlParser: true,
    useCreateIndex: true
})
.then (db => console.log('connection success!'))
.catch(err => console.log(err));