import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Subject} from 'rxjs/Subject';
import {ColorScale} from "../colourScale/ColourScale";


@Injectable()
export class MyService {
  myColorScale1$: Observable<ColorScale>;
  private colorScaleSubject: Subject<ColorScale>;
  public colorScale: ColorScale;


  constructor() {
    this.colorScaleSubject = new Subject<ColorScale>();
    this.myColorScale1$ = this.colorScaleSubject.asObservable();

  }


  getColourScale() {
    return this.colorScale;
  }

  setColourScale(colourScale: ColorScale) {
    this.colorScale = colourScale;
  }


}
