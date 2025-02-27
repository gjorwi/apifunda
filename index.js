var express = require('express'),   
app = express(),   
port = process.env.PORT || 4000,   
mongoose = require('mongoose')   
global.refreshTokens = [];
var cors = require('cors')

bodyParser = require('body-parser');   

// mongoose instance connection url connection 
mongoose.Promise = global.Promise;  
// mongoose.connect('mongodb://localhost:27017/fundadb2', {useNewUrlParser: true,useUnifiedTopology: true});  

// mongoose.connect('mongodb+srv://fundadb2:Jf18769212.@cluster0.cfhkb.mongodb.net/?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true});  
mongoose.connect('mongodb+srv://fundadb2:Jf18769212.@cluster0.cfhkb.mongodb.net/?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true});  
//mongoose.connect('mongodb+srv://gjorwi06:Jf18769212.@cluster0.34nau.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true });  
// mongodb+srv://fundadb:Jf18769212.@cluster0.2w3ie.mongodb.net/?retryWrites=true&w=majority

app.use(bodyParser.urlencoded({ extended: true })); 
app.use(bodyParser.json());
app.use(cors({
    origin: 'https://fundamutual.vercel.app', // Permitir solicitudes desde este origen
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    allowedHeaders: 'Origin, X-Requested-With, Content-Type, Accept, Authorization'
}));

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "https://fundamutual.vercel.app");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,PUT,PATCH,POST,DELETE");
    res.header("Access-Control-Allow-Credentials", "true");
    next();
});

//importing route
var routes = require('./router/fundaRoutes'); 

 
//register the route
routes(app); 

app.use((req, res, next) => {
    res.status(404).send({
        status: 404,
        error: 'Not found'
    })
})
   
app.listen(port,()=>{
    console.log('Servidor para RESTful API de Libros iniciada en puerto: ' + port);
    console.log('********************************************');
});   

