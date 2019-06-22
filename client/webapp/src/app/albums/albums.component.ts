import { Component, OnInit } from '@angular/core';

import { AlbumsService } from "./albums.service";
import { ActivatedRoute } from "@angular/router";
import { Title } from "@angular/platform-browser";

@Component({
  selector : 'app-albums',
  templateUrl : './albums.component.html',
  styleUrls : ['./albums.component.css']
})
export class AlbumsComponent implements OnInit {

  status = 'loading';
  album;

  constructor(
    private route : ActivatedRoute,
    private service : AlbumsService,
    private titleService : Title
  ) { }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.service.getAlbum(params.id).subscribe(
        (response) => {
          this.album = response;
          this.status = 'loaded';
          this.titleService.setTitle(this.album.name)
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
    });
  }

}
