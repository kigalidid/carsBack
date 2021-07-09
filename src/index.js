const express = require("express")
const {json,urlencoded} =require("express")
const cors = require("cors")
const morgan = require("morgan")

const auth = require("./routes/auth")
const User = require("./routes/user")



const app = express();

app.use(morgan("dev"))
app.use(cors())
app.use(json())
app.use("/auth",auth)
app.use("/user",User)

app.use(urlencoded({extended:false}))





const PORT = process.env.PORT || 9000;
app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});


