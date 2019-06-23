import { Component, OnInit } from "@angular/core";

import { ArtistsService } from "./artists.service";
import { ActivatedRoute } from "@angular/router";
import { Title } from "@angular/platform-browser";

@Component({
  selector: 'app-artists',
  templateUrl: './artists.component.html',
  styleUrls: ['./artists.component.css']
})
export class ArtistsComponent implements OnInit {

  status = 'loading';
  statusAlbums = 'loading';
  statusNews = 'loading';
  statusConcerts = 'loading';
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
      this.service.getArtist(params.id).subscribe((response) => {
        this.artist = response;
        this.status = 'loaded';
        this.titleService.setTitle(this.artist.name)
      },
        (error) => {
          if (error.status === 404) {
            this.status = 'not-found';
            this.titleService.setTitle('Non trovato');
          } else {
            this.status = 'error';
            this.titleService.setTitle('Errore');
          }
      });
      this.service.getAlbums(params.id).subscribe((response) => {
        this.albums = response;
        this.statusAlbums = 'loaded';
      },
        (error) => {
          if (error.status === 404) {
            this.statusAlbums = 'not-found';
            this.titleService.setTitle('Non trovato');
          } else {
            this.statusAlbums = 'error';
            this.titleService.setTitle('Errore');
          }
      });
      this.service.getNews(params.id).subscribe((response) => {
          this.news = response;
          this.statusNews = 'loaded';
        },
        (error) => {
          if (error.status === 404) {
            this.statusNews = 'not-found';
            this.titleService.setTitle('Non trovato');
          } else {
            this.statusNews = 'error';
            this.titleService.setTitle('Errore');
          }
      });
      this.service.getConcerts(params.id).subscribe((response) => {
          this.concerts = response;
          this.statusConcerts = 'loaded';
        },
        (error) => {
          if (error.status === 404) {
            this.statusConcerts = 'not-found';
            this.titleService.setTitle('Non trovato');
          } else {
            this.statusConcerts = 'error';
            this.titleService.setTitle('Errore');
          }
        });
    });
  }

}
