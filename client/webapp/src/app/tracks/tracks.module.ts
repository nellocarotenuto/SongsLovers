import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TracksComponent } from './tracks.component';
import { TracksRouting } from "./tracks.routing";
import {MatDividerModule, MatIconModule, MatProgressSpinnerModule} from "@angular/material";

@NgModule({
  imports: [
    CommonModule,
    TracksRouting,
    MatIconModule,
    MatDividerModule,
    MatProgressSpinnerModule
  ],
  declarations : [
    TracksComponent
  ],
  exports : [
    TracksComponent
  ]
})
export class TracksModule { }
