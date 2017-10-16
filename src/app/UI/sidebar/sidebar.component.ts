import {Component, OnInit} from '@angular/core';
import {MyService} from "../../shared/appState/appState.service";
import {ColorScale} from "../../shared/colourScale/ColourScale";

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  providers: [MyService]
})
export class SidebarComponent implements OnInit {

  constructor(private appState: MyService) {
    appState.myColorScale1$.subscribe((newColorScale: ColorScale) => {
      console.log("got here");
      this.setScale(newColorScale.getScale());
    });

  }

  public setScale(scale) {
    document.getElementById('colourCell1').style['background-color'] = scale[0];
    document.getElementById('colourCell2').style['background-color'] = scale[1];
    document.getElementById('colourCell3').style['background-color'] = scale[2];
    document.getElementById('colourCell4').style['background-color'] = scale[3];
    document.getElementById('colourCell5').style['background-color'] = scale[4];


  }

  ngOnInit() {
    let scale = this.appState.getColourScale();
    if (typeof scale === 'undefined') {

    } else {
      let colorScale = scale.getScale();
      this.setScale(colorScale);

    }
  }

}
