import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ColorScale} from '../shared/colourScale/ColourScale';
import {DummyData} from './dummyData/dummyData';
import {MyService} from '../shared/appState/appState.service';
import {FarmService} from "../shared/farm/farm.service";
import {reject} from "q";

// This is necessary to access ol3!
declare var ol: any;
declare var turf: any;

@Component({
  selector: 'app-polygonlist',
  templateUrl: './polygonlist.component.html',
  styleUrls: ['./polygonlist.component.css'],
  providers: [FarmService]
  /*
   template: '<div #mapElement id="map" class="map"></div>'
   */
})

/*
 AfterViewInit,
 */
export class PolygonlistComponent implements OnInit {

  // This is necessary to access the html element to set the map target (after view init)!
  @ViewChild('mapElement') mapElement: ElementRef;

  // openlayer dependant fields
  public mapProjection: any;
  public projection: any;
  public matrixIds: Array<String>;
  public resolutions: any;
  public map: any;
  public turfList: any;
  public colourScale: ColorScale;
  public appState: MyService;

  farms: Array<any>;

  constructor(/*private appState: MyService*/private farmService: FarmService) {
  }


  public initialiseOpenLayers() {
    this.mapProjection = ol.proj.get('EPSG:900913');
    this.projection = ol.proj.get('EPSG:3857');
    this.matrixIds = new Array(19);
    for (let i = 0; i < 20; ++i) {
      this.matrixIds [i] = "EPSG:3857_FarmIQTIL:" + i;
    }
    this.resolutions = [156543.03392800014, 78271.516963999937, 39135.758482000092, 19567.879240999919,
      9783.9396204999593, 4891.9698102499797, 2445.9849051249898, 1222.9924525624949, 611.49622628137968,
      305.74811314055756, 152.87405657041106, 76.437028285073239, 38.21851414253662, 19.10925707126831,
      9.5546285356341549, 4.7773142679493699, 2.3886571339746849, 1.1943285668550503, 0.59716428355981721];
    this.turfList = [];
  }


  /*
   Returns a list of polygons as ol.collection
   */
  public getAsLayers(polygons) {
    let layerList = [];
    let imageLayer = new ol.layer.Tile({
      opacity: 1,
      source: new ol.source.WMTS({
        url: 'http://202.9.88.95/geowebcache/service/wmts',
        layer: 'FarmIQTIL',
        matrixSet: 'EPSG:3857_FarmIQTIL',
        format: 'image/jpeg',
        projection: this.projection,
        tileGrid: new ol.tilegrid.WMTS({
          origin: ol.extent.getTopLeft(this.projection.getExtent()),
          resolutions: this.resolutions,
          matrixIds: this.matrixIds
        }),
        style: 'default',
        wrapX: true
      })
    });
    let imageLayer2 = new ol.layer.Tile({source: new ol.source.OSM()});
    layerList.push(imageLayer2);

    for (let n = 0; n < polygons.length; n++) {
      let layer = new ol.layer.Vector({
        name: 'layer',
        source: new ol.source.Vector({}),
        style: ColorScale.getFarmStyle()
      });
      let obj = JSON.parse(polygons[n].geometry);
      let polygon = {"type": "Polygon", "coordinates": obj.coordinates[0]};
      //console.log("polygon:");
      //console.log(polygon);

      let geometry = new ol.format.GeoJSON().readGeometry(polygon, {'featureProjection': this.mapProjection});
      let feature = new ol.Feature({'geometry': geometry});
      layer.getSource().addFeature(feature);

      layerList.push(layer);
    }

    return layerList;

  }

  /*
   Returns a farm obj
   Layer - farm layer
   Feature - farm feature
   */
  public getAsFarm(farmCoordinates) {
    let farmLayer = new ol.layer.Vector({
      'name': 'farmLayer',
      'source': new ol.source.Vector({}),
      'style': ColorScale.getFarmStyle()
    });
    let geometry = new ol.format.GeoJSON().readGeometry(farmCoordinates, {'featureProjection': this.mapProjection});
    let farmFeature = new ol.Feature({'geometry': geometry})
    farmLayer.getSource().addFeature(farmFeature);
    return {
      layer: farmLayer,
      feature: farmFeature
    };
  }


  public loadMap(polygonLayers, farm) {

    this.map = new ol.Map({
      projection: this.mapProjection,
      displayProjection: this.mapProjection,
      units: "meters",
      layers: polygonLayers,
      target: 'part1',
      controls: ol.control.defaults({
        attributionOptions: ({
          collapsible: false
        })
      }),
      view: new ol.View({
        center: [0,0],
        zoom: 2
      })
    });
  }


  public getCenterOfExtent(extent) {
    let x = extent[2] + (extent[3] - extent[2]) / 2;
    let y = extent[2] + (extent[3] - extent[2]) / 2;
    return [x, y];
  }


// After view init the map target can be set!
  public ngAfterView() {
    console.log('7');
    this.map.setTarget(this.mapElement.nativeElement.id);
    console.log('8');

  }

