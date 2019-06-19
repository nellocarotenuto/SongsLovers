// Module dependencies
const logger = require('../../config/logger');
const axios = require('axios');
const $ = require('cheerio');

const namesUtils = require('../../utils/names.utils');


// Export module functions
module.exports.getArtistNews = getArtistNews;


// Define request headers
const headers = {
    'Host' : 'www.rockol.it'
};


//Query the Rockol home page to avoid advertising redirects
async function getHomePage() {

    try{
        await axios.get('https://www.rockol.it/', {headers : headers});
    } catch (err) {
        logger.error(`Error occurred query rockol home page: ${err}`);
    }
}


// Query the Rockol website with the name of the artist to search the profile page
async function searchArtist(artistName) {

    await getHomePage();

    // Define query parameters
    let data = {
        'artista' : artistName,
    };

    try{
        let response = await axios.get(`https://www.rockol.it/artista/ricerca`, {headers : headers, params : data});
        let html = response.data;

        let rows = $('div.content-container > div > div.row.mod-md-gutter > div.col-xs-6 > figure.u-overlay-container > figcaption.u-overlay-text > a[href*="/artista/"]', html);
        let urls = [];

        rows.each((i, element) => {
            let artist = $(element).find('h2.mod-md-title.mod-strong-weight').text();
            urls.push({
                href : $(element).attr('href'),
                name : artist
            });
        });

        let artist = urls.find(element => namesUtils.normalize(element.name) === namesUtils.normalize(artistName));

        return artist ? artist.href : undefined;
    } catch (err) {
        logger.error(`Error occurred querying Rockol search page - ${err}`);
    }
}


//Query the Rockol website with an artist name to get the latest news
async function getArtistNews(artistName) {

    if (!artistName) {
        throw 'Artist name must be defined';
    }

    let artistPage = await searchArtist(artistName);

    if(!artistPage) {
        logger.silly(`No artist page found on Rockol for ${artistName}`);
        return undefined;
    }

    try {
        let response = await axios.get(`https://www.rockol.it${artistPage}/news`);
        let html = response.data;

        let rows = $('div.article-body > div.rockol-artist-detail-block.scroll-body.more-content > section.rullo > article.row.mod-sm-gutter', html);
        let news = [];

        rows.each((i, element) => {
            let title = $(element).find('div.col-sm-8 > h3.mod-md-title.font-roboto-regular.font-bold > a').text().trim();
            let excerpt = $(element).find('div.col-sm-8 > div.mod-subtitle.excerpt').text().trim().replace('\n', '');
            let date = $(element).find('div.col-sm-8 > div.rockol-social-list-comp > div.row > div.col-xs-6.rockol-social-list-comp-date > span').attr('content').trim();
            let picture = $(element).find('div.col-sm-4 > a > img.news-main.img-responsive').attr('src');
            let link = $(element).find('div.col-sm-8 > span').attr('content');

            date = date.replace(' ', 'T');
            date = date.substring(0, 22) + ':00';

            news.push({
                artist : artistName,
                title : title,
                excerpt : excerpt,
                date : new Date(date),
                picture : picture,
                link : link
            })
        });

        return news;
    } catch (err) {
        logger.error(`Error occurred scraping Rockol website - ${err}`);
    }


}