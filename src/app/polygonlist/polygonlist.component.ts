import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ColorScale} from '../shared/colourScale/ColourScale';
import {DummyData} from './dummyData/dummyData';
import {MyService} from '../shared/appState/appState.service';
import {FarmService} from "../shared/farm/farm.service";

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

    for (let n = 1; n < polygons.length; n++) {
      let layer = new ol.layer.Vector({
        name: 'layer',
        source: new ol.source.Vector({}),
        style: ColorScale.getFarmStyle()
      });
      let obj = JSON.parse(polygons[n].geometry);
      let polygon = {"type": "Polygon", "coordinates": obj.coordinates[0]};

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
        center: [0, 0],
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
    this.map.setTarget(this.mapElement.nativeElement.id);

  }


  public drawShape(x, level) {

    let colour = this.colourScale.getPolygonStyle(level);
    //let colour = ColorScale.getFarmStyle();
    if (x != null) {

      let dummypolygon3 = x;

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

      this.map.addLayer(dummyLayer3);
    }

  }

  public sort() {

    this.turfList.sort(function (a, b) {
      return a.level - b.level;
    })


    for (var o = 0; o < this.turfList.length; o++) {
      this.drawShape(this.turfList[o].polygon, this.turfList[o].colour);
    }

  }


  public loadIntersects(list, colorLevel, level, polygonslice, index) {
    if (list.length < 2) {
      return;
    }
    while (list.length > 1) {
      let objectA = list.pop();

      let polygonACoordinates;
      if (JSON.parse(objectA.geometry).type === "MultiPolygon") {
        polygonACoordinates = JSON.parse(objectA.geometry).coordinates[0];
      }
      else {
        polygonACoordinates = JSON.parse(objectA.geometry).coordinates;
      }


      let ColourValueA = JSON.parse(objectA.NitrogenValue);

      let polygonA = {"type": "Polygon", "coordinates": polygonACoordinates};

      if (polygonslice != null && list.length != 0) {
        if (turf.intersect(polygonslice, polygonA) != null) {

          let colourValueB = ColourValueA + level;
          let x = turf.intersect(polygonslice, polygonA).geometry;
        }
      }
      for (let i = index; i < list.length; i++) {

        let polygonBCoordinates;

        if (JSON.parse(list[0].geometry).type === "MultiPolygon") {
          polygonBCoordinates = JSON.parse(list[i].geometry).coordinates[0];
        }
        else {
          polygonBCoordinates = JSON.parse(list[i].geometry).coordinates;
        }

        let polygonB = {"type": "Polygon", "coordinates": polygonBCoordinates};

        if (polygonslice == null) {
          var aaa = turf.intersect(polygonA, polygonB);


          if (turf.intersect(polygonA, polygonB) != null) {

            let colourValueB = list[i].NitrogenValue + ColourValueA;

            let leveler = level + 1;
            let x = turf.intersect(polygonA, polygonB).geometry;


            this.turfList.push({"polygon": x, "colour": colourValueB, "level": level});

            let clone = JSON.parse(JSON.stringify(list));

            this.loadIntersects(clone, colourValueB, leveler, x, i);
          }
        }
        else {

          if (turf.intersect(polygonslice, polygonA) != null) {
            // intersection found, so we draw it and then call function again
            let colourValueB = ColourValueA + colorLevel;
            let leveler = level + 1;
            //this line removes the first element from the list for efficiency, e.g. if A and B do not intersect but A intersects with C, then we remove A from                   list since we already know that it intersects with C, in the next recursve iteration only B and C should be checked

            let x = turf.intersect(polygonslice, polygonA).geometry;
            this.turfList.push({"polygon": x, "colour": colourValueB, "level": level});
            let clone = JSON.parse(JSON.stringify(list));
            this.loadIntersects(clone, colourValueB, leveler, x, i);
          }
        }
      }
    }
    ;
  };

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

      let dummyPolygons, farmCoordinates, dummyLayers, dummyFarm;

      this.colourScale = new ColorScale();

      // initialise openlayer dependant fields
      this.initialiseOpenLayers();

      /*
       dummyPolygons = DummyData.getDummyPolygons();
       */
      dummyPolygons = data;
      farmCoordinates = DummyData.getDummyFarm();

      dummyLayers = this.getAsLayers(dummyPolygons);
      dummyFarm = this.getAsFarm(farmCoordinates);

      this.loadMap(dummyLayers, dummyFarm);
      this.loadIntersects(dummyPolygons, 0, 0, null, 0);

      this.sort();
      this.ngAfterView();

    }).catch(error => {
      console.log('ERROR:' + error);
    });


  }

}
