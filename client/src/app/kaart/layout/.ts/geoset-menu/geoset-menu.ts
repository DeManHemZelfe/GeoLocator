import {Component, ViewChild, ElementRef, AfterViewInit, OnInit, Input, Optional, Output, EventEmitter,  Renderer2} from '@angular/core';
import { DialogService, DialogRef, DialogCloseResult
} from '@progress/kendo-angular-dialog';
import { FormControl } from '@angular/forms';
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

@Component({
  selector: 'app-geoset-menu',
  templateUrl: 'geoset-menu.html',
  styleUrls: ['./geoset-menu.css']
})
export class GeosetComponent {
  checked = false;
  disabled = false;

  public checkedKeys: any[] = [''];
  public checkedKeys2: any[] = [''];
  public enableCheck = true;
  public checkChildren = true;
  public checkParents = true;
  public checkOnClick = false;
  public checkMode: any = 'multiple';
  public selectionMode: any = 'single';

  public get checkableSettings(): CheckableSettings {
      return {
          checkChildren: this.checkChildren,
          checkParents: this.checkParents,
          enabled: this.enableCheck,
          mode: this.checkMode,
          checkOnClick: this.checkOnClick
      };
  }

  public data2: any[] = [{
    text2: 'Achtergrond Kaarten',
    items2: [
          { text2: 'Brt' },
          { text2: 'BrtWater' },
          { text2: 'BrtGrijs' },
          { text2: 'BrtPasteel' }
       ]
      }];

  public data: any[] = [{
    text: 'Overige Kaarten',
    items: [
        {
            text: 'Bestuurlijke Grenzen',
            items: [
                { text: 'Landsgrens' },
                { text: 'Gemeentegrens' },
                { text: 'Provinciegrens' }
            ]
        },
        {
            text: 'Bag',
            items: [
                { text: 'woonplaats' },
            ]
        },
        {
            text: 'Spoor',
            items: [
                { text: 'spoorwegen' },
            ]
        }
    ]
  }];

  public children = (dataItem: any): Observable<any[]> => of(dataItem.items);
  public hasChildren = (dataItem: any): boolean => !!dataItem.items;

  constructor(
    private spoorwegService: SpoorwegenService,
    private bestuurlijkegrenzenservice: BestuurlijkegrenzenService,
    private bagService: BagService,
    private overigedienstenSerivce: OverigeDienstenService,
    private buttonforlayers: LayerButton,
    private mapconfig: ServiceService,
    private achterkaart: BgService,
    public geocoderService: GeocoderService
  ) {}

  // MAPBUTTONS
  getKaartButton() {return this.buttonforlayers.getLayerGroupKaart(); }
  getGrenzenButton() {return this.buttonforlayers.getLayerGroupGrenzen(); }
  getBagButton() {return this.buttonforlayers.getLayerGroupBag(); }
  getDienstenButton() {return this.buttonforlayers.getLayerGroupOverigeDiensten(); }
  getSpoorButton() {return this.buttonforlayers.getLayerGroupSpoorwegen(); }

  check() {
    if (this.checked === false) {console.log('check'); }
   }
  }



