import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn : 'root'
})
export class AlbumsService {

  constructor(private http : HttpClient) { }

  getAlbum(id : String) {
    return this.http.get(`/api/album/${id}`);
  }

}
