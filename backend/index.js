require("dotenv").config();

const app = require("./app");

// Initialize database
require("./config/database");

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {

    console.log("==================================");
    console.log(" ERP FASHION SERVER STARTED");
    console.log("==================================");
    console.log(`Server : http://localhost:${PORT}`);
    console.log(`Health : http://localhost:${PORT}/health`);
    console.log("==================================");

});