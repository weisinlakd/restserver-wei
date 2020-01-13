require('./config/config');

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
 
// parse application/json
app.use(bodyParser.json());



//router
app.use( require('./routes/index'));


mongoose.connect(process.env.URLDB, 
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
  }, 
  (err,res)=> {
    if (err) return err;
    else console.log('conectado a la db!', process.env.URLDB);
  
  }
);


console.log(process.env.URLDB);

console.log(process.env.SEED);

app.listen(process.env.PORT, () => console.log(`escuchando puerto ${process.env.PORT}`)) 