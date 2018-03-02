const mongoose = require('mongoose');

const weather_schema = mongoose.Schema({
    spot_id: Number,
    name: String,
    weather: String,
    windspeed: Number,
    winddirection: Number,
    // isFlyable: Boolean,
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Weather', weather_schema);
