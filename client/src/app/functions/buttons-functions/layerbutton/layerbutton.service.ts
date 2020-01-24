import {Injectable, Input} from '@angular/core';
import LayerGroup from 'ol/layer/Group';
import { BestuurlijkegrenzenService } from '../../../layers/bestuurlijkegrenzen.service';
import { BagService } from '../../../layers/bag.service';
import { SpoorwegenService, ITileOptions } from '../../../layers/spoorwegen.service';
import { OverigeDienstenService } from '../../../layers/overigediensten.service';
import { GeocoderService } from 'angular-geocoder';
import { ServiceService } from 'src/app/pdokmap/pdokmapconfigmap/service.service';
import { BgService } from 'src/app/pdokmap/layer/bg.service';
import { AdresService } from '../../../kaarten/kaart-lagen/overig/adressen/adres.service';


@Injectable({
 providedIn: 'root'
})


export class LayerButton {
 @Input()
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
 layergroupAdressen = new LayerGroup({
   layers: [
     this.adresService.AdresLayer,
   ]
 });
 layergroupOverigeDiensten = new LayerGroup ({
  layers: [
  this.overigedienstenSerivce.OverheidsdienstenLayer,
  this.overigedienstenSerivce.AgrarischAreaalNederlandLayer,
  this.overigedienstenSerivce.GeografischenamenLayer
  ]
 });
 layergroupInput = new LayerGroup ({
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
  private adresService: AdresService,
  private mapconfig: ServiceService,
  private achterkaart: BgService,
  private overigedienstenSerivce: OverigeDienstenService,
  private geocoderService: GeocoderService,
 ) {}

getLayerGroupKaart() {
  return this.layergroupkaart.getLayers().getArray();
}
getLayerGroupBag() {
  return this.layergroupBag.getLayers().getArray();
}
getLayerGroupAdressen() {
  return this.layergroupAdressen.getLayers().getArray();
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
