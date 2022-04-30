const puppeteer = require('puppeteer');
const config = require('./config.json')
 
async function startBrowser(){
	let browser;
	try {
		//console.log("Waiting to run");
		//var posts = schedule.scheduleJob({hour: 11, minute: 10, dayOfWeek: 0}, function(){
			browser = await puppeteer.launch({
				headless: config.DEFAULT_HEADLESS_BROWSER,
				args: ["--disable-setuid-sandbox"],
				'ignoreHTTPSErrors': true
			});
		//});
	} catch (err) {
	    console.log("Could not create a browser instance Brow => : ", err);
	}
	return browser;
}

module.exports = {
	startBrowser
};