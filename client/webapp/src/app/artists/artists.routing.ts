import { RouterModule, Routes } from "@angular/router";

import { ArtistsComponent } from "./artists.component";

const artistsRoutes : Routes = [
  { path : 'artist',
    children : [
      { path : ':id', component : ArtistsComponent, data : { animation : 'Artist' } }
    ]
  }
];

export const ArtistsRouting = RouterModule.forChild(artistsRoutes);
