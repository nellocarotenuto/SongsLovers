// Module dependencies
const logger = require('../../config/logger');
const axios = require('axios');
const $ = require('cheerio');

const namesUtils = require('../../utils/names.utils');
const datesUtils = require('../../utils/dates.utils');


// Export module functions
module.exports.getArtistNews = getArtistNews;


//Query the Rolling Stone website with an artist name to get the latest news
async function getArtistNews(artistName) {

    if (!artistName) {
        throw 'Artist name must be defined';
    }

    // Define request headers
    const headers = {
        'Host' : 'www.rollingstone.it'
    };

    let slug = namesUtils.slugify(artistName);

    try {
        let response = await axios.get(`https://www.rollingstone.it/artista/${slug}`, {headers : headers});

        let html = response.data;

        let rows = $('li.l-river__item > article.c-card.c-card--domino > a.c-card__wrap', html);
        let news = [];

        rows.each((i, element) => {
            let title = $(element).find('header.c-card__header > h3.c-card__heading.t-bold').text().trim();
            let excerpt = $(element).find('header.c-card__header > p.c-card__lead').text().trim();
            let picture = $(element).find('figure.c-card__image img').attr('src');
            let link = $(element).attr('href');

            let tag = $(element).find('header.c-card__header > div.c-card__tag.t-bold--upper > span.c-card__featured-tag').text().trim();

            if (tag !== 'Foto') {
                news.push({
                    artist: artistName,
                    title: title,
                    excerpt: excerpt,
                    picture: picture,
                    link: link
                });
            }

            if (news.length > 4) {
                return false;
            }
        });

        // Get the publish date of the news
        for (let item of news) {
            response = await axios.get(item.link, {headers : headers});
            html = response.data;

            let element = $('main.l-blog__primary > article > header.l-article-header time.l-article-header__block', html);

            let data = $(element).text().trim();

            // Transform the returned string into the date format
            let indexStart = 0;
            let indexEnd = data.indexOf(' ', indexStart);
            let day = data.substring(indexStart, indexEnd);

            indexStart = indexEnd + 1;
            indexEnd = data.indexOf(' ', indexStart);
            let month = data.substring(indexStart, indexEnd);

            indexStart = indexEnd + 1;
            indexEnd = data.indexOf(' ', indexStart);
            let year = data.substring(indexStart, indexEnd);

            indexStart = indexEnd + 1;
            let time = data.substring(indexStart);

            month = datesUtils.months[month.substring(0, 3).toLowerCase()];

            let hours = parseInt(time.substring(0, 2)) - 2;
            let mins = time.substring(3);

            item.date = new Date(Date.UTC(year, month, day, hours, mins));
        }

        return news;
    } catch (err) {
        if (err.response.status === 404) {
            logger.silly(`No artist page found on RollingStone for ${artistName}`);
            return [];
        } else {
            logger.error(`Error occurred scraping RollingStone website - ${err}`);
        }
    }

}
