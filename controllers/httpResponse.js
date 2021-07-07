class Response {
    constructor(resMsg, resCode, isError, data) {
      this.resCode = resCode;
      this.resMsg = resMsg;
      this.isError = isError;
      this.data = data;
    }
    
}


module.exports = Response;