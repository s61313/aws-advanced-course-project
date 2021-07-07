const app = require("./main.js");
const PORT = process.env.PORT || 8080;
app.server.listen(PORT, () => console.log(`Server started on port ${PORT}`));
