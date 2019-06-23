import { Component, OnInit } from '@angular/core';
import {SearchService} from "./search.service";
import {Title} from "@angular/platform-browser";

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  query;
  results;
  status;

  constructor(
    private searchService : SearchService,
    private titleService : Title
  ) { }

  ngOnInit() {
    this.titleService.setTitle('SongsLovers');
  }

  search() {
    this.results = undefined;

    if (this.query) {
      this.status = 'searching';

      this.searchService.getResults(this.query).subscribe(
        (response) => {
          this.results = response['artists'];
          this.status = 'done';
        },
        (error) => {
        }
      );
    }
  }

}
