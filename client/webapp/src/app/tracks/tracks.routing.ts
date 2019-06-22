import { RouterModule, Routes } from "@angular/router";

import { TracksComponent } from "./tracks.component";

const tracksRoutes : Routes = [
  { path : 'track',
    children : [
      { path : ':id', component : TracksComponent, data : { animation : 'Tracks' } }
    ]
  }
];

export const TracksRouting = RouterModule.forChild(tracksRoutes);
