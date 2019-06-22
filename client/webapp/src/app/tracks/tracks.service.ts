import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class TracksService {

  constructor(private http : HttpClient) { }

  getAlbum(id : String) {
    return this.http.get(`http://localhost:3000/api/track/${id}`);
  }

}
