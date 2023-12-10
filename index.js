const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const https = require('https')
const { error } = require('console')
const app = express()
const PORT = 3000;

app.set('view engine', 'ejs')
const viewPath = path.join(__dirname, "/views");
app.set('views', viewPath)
const otherFilePath = path.join(__dirname, "/public")
app.use(express.static(otherFilePath))

app.use(bodyParser.urlencoded({
    extended: true
}));

app.get("/", (req, res)=>{
    res.render('home',{
        city : "",
        country : "",
        tempmin : "",
        tempmax : "",
        tempval : "",
        imgSrc : "http://openweathermap.org/img/w/01d.png",
        weatherDesc : ""
    });
})
app.post("/", (req, res)=>{

    const query = req.body.cityname.trim();
    const unit = "metric"
    const apiKey = "0f9349d541a04854a5bfe3ec99306196"
    const url = "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&units=" + unit + "&appid=" + apiKey;
    https.get(url, (response) => { //Node HTTPS get request
        
        response.on('data', (data)=>{
            const obj = JSON.parse(data)    //convert string to object

            //To get dynamic image
            try {
                const icon = obj.weather[0].icon;
                const imgURL = "http://openweathermap.org/img/w/" + icon + ".png";
                const description = obj.weather[0].description;
                res.render('home', {
                    city : obj.name,
                    country : obj.sys.country,
                    tempmax : obj.main.temp_min,
                    tempmin : obj.main.temp_max,
                    tempval : obj.main.temp,
                    imgSrc : imgURL,
                    weatherDesc : description
                })
                // console.log(arr);
            } catch (error) {
                res.redirect('error')
            }
        })
        response.on('end', ()=>{    //Ended received data
            console.log('success');
        })
    }).on('error', (err)=>{
        console.log("ERROR message ::: ", err);
        res.redirect('error')
    })
})

app.get("/error", (req, res)=>{
    res.render('error')
})
app.post("/error", (req, res)=>{
    res.redirect('/')
})
app.listen(PORT, ()=>{
    console.log(`Listening to port : ${PORT}`);
})