import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';

export interface User {
  name: string;
}

@Component({
  selector: 'app-drop-down-layers',
  templateUrl: './drop-down-layers.component.html',
  styleUrls: ['./drop-down-layers.component.css'],
})
export class DropDownLayersComponent implements OnInit {
@Output() _InputTitle: EventEmitter<any> = new EventEmitter<any>();
@Output() _InputLayer: EventEmitter<any> = new EventEmitter<any>();
@Output() _InputUrl: EventEmitter<any> = new EventEmitter<any>();
InputTitle: any;
InputLayer: any;
InputUrl: any;

LayerArray: Array<{naam: string, layer: string}> =
[
 {naam: ('FiestRoutes'), layer: 'lfroutes'},
 {naam: ('Aantal Rijbanen'), layer: 'weggegaantalrijbanen'},
 {naam: ('Maximum Snelheden'), layer: 'weggegmaximumsnelheden'},
 {naam: ('grond'), layer: 'bbg2015'},
 {naam: ('Bag Hoofdgroep'), layer: 'BBG2015_hoofdgroep'},
 {naam: ('Bevolkingskern'), layer: 'bevolkingskernen2011:cbsbevolkingskernen2011'},
];

Layercontrol = new FormControl();
filteredLayerArray: Observable<any[]>;

constructor() {}
ngOnInit() {
this.filteredLayerArray = this.Layercontrol.valueChanges.pipe(
startWith(''),
map(naam => this._filter(naam))
);
}

private _filter(naam: string) {
const filterValue = this._normalizeValue(naam);

return this.LayerArray.filter(value => this._normalizeValue(naam).includes(filterValue));
}

private _normalizeValue(naam: string) {
return naam.toLowerCase().replace(/\s/g, '');
}

getInputValue() {
this.InputTitle = (document.getElementById('InputTitle') as HTMLInputElement).value;
this.LayerArray.splice(this.InputTitle, 1);
if (this.InputTitle) {
 console.log('INPUT GING GOED');
 return this._InputTitle.emit(this.InputTitle);
 } else {
 console.log('else');
 }
}

}
