import {Component, OnInit} from '@angular/core';
import {FarmService} from "../shared/farm/farm.service";

@Component({
  selector: 'app-farmlist',
  templateUrl: './farmlist.component.html',
  styleUrls: ['./farmlist.component.css'],
  providers: [FarmService]
})
export class FarmlistComponent implements OnInit {
  farms: Array<any>;

  constructor(private farmService: FarmService) {
  }

  ngOnInit() {
    this.farmService.getAll().subscribe(
      data => {
        this.farms = data;
        console.log(data);
      }
    )
  }

}
