import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AlbumsModule } from "./albums/albums.module";
import { SearchModule } from './search/search.module';
import { TracksModule } from "./tracks/tracks.module";

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule, MatDividerModule, MatIconModule, MatListModule, MatSidenavModule } from "@angular/material";

@NgModule({
  declarations : [
    AppComponent,
  ],
  imports : [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    AlbumsModule,
    TracksModule,
    MatToolbarModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule,
    MatDividerModule,
    MatButtonModule,
    SearchModule,
    AppRoutingModule
  ],
  providers : [],
  bootstrap : [AppComponent]
})

export class AppModule { }
