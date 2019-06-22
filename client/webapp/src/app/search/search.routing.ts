import { RouterModule, Routes } from "@angular/router";

import { SearchComponent } from "./search.component";

const searchRoutes : Routes = [
  { path : '', component : SearchComponent, data : { animation : 'Tracks' } }
];

export const SearchRouting = RouterModule.forChild(searchRoutes);
