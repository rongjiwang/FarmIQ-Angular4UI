import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {HttpModule} from '@angular/http';
import { BeerlistComponent } from './beerlist/beerlist.component';
import {GiphyService} from "./shared/giphy/giphy.service";
import { FarmlistComponent } from './farmlist/farmlist.component';
import { PolygonlistComponent } from './polygonlist/polygonlist.component';
import { GrassheatmapComponent } from './grassheatmap/grassheatmap.component';
import { SidebarComponent } from './UI/sidebar/sidebar.component';
import { HeaderComponent } from './UI/header/header.component';

@NgModule({
  declarations: [
    AppComponent,
    BeerlistComponent,
    FarmlistComponent,
    PolygonlistComponent,
    GrassheatmapComponent,
    SidebarComponent,
    HeaderComponent
  ],
  imports: [
    BrowserModule,
    HttpModule
  ],
  providers: [GiphyService],
  bootstrap: [AppComponent]
})
export class AppModule { }
