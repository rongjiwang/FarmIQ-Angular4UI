import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {HttpModule} from '@angular/http';
import { BeerlistComponent } from './beerlist/beerlist.component';
import {GiphyService} from "./shared/giphy/giphy.service";

@NgModule({
  declarations: [
    AppComponent,
    BeerlistComponent
  ],
  imports: [
    BrowserModule,
    HttpModule
  ],
  providers: [GiphyService],
  bootstrap: [AppComponent]
})
export class AppModule { }
