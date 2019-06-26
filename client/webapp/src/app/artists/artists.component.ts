import { Component, OnInit } from "@angular/core";

import { ArtistsService } from "./artists.service";
import { ActivatedRoute } from "@angular/router";
import { Title } from "@angular/platform-browser";
import { concat, forkJoin, Observable} from "rxjs";

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
      this.loadArtist(params.id).subscribe(
        () => {
          this.loadAlbums(params.id);
          this.loadNews(params.id);
          this.loadConcerts(params.id);
        }
      )
    });
  }

  private loadArtist(id) : Observable<Function> {
    return new Observable((observer) => {
      this.service.getArtist(id).subscribe(
        (response) => {
          this.artist = response;

          if (this.artist.bio) {
            this.artist.bio = this.artist.bio.length > 280 ? this.artist.bio.substring(0, 280) + '...' : this.artist.bio;
          }

          this.status.artist = 'loaded';
          this.titleService.setTitle(this.artist.name);
          observer.next();
        },
        (error) => {
          if (error.status === 404) {
            this.status.artist = 'not-found';
            this.titleService.setTitle('Non trovato');
          } else {
            this.status.artist = 'error';
            this.titleService.setTitle('Errore');
          }
          observer.error();
        });
    });
  }

  private loadAlbums(id) {
    this.service.getAlbums(id).subscribe(
      (response) => {
        this.albums = response;
        this.status.albums = 'loaded';
      }
    );
  }

  private loadNews(id) {
    this.service.getNews(id).subscribe(
      (response) => {
        this.news = response;
        this.status.news = 'loaded';
      }
    );
  }

  private loadConcerts(id) {
    this.service.getConcerts(id).subscribe(
      (response) => {
        this.concerts = response;
        this.status.concerts = 'loaded';
      }
    )
  }

}
