const fs = require('fs');
const config = require('./config.json');
const express = require('express');
const cors = require('cors');
const browserObject = require('./browser');
const scraperController = require('./pageController');
const schedule = require('node-schedule');
const replaceNonAscii = require('./replaceNonAscii')

console.log("SERVER RUNNING...")

let browserInstance = browserObject.startBrowser();
scraperController(browserInstance)

schedule.scheduleJob('0 0 */1 * * *', function(){
    console.log("SERVER RESTARTING...")
    browserInstance = browserObject.startBrowser();
    scraperController(browserInstance)
});

const app = express();
app.use(cors());

function sufferArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

function pagination(data, skip, limit) {
    return new Promise(resolve => {
        sufferArray(data);
        let pagination = data.slice(parseInt(skip), (parseInt(skip) + parseInt(limit)))
        resolve(pagination);
    })
}

app.get('/', async function (req, res) {
    const page = Math.abs(req.query.page) || 1;
    const limit = Math.abs(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    let streams = []; 
    let categories = [];
    let data = null;
    
    const dir = './public/posts/TWITCH_API';
    const category = config.GOOGLENEWS_CRAWLER.VN_URL;

    // for (var i = 0; i < category.length; i++) {
    //     const path = `public/posts/CATEGORIES/${category[i][1]}.json`;
    //     categories.push(...JSON.parse(fs.readFileSync(path, 'utf8')))
    //     sufferArray(categories);
    // }
    // for (var j = 0; j < categories.length; j++) {
    //     const path = `public/posts/TWITCH_API/${replaceNonAscii(categories[j])}.json`;
    //     streams.push(...JSON.parse(fs.readFileSync(path, 'utf8')))
    // }

    await fs.readdir(dir, (err, files) => {
        for (var i = 0; i < files.length; i++){
            const path = require(`${dir}/${files[i]}`)
            streams.push(...path)
        }
        
        const streamsResolve = pagination(streams, page, limit)
        streamsResolve.then(result => res.send(result))
    })
    
    
    
    
})

// app.get('/sg', async function (req, res) {
//     const page = Math.abs(req.query.page) || 1;
//     const limit = Math.abs(req.query.limit) || 20;
//     const skip = (page - 1) * limit;

//     let news = [];
//     for (var i = 0; i < config.GOOGLENEWS_CRAWLER.SG_URL.length; i++) {
//         let path = `public/posts/GG_API/Sg/${config.GOOGLENEWS_CRAWLER.SG_URL[i][1].toLowerCase()}.json`
//         news.push(...JSON.parse(fs.readFileSync(path, 'utf8')));
//     }

//     // read file from path
//     const data = await pagination(news, skip, limit);
//     res.send(data);
    
// })

// app.get('/cn', async function (req, res) {
//     const page = Math.abs(req.query.page) || 1;
//     const limit = Math.abs(req.query.limit) || 20;
//     const skip = (page - 1) * limit;

//     let news = [];
//     for (var i = 0; i < config.GOOGLENEWS_CRAWLER.CN_URL.length; i++) {
//         let path = `public/posts/GG_API/Cn/${config.GOOGLENEWS_CRAWLER.CN_URL[i][1].toLowerCase()}.json`
//         news.push(...JSON.parse(fs.readFileSync(path, 'utf8')));
//     }

//     // read file from path
//     const data = await pagination(news, skip, limit);
//     res.send(data);
// })

// app.get('/kr', async function (req, res) {
//     const page = Math.abs(req.query.page) || 1;
//     const limit = Math.abs(req.query.limit) || 20;
//     const skip = (page - 1) * limit;

//     let news = [];
//     for (var i = 0; i < config.GOOGLENEWS_CRAWLER.KR_URL.length; i++) {
//         let path = `public/posts/GG_API/Kr/${config.GOOGLENEWS_CRAWLER.KR_URL[i][1].toLowerCase()}.json`
//         news.push(...JSON.parse(fs.readFileSync(path, 'utf8')));
//     }

//     // read file from path
//     const data = await pagination(news, skip, limit);
//     res.send(data);
    
// })

// app.get('/jp', async function (req, res) {
//     const page = Math.abs(req.query.page) || 1;
//     const limit = Math.abs(req.query.limit) || 20;
//     const skip = (page - 1) * limit;

//     let news = [];
//     for (var i = 0; i < config.GOOGLENEWS_CRAWLER.JP_URL.length; i++) {
//         let path = `public/posts/GG_API/Jp/${config.GOOGLENEWS_CRAWLER.JP_URL[i][1].toLowerCase()}.json`
//         news.push(...JSON.parse(fs.readFileSync(path, 'utf8')));
//     }

//     // read file from path
//     const data = await pagination(news, skip, limit);
//     res.send(data);
    
// })

// app.get('/th', async function (req, res) {
//     const page = Math.abs(req.query.page) || 1;
//     const limit = Math.abs(req.query.limit) || 20;
//     const skip = (page - 1) * limit;

//     let news = [];
//     for (var i = 0; i < config.GOOGLENEWS_CRAWLER.TH_URL.length; i++) {
//         let path = `public/posts/GG_API/Th/${config.GOOGLENEWS_CRAWLER.TH_URL[i][1].toLowerCase()}.json`
//         news.push(...JSON.parse(fs.readFileSync(path, 'utf8')));
//     }

//     // read file from path
//     const data = await pagination(news, skip, limit);
//     res.send(data);
    
// })

app.listen(4000)

