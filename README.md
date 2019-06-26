# SongsLovers
SongsLovers is a simple webapp meant to make it easier for the fans to follow their favourite singers and bands. It has
been built in the context of Web Data Integration course at the University of Salerno.

# Features
The application serves a few infos about the artists to the user:
- Small biography and link to Wikipedia page
- Links to profiles on Facebook, Twitter and Instagram
- Full discography
- Track lyrics, music videos and link to Spotify
- Latest news
- Concerts and ticketing info

# Architecture
SongsLovers acts as a mediator, gathering all the needed info from the sources just by taking as input a name
(or partial name) of the artist. The app is provided with wrappers for each website chosen as source and
automatically fetches their relevant data to merge it in a single schema acting like a cache.

# Sources
The sources chosen are mostly country-bounded as the app (and its content) is meant for Italian users:

- [Genius](http://genius.com) (Artists' social info and tracks' lyrics)
- [Livenation](http://livenation.it) (Concerts info)
- [Rockol](http://rockol.it) (News)
- [RollingStone](http://rollingstone.it) (News)
- [SoundsBlog](http://soundsblog.it) (News)
- [Spotify](http://spotify.com) (Artists, albums and tracks info)
- [TicketMaster](http://ticketmaster.it) (Ticketing info)
- [TicketOne](http://ticketone.it) (Ticketing info)
- [VivoConcerti](http://vivoconcerti.com) (Concerts info)
- [Wikipedia](http://it.wikipedia.org) (Artists info)

It's important to note that the app is not intended to go online and has been built only for research purposes as no
permission has been asked to data owners.

# Implementation
The app is built in a MEAN-fashion with the server based on Node.js and Express and communicating to a MongoDB schema
while the client is a very simple Angular consumer for the RESTful API exposed by the server.

A few modules are used mainly on server side and most notably axios and cheerio are all it's needed for the scraping and
API consuming process involved to fetch data from the sources.

# Credits
SongsLovers has been developed by [Nello Carotenuto](http://github.com/nellocarotenuto) and
[Gianluca Caggiano](http://github.com/caggian).
