import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SearchComponent } from './search.component';
import { SearchRouting } from "./search.routing";
import {MatButtonModule, MatFormFieldModule, MatIconModule, MatInputModule, MatListModule} from "@angular/material";
import { FormsModule } from "@angular/forms";

@NgModule({
  declarations : [SearchComponent],
  imports: [
    CommonModule,
    SearchRouting,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
    FormsModule,
    MatListModule
  ]
})
export class SearchModule { }
