import { Component, OnInit } from '@angular/core';

import { AlbumsService } from "./albums.service";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector : 'app-albums',
  templateUrl : './albums.component.html',
  styleUrls : ['./albums.component.css']
})
export class AlbumsComponent implements OnInit {

  album;

  constructor(
    private route: ActivatedRoute,
    private service : AlbumsService
  ) { }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.service.getAlbum(params.id).subscribe((response) => {
        this.album = response;
      });
    });
  }

}
