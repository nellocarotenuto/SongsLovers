import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AlbumsModule } from "./albums/albums.module";

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule, MatDividerModule, MatIconModule, MatListModule, MatSidenavModule } from "@angular/material";

@NgModule({
  declarations : [
    AppComponent,
  ],
  imports : [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AlbumsModule,
    MatToolbarModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule,
    MatDividerModule,
    MatButtonModule
  ],
  providers : [],
  bootstrap : [AppComponent]
})

export class AppModule { }
