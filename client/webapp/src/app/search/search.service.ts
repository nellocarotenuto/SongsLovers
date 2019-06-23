import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn : 'root'
})
export class SearchService {

  constructor(private http : HttpClient) { }

  getResults(query) {
    return this.http.get(`/api/search?s=${encodeURIComponent(query)}`);
  }

}
