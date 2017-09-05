import {Component, OnInit} from '@angular/core';
import {BeerService} from '../shared/beer/beer.service';
import {GiphyService} from "../shared/giphy/giphy.service";

@Component({
  selector: 'app-beerlist',
  templateUrl: './beerlist.component.html',
  styleUrls: ['./beerlist.component.css'],
  providers: [BeerService]
})
export class BeerlistComponent implements OnInit {

  beers: Array<any>;

  constructor(private beerService: BeerService, private giphyService: GiphyService) {
  }

  ngOnInit() {
    this.beerService.getAll().subscribe(
      data => {
        this.beers = data;
        for (const beer of this.beers) {
          this.giphyService.get(beer.name).subscribe(url => beer.giphyUrl = url);
          //console.log(beer.giphyUrl);
        }
      },
      error => console.error(error)
    );
  }

}
