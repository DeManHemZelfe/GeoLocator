import { Component, OnInit } from '@angular/core';
import { BestuurlijkegrenzenService } from '../../../layers/bestuurlijkegrenzen.service';
import { BagService } from '../../../layers/bag.service';
import { SpoorwegenService, ITileOptions } from '../../../layers/spoorwegen.service';
import { OverigeDienstenService } from '../../../layers/overigediensten.service';
import LayerGroup from 'ol/layer/Group';
import { GeocoderService } from 'angular-geocoder';
import { ServiceService } from 'src/app/pdokmap/pdokmapconfigmap/service.service';
import { BgService } from 'src/app/pdokmap/layer/bg.service';

@Component({
  selector: 'app-layerbutton',
  templateUrl: './layerbutton.component.html',
  styleUrls: ['./layerbutton.component.css']
})
export class LayerbuttonComponent implements OnInit {
  layergroupkaart = new LayerGroup ({
    layers: [
      this.achterkaart.baseLayer,
      this.achterkaart.brtWaterLayer,
      this.achterkaart.brtGrijsLayer,
    ]
  });
layergroupgrenzen = new LayerGroup ({
    layers: [
      this.bestuurlijkegrenzenservice.landsgrensLayer,
      this.bestuurlijkegrenzenservice.gemeentenLayer,
      this.bestuurlijkegrenzenservice.provinciesLayer,
    ]
  });
layergroupspoorwegen = new LayerGroup ({
    layers: [
      this.spoorwegService.KruisingLayer,
      this.spoorwegService.OverwegLayer,
      this.spoorwegService.SpoorasLayer,
      this.spoorwegService.StationLayer,
      this.spoorwegService.TraceLayer,
      this.spoorwegService.WisselLayer,
      this.spoorwegService.KilometreringLayer,
    ]
  });
layergroupBag = new LayerGroup ({
    layers: [
     this.bagService.BagLigplaatsLayer,
     this.bagService.BagPandLayer,
     this.bagService.BagStandplaatsLayer,
     this.bagService.BagVerblijfsobjectLayer,
     this.bagService.BagWoonplaatsLayer
    ]
  });
layergroupOverigeDiensten = new LayerGroup ({
    layers: [
      this.overigedienstenSerivce.OverheidsdienstenLayer,
      this.overigedienstenSerivce.AgrarischAreaalNederlandLayer,
      this.overigedienstenSerivce.GeografischenamenLayer
    ]
  });

 constructor(
  private spoorwegService: SpoorwegenService,
  private bestuurlijkegrenzenservice: BestuurlijkegrenzenService,
  private bagService: BagService,
  private mapconfig: ServiceService,
  private achterkaart: BgService,
  private overigedienstenSerivce: OverigeDienstenService,
  private geocoderService: GeocoderService,
 ) { }

 ngOnInit() {
 }
 getLayerGroupKaart() {
  return this.layergroupkaart.getLayers().getArray();
}
getLayerGroupBag() {
  return this.layergroupBag.getLayers().getArray();
}
getLayerGroupGrenzen() {
  return this.layergroupgrenzen.getLayers().getArray();
}
getLayerGroupOverigeDiensten() {
  return this.layergroupOverigeDiensten.getLayers().getArray();
}
getLayerGroupSpoorwegen() {
  return this.layergroupspoorwegen.getLayers().getArray();
}
}
