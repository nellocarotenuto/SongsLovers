// Module dependencies
const logger = require('../../config/logger');
const axios = require('axios/index');
const $ = require('cheerio');

const namesUtils = require('../../utils/names.utils');


// Export module functions
module.exports.getArtistNews = getArtistNews;


// Query the Soundsblog website with an artist name to get the latest 5 news
async function getArtistNews(artistName) {

    if (!artistName) {
        throw 'Artist name must be defined';
    }

    let newsNotNormalized = await searchNews(artistName);

    if (artistName.toLowerCase().trim() === namesUtils.normalize(artistName)) {
        return newsNotNormalized;
    } else {
        let newsNormalized = await searchNews(namesUtils.normalize(artistName));

        for (let news of newsNormalized) {
            news.artist = artistName;
        }

        let news = newsNormalized.concat(newsNotNormalized).sort((news1, news2) => {
            return news2.date - news1.date;
        });

        return news.slice(0, 5);
    }

}


async function searchNews(artistName) {

    // Define request headers
    const headers = {
        'Host' : 'www.soundsblog.it'
    };

    try {
        let response = await  axios.get(`https://www.soundsblog.it/cerca/${encodeURIComponent(artistName)}`, {headers : headers});
        let html = response.data;

        let rows = $('div.list-post > div.item-list-post', html);
        let news = [];

        rows.each((i,element) => {
            let picture = $(element).find('div.thumb > a.lazy-container > img.lazy').attr('data-original');
            let link = $(element).find('h2 > a').attr('href');
            let date = $(element).find('div.post-info > span:last-child').text().trim();
            let title = $(element).find('h2 > a').text().trim();
            let excerpt = $(element).find('p').text().trim();
            excerpt = excerpt.substring(0, excerpt.length - 11).trim();

            // Transform the returned string into the date format
            let day = parseInt(date.substring(0,2));
            let month = parseInt(date.substring(3,5)) - 1;
            let year = 2000 + parseInt(date.substring(6));

            date = new Date(Date.UTC(year, month, day,  - 2, 0));

            news.push({
                artist : artistName,
                title : title,
                excerpt : excerpt,
                date : date,
                picture : picture.substring(picture.lastIndexOf('https://')),
                link : link
            });

            if (news.length > 4) {
                return false;
            }
        });

        return news;
    } catch (err) {
        logger.error(`Error occurred scraping SoundsBlog website - ${err}`);
    }
}