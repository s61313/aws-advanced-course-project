exports.handler = async (event) => {
    
    for (var i = 0; i < event.Records.length ; i++) {
        let record = event.Records[i]
        const { body } = record;
        console.log("body: ", body);
        
        console.log("type of body: " + (typeof body))
        if (typeof body === 'string') {
            body = JSON.parse(body)
        }

        console.log("body.process_time_ms: ", body.process_time_ms);
        const { process_time_ms } = body;
        
        console.log("start processing: " + process_time_ms);
        await delay(process_time_ms);
        console.log("ends processing.");
        
    }    

    const response = {
        statusCode: 200,
        body: JSON.stringify('Successfully finished! '),
    };
    
    return response;
};

function delay(time) {
  return new Promise(resolve => setTimeout(resolve, time));
}


