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

  constructor(
    private searchService : SearchService,
    private titleService : Title
  ) { }

  ngOnInit() {
    this.titleService.setTitle('SongsLovers');
  }

  search() {
    if (this.query) {
      this.searchService.getResults(this.query).subscribe(
        (response) => {
          this.results = response['artists'];
        },
        (error) => {
        }
      );
    }
  }

}
