import {Component, Input} from '@angular/core';
import {LayerButton} from 'src/app/functions/buttons-functions/layerbutton/layerbutton.service';
import LayerGroup from 'ol/layer/Group';

@Component({
  selector: 'app-geoset-menu',
  templateUrl: 'geoset-menu.html',
  styleUrls: ['./geoset-menu.css']
})
export class GeosetComponent {
  @Input() _UserLayer: any;

  public layerInput: LayerGroup;
  public ArrayInput = [];
  public Checkthebox = true;
  show1 = false;  show2 = false;   show3 = false;
  show4 = false;  show5 = false;   show6 = false;

  constructor(
    private buttonforlayers: LayerButton,
  ) {}

  getKaartButton() {return this.buttonforlayers.getLayerGroupKaart(); }
  getGrenzenButton() {return this.buttonforlayers.getLayerGroupGrenzen(); }
  getBagButton() {return this.buttonforlayers.getLayerGroupBag(); }
  getAdresButton() {return this.buttonforlayers.getLayerGroupAdressen(); }
  getDienstenButton() {return this.buttonforlayers.getLayerGroupOverigeDiensten(); }
  getSpoorButton() {return this.buttonforlayers.getLayerGroupSpoorwegen(); }
  }



