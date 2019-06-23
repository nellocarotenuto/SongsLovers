import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn : 'root'
})
export class ArtistsService {

  constructor(private http : HttpClient) { }

  getArtist(id : String) {
    return this.http.get(`http://localhost:3000/api/artist/${id}`);
  }

  getAlbums(id : String) {
    return this.http.get(`http://localhost:3000/api/artist/${id}/albums`);
  }

  getNews(id : String) {
    return this.http.get(`http://localhost:3000/api/artist/${id}/news`);
  }

  getConcerts(id : String) {
    return this.http.get(`http://localhost:3000/api/artist/${id}/concerts`);
  }
}
