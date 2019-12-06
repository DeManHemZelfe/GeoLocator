import { Component, ViewChild, ElementRef, AfterViewInit, OnInit} from '@angular/core';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';

import { FormControl } from '@angular/forms';
import OlDraw from 'ol/interaction/Draw';

import {Vector as VectorSource} from 'ol/source';
import {Stroke, Style, Fill, Circle} from 'ol/style';



@Component({
  selector: 'app-undo.redo',
  templateUrl: './undo.redo.html',
})

export class UndoRedoComponent implements OnInit {

constructor() { }

ngOnInit() { }
// BEGIN UNDO ACTION

// undo() {
//   const features = this.source.getFeatures();
//   const lastFeature = features[features.length - 1];
//   this.source.removeFeature(lastFeature);
//   console.log(this.tekenfunctie.getSource());
//   console.log(this.tekenfunctie.getSource());
//   console.log(this.tekenfunctie.getSource().getFeatures().values());
//   console.log('je hebt op de knop geklikt');
//   console.log('maak een unieke id aan of probeer met de value iets aan te geven, of zet alles in een array');
// }

// BEGIN REDO ACTION
// redo() {
//   const features = this.source.getFeatures();
//   const lastFeature = features[features.length + 1];
//   this.source.addFeature(lastFeature);
//   console.log(this.tekenfunctie.getSource());
//   console.log(this.tekenfunctie.getSource());
//   console.log(this.tekenfunctie.getSource().getFeatures().values());
//   console.log('je hebt op de knop geklikt');
//   console.log('maak een unieke id aan of probeer met de value iets aan te geven, of zet alles in een array');
// }

}
