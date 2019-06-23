import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ArtistsComponent } from './artists.component';
import { ArtistsRouting } from "./artists.routing";

import {
  MatButtonModule,
  MatCardModule,
  MatDividerModule,
  MatIconModule,
  MatListModule,
  MatProgressSpinnerModule,
  MatTabsModule
} from "@angular/material";


@NgModule({
  imports: [
    CommonModule,
    ArtistsRouting,
    MatDividerModule,
    MatIconModule,
    MatCardModule,
    MatButtonModule,
    MatListModule,
    MatProgressSpinnerModule,
    MatTabsModule
  ],
  declarations: [
    ArtistsComponent
  ],
  exports: [
    ArtistsComponent
  ]
})
export class ArtistsModule { }