  public loadIntersects(list, level, polygonslice) {
    if (list.length < 2) {
      return;
    }
    while (list.length > 0) {
      let objectA = list.pop();
      let polygonACoordinates = JSON.parse(objectA.geometry);
      let ColourValueA = JSON.parse(objectA.NitrogenValue);

      let polygonA = {"type": "Polygon", "coordinates": polygonACoordinates.coordinates[0]};
      if (polygonslice != null && list.length != 0) {
        if (turf.intersect(polygonslice, polygonA) != null) {
          let colourValueB = ColourValueA + level;
          let x = turf.intersect(polygonslice, polygonA).geometry;
        }
      }
      for (let i = 0; i < list.length; i++) {
        //console.log(list[i]);
        let objB = JSON.parse(list[i].geometry);
        let polygonB = {"type": "Polygon", "coordinates": objB.coordinates[0]};
        if (polygonslice == null) {
          if (turf.intersect(polygonA, polygonB) != null) {
            let colourValueB = list[i].averageFertiliser + ColourValueA;
            let x = turf.intersect(polygonA, polygonB).geometry;
            let area = turf.area(x);
            this.turfList.push({"polygon": x, "colour": colourValueB, "level": level});
            //console.log("length of list is" + list.length);
            let clone = JSON.parse(JSON.stringify(list));
            this.loadIntersects(clone, colourValueB, x);
            //console.log("length of list after recursion is" + list.length);
          }
        }
        else {
          if (turf.intersect(polygonslice, polygonA) != null) {
            // intersection found, so we draw it and then call function again
            let colourValueB = ColourValueA + level;
            //this line removes the first element from the list for efficiency, e.g. if A and B do not intersect but A intersects with C, then we remove A from                   list since we already know that it intersects with C, in the next recursve iteration only B and C should be checked
            // console.log("intersect has intersect with other item in list");
            let x = turf.intersect(polygonslice, polygonA).geometry;
            this.turfList.push({"polygon": x, "colour": colourValueB, "level": level});
            let clone = JSON.parse(JSON.stringify(list));
            this.loadIntersects(clone, colourValueB, x);
          }
        }
      }
    }
    ;
  };

  public drawShape(x, level) {

    let colour = this.colourScale.getPolygonStyle(level);
    //let colour = ColorScale.getFarmStyle();
    if (x != null) {

      //console.log("drawing shape at level" + level);
      let dummypolygon3 = x;
      //console.log(dummypolygon3);

      let dummyGeometry3 = new ol.format.GeoJSON().readGeometry(dummypolygon3, {'featureProjection': this.mapProjection});
      let dummyFeature3 = new ol.Feature({
        'geometry': dummyGeometry3
      })
      let dummyLayer3 = new ol.layer.Vector({
        'name': 'dummyLayer3',
        'source': new ol.source.Vector({}),
        'style': function (feature, resolution) {
          return colour
        }
      })
      dummyLayer3.getSource().addFeature(dummyFeature3);
      //console.log(dummyLayer3);

      this.map.addLayer(dummyLayer3);
    }

  }

  public sort() {
    //console.log("before");
    //console.log(this.turfList);
    this.turfList.sort(function (a, b) {
      return a.level - b.level;
    })

    //console.log("after");
    //console.log(this.turfList);

    for (var o = 0; o < this.turfList.length; o++) {
      // console.log("haps");
      this.drawShape(this.turfList[o].polygon, this.turfList[o].colour);
    }

  }


  public farmData() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        this.farmService.getAll().subscribe(
          data => {
            this.farms = data;
            resolve(data);
          }
        )
      }, 0);
    })
  }

  ngOnInit() {
    //this.colourScale = new ColorScale();
    //this.appState.setColourScale(this.colourScale);

    this.farmData().then(data => {
      console.log(data);
      console.log('1');
      let dummyPolygons, farmCoordinates, dummyLayers, dummyFarm;

      this.colourScale = new ColorScale();

      // initialise openlayer dependant fields
      this.initialiseOpenLayers();
      console.log('2');

      /*
       dummyPolygons = DummyData.getDummyPolygons();
       */
      dummyPolygons = data;
      farmCoordinates = DummyData.getDummyFarm();
      console.log('3');

      dummyLayers = this.getAsLayers(dummyPolygons);
      dummyFarm = this.getAsFarm(farmCoordinates);

      this.loadMap(dummyLayers, dummyFarm);
      console.log('4');
      console.log(dummyPolygons);
      //this.loadIntersects(dummyPolygons, 10, null);
      console.log('10')
      this.sort();
      console.log('5');
      this.ngAfterView();
      console.log('9');

      //return data;
    }).catch(error => {
      console.log('ERROR:' + error);
    });


  }

}
