import { Component, OnInit } from '@angular/core';

import { TracksService } from "./tracks.service";
import { ActivatedRoute } from "@angular/router";
import {DomSanitizer, Title} from "@angular/platform-browser";

@Component({
  selector : 'app-tracks',
  templateUrl : './tracks.component.html',
  styleUrls : ['./tracks.component.css']
})
export class TracksComponent implements OnInit {

  status = 'loading';
  track;

  constructor(
    private route : ActivatedRoute,
    private service : TracksService,
    private sanitizer : DomSanitizer,
    private titleService : Title
  ) { }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.service.getAlbum(params.id).subscribe(
        (response) => {
          this.track = response;

          if (this.track.video) {
            this.track.video = this.sanitizer.bypassSecurityTrustResourceUrl(
              'https://www.youtube.com/embed/' + this.track.video.substring(this.track.video.indexOf('=') + 1)
            );
          }

          this.status = 'loaded';
          this.titleService.setTitle(this.track.name);
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
