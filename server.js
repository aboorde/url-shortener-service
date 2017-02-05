var express = require("express");
var path = require("path");


var app = express()

app.listen(process.env.PORT || 8080, function () {
  console.log('Example app listening on port 3000!')
})