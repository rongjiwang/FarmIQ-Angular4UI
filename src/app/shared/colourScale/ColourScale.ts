import {Component} from "@angular/core";


declare let ol: any;
declare let d3: any;

@Component({
  selector: 'colour-scale',
})
export class ColorScale {

  public colour: any;
  public range: number;

  public constructor() {
    this.range = 100;
    console.log(d3);
    this.colour = d3.scale.linear().domain([0, this.range]).range([d3.rgb('#98fb98'), d3.rgb('#006400')]);
  }

  public changeScale(range: number, colourAHex: String, colourBHex: String) {
    this.range = range;
    this.colour = d3.scale.linear().domain([0, this.range]).range([d3.rgb(colourAHex), d3.rgb(colourBHex)]);
  }

  public getScale() {
    let colourValue = this.range / 5;
    return [this.colour(colourValue),
      this.colour(colourValue * 2),
      this.colour(colourValue * 3),
      this.colour(colourValue * 4),
      this.colour(colourValue * 5)];

  }


  public getPolygonStyle(level: number) {
    this.colour = d3.scale.linear().domain([0, 100]).range([d3.rgb("#98fb98"), d3.rgb("#006400")]);
    return [new ol.style.Style({
      stroke: new ol.style.Stroke({
        color: 'black',
        lineDash: [4],
        width: 3
      }),
      fill: new ol.style.Fill({
        color: this.colour(level)
      })
    })]
  }

  static getFarmStyle() {
    return [new ol.style.Style({
      stroke: new ol.style.Stroke({
        color: 'blue',
        lineDash: [4],
        width: 3
      }),
      fill: new ol.style.Fill({
        color: 'rgba(255,0,0, 0.0)'
      })
    })]
  }
}
