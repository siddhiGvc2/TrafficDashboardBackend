var express = require('express');
require('dotenv').config();
var db=require('./Models/index');
var path = require('path');
// var https = require('https');
import kwikpayRouter from "./Routes/TrafficTesting/macAddress.js";
import kwikpayTestingRouter from "./Routes/TrafficTesting/testing.js";
require ('./database.js');

var cors=require('cors');


const PORT=process.env.PORT || 443;
 const publicRoutes=require('./Routes/public');
const apiRoutes=require('./Routes/api');
const adminRoutes=require('./Routes/admin');
const batteryRouter=require('./Routes/BatteryMonitorRoutes/batteries.js')
const apiMiddleware=require('./Middleware/apiAuth');
const adminMiddleware=require('./Middleware/adminAuth');
const errorHandler=require('./Middleware/errorHandler');
const Routes=require('./Routes/additions.js');
const trafficRouter=require('./Routes/trafficLight.js');
const customerRouter=require("./Routes/customer.js");
const MqttHandler=require('./mqtt.js');
const mqttClient=new MqttHandler();

var app = express();

// app.use(logger('dev'));
app.use(cors({
  origin:"*",
  methods:"GET"/"POST"
}));
app.use(express.json());

app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
  (async () => {
    await db.sequelize.sync();
  })();
 

  app.use('/api',apiMiddleware, apiRoutes);
  app.use('/api/admin',apiMiddleware,adminMiddleware,adminRoutes);
  app.use('/pub', publicRoutes);
  app.use('/add',Routes);
  app.use('/batteryMonitor',batteryRouter);
  app.use('/trafficLights',trafficRouter);
  app.use('/customers',customerRouter);
  app.use('/kwikpay',kwikpayRouter);
  app.use('/kwikpayTesting',kwikpayTestingRouter);
  app.get('/', (req, res) => res.send('Ok'));


  app.use(errorHandler);

  module.exports = app;
 


// app.listen(PORT,()=>{

  
//     console.log(`Server listening ont ${PORT}`);
//     mqttClient.connect(); 
    
// })



