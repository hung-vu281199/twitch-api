// //const { languages } = require("./pageScraper")

// wUrls = ['wVn', 'wEn', 'wKo', 'wTh', 'wCh', 'wHi']
// sUrls = ['sVn', 'sEn', 'sKo', 'sTh', 'sCh', 'sHi']
// eUrls = ['eVn', 'eEn', 'eKo', 'eTh', 'eCh', 'eHi']

// categories = ["world", "enter", "sport"]


// for (let i = 0; i < categories.length; i++){
//     if(i === 0){
//         var url = wUrls
//     }else if(i == 2){
//         var url = sUrls
//     }else{
//         var url = eUrls
//     }

//     for( let j = 0; j < url; j++){
//         console.log(categories[i]+ ' - ' + url[j])
//     }

// }
var request = require('request');
var fs = require('fs')
var options = {
  'method': 'GET',

  'url': 'https://newsapi.org/v2/everything?q=apple&'
  +'from=2022-03-06&to=2022-03-06&language=en&'
  +'sortBy=popularity&' 
  +'apiKey=77c77ab23e3f492f900edd43e6690f83',

  'headers': {
  }
};
request(options, function (error, response) {
  if (error) throw new Error(error);
  var result = JSON.parse(response.body)
  //console.log(result);
  //console.log(JSON.stringify(result,null, 2));
 fs.writeFileSync('test33134334.json', JSON.stringify(result,null, 2), null, 2, 'utf-8');
});


