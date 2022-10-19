
class PDMSerial {
  constructor (port) {
     console.log("port: "+ port)
    // this.serial;                               // Variable to hold instance of serialport library
    this.portName = port;    // Fill in  serial port name here

// Serial data global variables
    this.sensorData = {};
    this.pastSensorData = {};
    this.inData = "bob";                               // For incoming serial data
    this.outData;                              // For outgoing serial data
   
    this.serialEvent = this.serialEvent.bind(this);
    this.transmit = this.transmit.bind(this);
    this.sensorCheck = this.sensorCheck.bind(this);
    this.sensorsConnected = this.sensorsConnected.bind(this);
    
    this.serial = new p5.SerialPort();           // Make new instance of serialport library
    this.serial.open(this.portName);                  // Open serial port
    
    this.serial.on('data', this.serialEvent);         // Callback when new data arrives
    this.serial.on('error', this.gotError);        // Callback for errors
    this.serial.on('connected', ()=>{console.log('Connected to P5SerialControl Server')});
    this.serial.on('open', ()=>{console.log("Serial Port is open!");});
    // this.serial.on('open', this.gotError);
 }


  // Read data from the serial port

  serialEvent() {
    
    // console.log("data: ", this.inData);
    this.inData = this.serial.readStringUntil(";\n"); 

    let sensors = this.inData.split(',');
      // ['a0:997','d7:0']  =>  {'a0':997,'d7':0}
    sensors.forEach ((element) => {
      let el = element.split(':');
      if (el[0]) {
        this.sensorData[el[0]] = parseFloat(el[1]);        
      }
    });
    
    // check for changes
    //let flags = this.sensorCheck();
    
    this.pastSensorData = this.sensorData;

    // sensorData = sensors.reduce((accumulator, currentSensor) => {
    //   let el = element.split(':');
    //   accumulator[el[0]] = el[1];
    // });

    //console.log("changes: ", flags.toString());
    
    // console.log(sensors);                      // Log incoming data
  }
  
  sensorCheck(){
    
    let obj1 = this.sensorData;
      // console.log("SensorData: ", obj1);
    let obj2 = this.pastSensorData;
      // console.log("pastSensorData: ", obj2);
    let flags = [];

    if(Object.keys(obj1).length==Object.keys(obj2).length){
        for(key in obj1) { 
          console.log("key ",key, obj1[key]);
            if(obj1[key] == obj2[key]) {
                continue;
            }
            else {
                flags.push(key);
                // console.log(key);
                // break;
            }
        }
    }
    else {
        flags.push(false);
    }
    
    return flags;
  }

  
  sensorsConnected() {
    let sensorList = Object.keys(this.sensorData);
    return sensorList;
  }
  
  // Error Logging

  gotError(theerror) {
    console.log('Error in PDM Serial:' + theerror);
  }
  
  
  // ********* LSU DDEM Transmit to Arduino

  transmit(name,value) {
    this.outData = name + ":" + value +','; 
    // console.log("Writing to Serial Port: " + this.outData);
    this.serial.write(this.outData); 
  }


}
