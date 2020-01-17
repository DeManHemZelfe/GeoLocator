import {Component, ViewChild, ElementRef, AfterViewInit, OnInit, Input, Optional, Output, EventEmitter,  Renderer2} from '@angular/core';
import { DialogService, DialogRef, DialogCloseResult
} from '@progress/kendo-angular-dialog';
import { FormControl, FormGroup } from '@angular/forms';
import { click } from 'ol/events/condition';
import { Feature } from 'ol';

import { CheckableSettings } from '@progress/kendo-angular-treeview';
import { of, Observable } from 'rxjs';
import { SpoorwegenService } from 'src/app/layers/spoorwegen.service';
import { BestuurlijkegrenzenService } from 'src/app/layers/bestuurlijkegrenzen.service';
import { BagService } from 'src/app/layers/bag.service';
import { OverigeDienstenService } from 'src/app/layers/overigediensten.service';
import { LayerButton } from 'src/app/functions/buttons-functions/layerbutton/layerbutton.service';
import { ServiceService } from 'src/app/pdokmap/pdokmapconfigmap/service.service';
import { BgService } from 'src/app/pdokmap/layer/bg.service';
import { GeocoderService } from 'angular-geocoder';
import { AdresService } from 'src/app/kaarten/kaart-lagen/overig/adressen/adres.service';

@Component({
  selector: 'app-geoset-menu',
  templateUrl: 'geoset-menu.html',
  styleUrls: ['./geoset-menu.css']
})
export class GeosetComponent {
  show1 = false;  show2 = false;   show3 = false;
  show4 = false;  show5 = false;   show6 = false;
  show7 = false;  show8 = false;   show9 = false;
  show10 = false; show11 = false; show12 = false;
  show13 = false; show14 = false; show15 = false;

  constructor(
    private spoorwegService: SpoorwegenService,
    private bestuurlijkegrenzenservice: BestuurlijkegrenzenService,
    private bagService: BagService,
    private adresService: AdresService,
    private overigedienstenSerivce: OverigeDienstenService,
    private buttonforlayers: LayerButton,
    private mapconfig: ServiceService,
    private achterkaart: BgService,
    public geocoderService: GeocoderService
  ) {}

  // MAPBUTTONS
  change() {
    if (click) { console.log('click'); } else { console.log('no click'); }
  }
  getKaartButton() {return this.buttonforlayers.getLayerGroupKaart(); }
  getGrenzenButton() {return this.buttonforlayers.getLayerGroupGrenzen(); }
  getBagButton() {return this.buttonforlayers.getLayerGroupBag(); }
  getAdresButton() {return this.buttonforlayers.getLayerGroupAdressen(); }
  getDienstenButton() {return this.buttonforlayers.getLayerGroupOverigeDiensten(); }
  getSpoorButton() {return this.buttonforlayers.getLayerGroupSpoorwegen(); }

  }



