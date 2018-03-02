const router = require('express').Router();
const http = require('http');
const Weather = require('../../models/weather')
const db_mysql = require('../../config')

var mongoose = require('mongoose');
const Promise = mongoose.Promise = require('bluebird')
//api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}
//4b8f42ec34cf7b9214eb961cca8a0c01

const CardinalPoint = {
    "N": [348.75, 11.25],
    "NNE": [11.25, 33.75],
    "NE": [33.75, 56.25],
    "ENE": [56.25, 78.75],
    "E": [75.75, 101.25],
    "ESE": [101.25, 123.75],
    "SE": [123.75, 146.25],
    "SSE": [146.25, 168.75],
    "S": [168.75, 191.25],
    "SSO": [191.25, 213.75],
    "SO": [213.75, 236.25],
    "OSO": [236.25, 258.75],
    "O": [258.75, 281.25],
    "ONO": [281.25, 303.75],
    "NO": [303.75, 326.25],
    "NNO": [326.25, 348.75]
}

const get_weather = (lat, lon) => {
    return Weather.find({})
        .sort({
            _id: -1
        })
        .then((w) => {
            var weather_save
            http.get("http://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lon + "&APPID=4b8f42ec34cf7b9214eb961cca8a0c01", (res) => {

                res.setEncoding('utf8');
                res.on('data', (data) => {
                    data = JSON.parse(data);
                    // var isFlyable = CheckIfFlyable(spot, data);
                    const weather = new Weather({
                        //boucle qur chaque spot
                        // spot_id: spot.id,
                        // name: spot.name,
                        weather: data.weather[0].main,
                        windspeed: data.wind.speed,
                        winddirection: data.wind.deg,
                        // isFlyable: isFlyable
                    });

                    weather.save()
                        .then((weather) => {
                            return weather_save = weather
                        })
                        .catch((err) => {
                            console.log(err);
                        });
                });
            }).end();

            return w
        })
        .then((w) => {
            console.log(w[0]);
            return w[0]
        })

}

router.get('/:lat&:lon', (req, res) => {
    Promise
        .resolve([get_weather(req.params.lat, req.params.lon)])
        .all()
        .then((ww) => {
            res.send(ww[0])
        })

})

router.post('/name', (req, res) => {
    const selct_name = 'SELECT * FROM `sites` WHERE `name` = (?)'
    const truc = [
        req.body.name
    ]
    db_mysql.query(selct_name, [truc], (err, result) => {
        if (err) {
            console.log(err);
            return
        }
        result.forEach((spot) => {
            Promise
                .resolve([get_weather(spot.lat, spot.lon)])
                .all()
                .then((ww) => {
                    res.send(ww[0])
                })
        })
    })
})

router.post('/spot', (req, res) => {
    const selct_name = 'SELECT * FROM `sites` WHERE `identifiant` = (?)'
    const truc = [
        req.body.identifiant
    ]
    db_mysql.query(selct_name, [truc], (err, result) => {
        if (err) {
            console.log(err);
            return
        }
        result.forEach((spot) => {
            Promise
                .resolve([get_weather(spot.lat, spot.lon)])
                .all()
                .then((ww) => {
                    res.send(ww[0])
                })
        })
    })
})

module.exports = router;
