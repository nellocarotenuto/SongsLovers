import { Component, OnInit } from "@angular/core";

import { ArtistsService } from "./artists.service";
import { ActivatedRoute } from "@angular/router";
import { Title } from "@angular/platform-browser";
import {forkJoin} from "rxjs";

@Component({
  selector: 'app-artists',
  templateUrl: './artists.component.html',
  styleUrls: ['./artists.component.css']
})
export class ArtistsComponent implements OnInit {

  status = {
    artist : 'loading',
    albums : 'loading',
    news : 'loading',
    concerts : 'loading'
  };

  artist;
  albums;
  news;
  concerts;

  constructor(
    private route: ActivatedRoute,
    private service : ArtistsService,
    private titleService : Title
  ) { }

  ngOnInit() {
    this.route.params.subscribe((params) => {

      forkJoin(this.service.getArtist(params.id),
               this.service.getAlbums(params.id),
               this.service.getNews(params.id),
               this.service.getConcerts(params.id))
        .subscribe((response) => {
          this.artist = response[0];

          if(this.artist.bio) {
            this.artist.bio = this.artist.bio.length > 280 ? this.artist.bio.substring(0, 280) + '...' : this.artist.bio;
          }

          this.status.artist = 'loaded';
          this.titleService.setTitle(this.artist.name);

          this.albums = response[1];
          this.status.albums = 'loaded';

          this.news = response[2];
          this.status.news = 'loaded';

          this.concerts = response[3];
          this.status.concerts = 'loaded';
        },
        (error) => {
          if (error.status === 404) {
            this.status.artist = 'not-found';
            this.titleService.setTitle('Non trovato');
          } else {
            this.status.artist = 'error';
            this.titleService.setTitle('Errore');
          }
        });
    });
  }

}
