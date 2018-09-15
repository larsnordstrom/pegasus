const SerialPort = require("serialport");
var Readline = SerialPort.parsers.Readline;

const getConfig = (comName, cb, ecb) => {
  var parser = new Readline({
    delimiter: "#"
  });
  let port = new SerialPort(comName, {
    baudRate: 115200
  });
  port.pipe(parser);
  let ret = "";
  let sendNext = false;
  parser.on("data", data => {
    if (sendNext) {
      ret = data;
      sendNext = false;
    }
  });
  port.write("#\n", err => {
    setTimeout(() => {
      port.write("config\n", err => {
        sendNext = true;
        setTimeout(() => {
          //trim off " config\n";
          cb(JSON.parse(ret.slice(7)));
          port.close();
        }, 1000);
      });
    }, 1000);
  });
};

const setValue = (comName, name, newVal, cb) => {
  let port = new SerialPort(comName, {
    baudRate: 115200
  });
  port.write(`set ${name}=${newVal}\n`, err => {
    port.close();
    setTimeout(() => {
      cb();
    }, 1000);
  });
};

const saveConfig = (comName, cb) => {
  let port = new SerialPort(comName, {
    baudRate: 115200
  });
  port.write(`save\n`, err => {
    port.close();
    setTimeout(() => {
      cb();
    }, 1000);
  });
};

module.exports = {
  getConfig: getConfig,
  setValue: setValue,
  saveConfig: saveConfig
};
