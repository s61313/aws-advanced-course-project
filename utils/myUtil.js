var fs = require('fs');

class myUtil {
    constructor() {
      this.lock_available = true;
    }

    uuidv4() {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
    }

    wait_for_second(ms){
      return new Promise(async (resolve) => {
        while(true) {
          if (this.lock_available === true) break;
          await this.sleep(1);
        }
  
        this.lock_available = false;
        await this.sleep(ms);
        this.lock_available = true;      
        
        resolve();
      });
    }    

    sleep(ms) {
      return new Promise((resolve) => {
        setTimeout(resolve, ms);
      });
    }

    write_to_file(filepath, stringcontent) {
      return new Promise((resolve) => {

        fs.writeFile(filepath, stringcontent, function(err) {
          if (err) throw err;
          console.log('write complete');
          resolve();
        });

      });
    }

    read_from_file(filepath, stringcontent) {
      const isJsonFunc = this.isJson;
      return new Promise((resolve) => {

        fs.readFile(filepath, function(err, data) {
          if (err) throw err;
          if (isJsonFunc(data)) {
            console.log('read complete (json): ', JSON.parse(stdout));
          }else {
            console.log('read complete: ', data);
          }
          resolve(data);
        });

      });
    }


    isJson(str) {
      try {
          JSON.parse(str);
      } catch (e) {
          return false;
      }
      return true;
  }

}
module.exports = myUtil;

