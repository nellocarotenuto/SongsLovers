import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AlbumsComponent } from './albums.component';
import { AlbumsRouting } from "./albums.routing";

import {MatButtonModule, MatCardModule, MatDividerModule, MatIconModule, MatListModule} from "@angular/material";

@NgModule({
  imports: [
    CommonModule,
    AlbumsRouting,
    MatDividerModule,
    MatIconModule,
    MatCardModule,
    MatButtonModule,
    MatListModule
  ],
  declarations : [
    AlbumsComponent
  ],
  exports : [
    AlbumsComponent
  ]
})

export class AlbumsModule { }
