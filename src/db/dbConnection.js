const mongoose = require("mongoose");
mongoose.connect(process.env.DB_URL,{

    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => {
        console.log("Database connection is successfull");
    })
    .catch ((err) => {
        console.log("Error occurs when connecting to database: ", err);
    });
