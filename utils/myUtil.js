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

