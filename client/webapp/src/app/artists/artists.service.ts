import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn : 'root'
})
export class ArtistsService {

  constructor(private http : HttpClient) { }

  getArtist(id : String) {
    return this.http.get(`/api/artist/${id}`);
  }

  getAlbums(id : String) {
    return this.http.get(`/api/artist/${id}/albums`);
  }

  getNews(id : String) {
    return this.http.get(`/api/artist/${id}/news`);
  }

  getConcerts(id : String) {
    return this.http.get(`/api/artist/${id}/concerts`);
  }
}
