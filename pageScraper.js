const fs = require('fs');

const config = require('./config.json');
const replaceNonAscii = require('./replaceNonAscii')
const makeDir = require('make-dir');
const { scrollPageToBottom } = require('puppeteer-autoscroll-down')


const scraperObject = {

    categories: [
        config.GOOGLENEWS_CRAWLER.VN_URL
    ],

    languages: config.GOOGLENEWS_CRAWLER.LANGUAGES, //vi en ko th ch hi

   

	async scraper(browser){
        const page = await browser.newPage();
        await fs.rmSync('public/posts/TWITCH_API', { recursive: true, force: true });
        await makeDir('public/posts/TWITCH_API');
        await makeDir('public/posts/CATEGORIES');

        for (var i = 0; i < this.categories[0].length; i++) {
            await page.goto(this.categories[0][i][0], {
                waitUntil:'networkidle0'
            });
            
        

            const newsData = await page.evaluate(() => {
                let result = [];
                let blocks = document.querySelectorAll('h2.CoreText-sc-cpl358-0.fzONq')
            
                blocks.forEach(block => {
                    result.push(block.innerHTML);
                })
                return result;
            });

            const dir = `public/posts/CATEGORIES/${this.categories[0][i][1]}.json`

            fs.writeFileSync(dir, JSON.stringify(newsData ,null, 2), 'utf-8')
            console.log(`${newsData.length} tags to ${this.categories[0][i][1]}`)

            
        }
        console.log(`========================================================================`)
       
        for (var i = 0; i < this.categories[0].length; i++) {
            const file = `./public/posts/CATEGORIES/${this.categories[0][i][1]}.json`
            const category = require(file)
            for (var j = 0; j < category.length; j++){

                const url = `https://www.twitch.tv/directory/game/${category[j]}?sort=VIEWER_COUNT`;
                
                await page.goto(url, {
                    waitUntil:'networkidle0'
                });
                
                const newsData = await page.evaluate((category) => {
                    let result = [];
                    let blocks = document.querySelectorAll('article.Layout-sc-nxg1ff-0')
                
                    blocks.forEach(block => {
                        arTitle = block.querySelector('div div div div div a h3.CoreText-sc-cpl358-0').innerHTML
                        arLink = block.querySelector('div div div div div a.tw-link').href
                        arImg = block.querySelector('div div a div div img.tw-image').src
                        arAvatar = block.querySelector('div div div a div figure img.tw-image.tw-image-avatar').src
                        arLanguages = []

                        for (let i = 0; i < block.querySelector('article div div div').childNodes[2].childNodes[0].children.length; i++) {
                            arLanguages.push(block.querySelector('article div div div').childNodes[2].childNodes[0].childNodes[i].childNodes[0].childNodes[0].childNodes[0].childNodes[0].innerHTML)
                        }
                        

                        result.push({
                            category: category,
                            title: arTitle,
                            link: arLink,
                            thumbnail_img: arImg,
                            channel: arLink.replace("https://www.twitch.tv/", ''),
                            avatar: arAvatar,
                            languages: arLanguages
                        });
                    })
                    return result;
                },category[j]);

                const dir = `public/posts/TWITCH_API/${replaceNonAscii(category[j])}.json`

                fs.writeFileSync(dir, JSON.stringify(newsData ,null, 2), 'utf-8')
                console.log(`${newsData.length} articles to ${category[j]}`)
                

               
            }
        }

        await browser.close();
        console.log('DONE!!!');
    }
       
}

module.exports = scraperObject;






