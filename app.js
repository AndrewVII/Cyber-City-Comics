let express = require("express");
let path = require("path");
let routes = require("./routes/routes");
let app = express();


app.set("port", process.env.PORT || 3000);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(routes);
app.use('/static', express.static(path.join(__dirname, 'public')));

app.listen(app.get("port"), function(){
  console.log("Server started on port " + app.get("port"));
});