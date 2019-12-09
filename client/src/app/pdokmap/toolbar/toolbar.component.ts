import { Component, OnInit, AfterViewInit } from '@angular/core';
import { SpoorwegenService } from 'src/app/layers/spoorwegen.service';
import { BestuurlijkegrenzenService } from 'src/app/layers/bestuurlijkegrenzen.service';
import { BagService } from 'src/app/layers/bag.service';
import { OverigeDienstenService } from 'src/app/layers/overigediensten.service';
import { LayerButton } from 'src/app/functions/buttons-functions/layerbutton/layerbutton.service';
import { ServiceService } from '../pdokmapconfigmap/service.service';
import { BgService } from '../layer/bg.service';
import { GeocoderService } from 'angular-geocoder';


import { Map, View, Collection,  MapBrowserEvent  } from 'ol';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';
import Feature from 'ol/Feature';
import Overlay from 'ol/Overlay';
import OverlayPositioning from 'ol/OverlayPositioning';
import WMTS, { optionsFromCapabilities } from 'ol/source/WMTS';
import Projection from 'ol/proj/Projection';
import { getTopLeft } from 'ol/extent';
import WMTSTileGrid from 'ol/tilegrid/WMTS';
import { FormControl } from '@angular/forms';
import OlDraw from 'ol/interaction/Draw';
import TileWMS, { Options as TileWMSOptions } from 'ol/source/TileWMS';
import { Options as TileOptions } from 'ol/layer/Tile';
import { OSM, Vector as VectorSource, TileJSON } from 'ol/source';
import { Icon, Stroke, Style, Fill, Circle} from 'ol/style';
import {defaults as defaultControls, Control, ZoomToExtent, Rotate, ScaleLine, ZoomSlider, OverviewMap, Zoom} from 'ol/control';
import {defaults as defaultInteractions, Modify, Select, Snap,  Translate, Draw } from 'ol/interaction';
import LayerGroup from 'ol/layer/Group';
import { ToolbarFunctionsComponent } from '../../functions/toolbar-functions/toolbar-functions.component';
import { getLocaleId } from '@angular/common';
import { LayerbuttonComponent } from '../../functions/buttons-functions/layerbutton/layerbutton.component';
import { TooltipDirective } from '@progress/kendo-angular-tooltip';
import { SidebarComponent } from '../sidebar.component';


@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements AfterViewInit {
  show1  = false;  show2  = false;  show3  = false;
  show4  = false;  show5  = false;  show6  = false;
  show7  = false;  show8  = false;  show9  = false;
  show10 = false;  show11 = false;  show12 = false;
  show13 = false;  show14 = false;  show15 = false;
  grenzenvisi = false;             bagvisi = false;
  spoorvisi = false;          dienstenvisi = false;

  public searchInput = '';
  public places = [];
  public collations = [];
  public searchThreshold = 2;
  public foundPlace: any = null;
  public selectedItem = [];
  public selectedIndex = -1;

  public draw: OlDraw;

  typeSelectTekenen = new FormControl('');

  modifyselect = new Select();
  modifytranslate = new Translate({
    features: this.modifyselect.getFeatures(),
  });

  select = new Select({});

  source = new VectorSource({
    wrapX: false,
  });

  tekenfunctie = new VectorLayer({
    source: this.source,
    style: new Style({
      fill: new Fill({
        color: 'red'
      }),
      stroke: new Stroke({
        color: 'Black',
        width: 3
      }),
      image: new Circle({
        radius: 7,
        fill: new Fill({
          color: '#ffcc33'
        })
      })
    })
  });

  private projectionExtent = [-285401.92, 22598.08, 595401.92, 903401.92];
  private projection = new Projection({
    code: 'EPSG:28992',
    units: 'm',
    extent: this.projectionExtent
  });

  constructor(
    private spoorwegService: SpoorwegenService,
    private bestuurlijkegrenzenservice: BestuurlijkegrenzenService,
    private bagService: BagService,
    private overigedienstenSerivce: OverigeDienstenService,
    private buttonforlayers: LayerButton,
    private mapconfig: ServiceService,
    private achterkaart: BgService,
    public geocoderService: GeocoderService,
  ) { }

 ngAfterViewInit() {
  }

  // addInteraction() {
  //   const value = this.typeSelectTekenen.value;
  //   if (value !== '') {
  //     this.draw = new OlDraw({
  //       source: this.source,
  //       type: value,
  //     });
  //     this.map.addInteraction(this.draw);
  //     console.log(this.draw);
  //   }
  // }
  // switchMode() {
  //   this.map.removeInteraction(this.draw);
  //   this.addInteraction();
  // }
  toggle1() {
    this.show1 = !this.show1;
  }
toggle2() {
    this.show2 = !this.show2;
  }
toggle3() {
    this.show3 = !this.show3;
  }
toggle4() {
    this.show4 = !this.show4;
  }
toggle5() {
    this.show5 = !this.show5;
  }
  toggle6() {
    this.show6 = !this.show6;
  }
  toggle7() {
    this.show7 = !this.show7;
  }
  toggle8() {
    this.show8 = !this.show8;
  }
  toggle9() {
    this.show9 = !this.show9;
  }
  toggle10() {
    this.show10 = !this.show10;
  }
  toggle11() {
    this.show11 = !this.show11;
  }
  toggle12() {
    this.show12 = !this.show12;
  }
  toggle13() {
    this.show13 = !this.show13;
  }
  toggle14() {
    this.show14 = !this.show14;
  }
  toggleGrenzen() {
    this.grenzenvisi = !this.grenzenvisi;
  }
  toggleBag() {
    this.bagvisi = !this.bagvisi;
  }
  toggleSpoor() {
    this.spoorvisi = !this.spoorvisi;
  }
  toggleDiensten() {
    this.dienstenvisi = !this.dienstenvisi;
  }
  clickonselect() {
    console.log('klik op de select');
  }
  undo() {
    const features = this.source.getFeatures();
    const lastFeature = features[features.length - 1];
    this.source.removeFeature(lastFeature);
  }
  redo() {
    const features = this.source.getFeatures();
    const lastFeature = features[features.length - 1];
    this.source.removeFeature(lastFeature);
    console.log('je hebt op de knop geklikt');
    console.log('maak een unieke id aan of probeer met de value iets aan te geven, of zet alles in een array');
  }
  // public onPlaceFound(place) {
  //   console.log(place);
  //   this.map.getView().animate({center: place.centroide_rd.coordinates, zoom: 12});
  // }

  getKaartButton() {
    return this.buttonforlayers.getLayerGroupKaart();
  }
  getGrenzenButton() {
    return this.buttonforlayers.getLayerGroupGrenzen();
  }
  getBagButton() {
    return this.buttonforlayers.getLayerGroupBag();
  }
  getDienstenButton() {
    return this.buttonforlayers.getLayerGroupOverigeDiensten();
  }
  getSpoorButton() {
    return this.buttonforlayers.getLayerGroupSpoorwegen();
  }


}
