

const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const https = require("http");
app.use(bodyParser.urlencoded({extended: true}));


app.get("/", function(req, res){
    res.sendFile(__dirname + "/index.html");
});

app.post("/", function(req, res){
console.log(req.pressure);
const url = "http://api.openweathermap.org/data/2.5/weather?q=" + req.body.cityName+ "&appid=4e046c34a987ab3041e3e2d0621ebe90&units=metric";
    https.get(url, function(response){
        console.log(response.statusMessage);

        response.on("data", function(data){
            const weatherData = JSON.parse(data);
            const temp =weatherData.main.temp;
            const weatherDescription = weatherData.weather[0].description;
            const icon = weatherData.weather[0].icon;
            const imageUrl= "http://openweathermap.org/img/wn/"+icon +"@2x.png";
            
            res.write("<p> The weather is currently " + weatherDescription + "</p>")
            res.write("<h1> The temperature of " + req.body.cityName +  " is " + temp + " degrees Celcius.</h1>");
            res.write("<img src="+ imageUrl +">")
            res.send();
            
        });
    });

})

app.listen(3000, function(){
    console.log("Server is on and running on port 3000");
})