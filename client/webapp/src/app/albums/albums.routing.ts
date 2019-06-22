import { RouterModule, Routes } from "@angular/router";

import { AlbumsComponent } from "./albums.component";

const albumsRoutes : Routes = [
  { path : 'album',
    children : [
      { path : ':id', component : AlbumsComponent, data : { animation : 'Albums' } }
    ]
  }
];

export const AlbumsRouting = RouterModule.forChild(albumsRoutes);
