// links all the .env files
require("dotenv").config();

var keys = require("./keys")
var axios = require("axios")
var moment = require ("moment")
var fs = require("fs")
var Spotify = require("node-spotify-api")
var spotify = new Spotify(keys.spotify)
// will load keys.js with console.log
var inquirer = require("inquirer")
var apiKey = "ab2901a"
var url = `http://www.omdbapi.com/?apikey=${apiKey}&`

function searchBandsInTown(){
    inquirer.prompt([{
        type: "input",
        message: "search by bandsInTown",
        name: "bandsInTown"
    }]).then(inquirerResponse => {
        console.log(inquirerResponse.bandsInTown)
        let queryURL = "https://rest.bandsintown.com/artists/" + inquirerResponse.bandsInTown + "?app_id=codingbootcamp"
        // console.log(queryURL)
        axios.get(queryURL).then(res => {
            console.log(res)
        })
    })
}

function searchOmdb(){
    inquirer.prompt([{
        type: "input",
        message: "search by movie",
        name: "omdbSearch"
    }]).then(inquirerResponse => {
        console.log(inquirerResponse.omdbSearch)
        let queryURL = `${url}t=${inquirerResponse.omdbSearch}`
        // console.log(queryURL)
        axios.get(queryURL).then(res => {
            console.log("\x1b[34m","Title: " + res.data.Title)
            console.log("Release Year: " + res.data.Year)
            console.log("IMDB Rating: " + res.data.imdbRating)
            console.log("Country: " + res.data.Country)
            console.log("Language: " + res.data.Language)
            console.log("Plot: " + res.data.Plot)
            console.log("Actors: " + res.data.Actors)
        })
    })
}

function searchSpotify(){
    inquirer.prompt([{
        type: "input",
        message: "search artist",
        name: "spotifySearch"
    }]).then(inquirerResponse => {
        console.log(inquirerResponse.spotifySearch)
        spotify.search({
            type: "track",
            query: inquirerResponse.spotifySearch
        }, 
        function(err, data) {
            if (err) throw err
            console.log("Artist: " + data.tracks.items[0].artists[0].name);
            console.log("Song: " + data.tracks.items[0].name);
            console.log("Preview Link: " + data.tracks.items[0].preview_url);
            console.log("Album: " + data.tracks.items[0].album.name);
        }
        )
    })
}

inquirer.prompt([{
    type: "list", 
    message: "choose an option for liri",
    choices: ["search spotify", "search bands in town", "search omdb", "quit app"],
    name: "options"
}]).then(inquireResponse => {
    // ternery expression... if/else that relies on true/false
    inquireResponse.options === "quit app"
    ? process.exit()
    : inquireResponse.options === "search spotify"
    ? searchSpotify() 
    : inquireResponse.options === "search omdb"
    ? searchOmdb()
    : inquireResponse.options === "search bands in town"
    ? searchBandsInTown()
    : console.log("get to this later")
})