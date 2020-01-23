import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import LayerGroup from 'ol/layer/Group';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';

export interface User {
  name: string;
}
export const AUTOCOMPLETE_OPTION_HEIGHT = 48;
export const AUTOCOMPLETE_PANEL_HEIGHT = 48;

@Component({
  selector: 'app-drop-down-layers',
  templateUrl: './drop-down-layers.component.html',
  styleUrls: ['./drop-down-layers.component.css'],
})
export class DropDownLayersComponent implements OnInit {
@Output() _InputTitle: EventEmitter<any> = new EventEmitter<any>();
@Output() _InputLayer: EventEmitter<any> = new EventEmitter<any>();
@Output() _InputUrl: EventEmitter<any> = new EventEmitter<any>();
InputTitle;
InputLayer;
InputUrl;

control = new FormControl();
streets: string[] = [
  'gemeenten', 'provincies', 'landsgrens', 'bevolkingskernen2011:cbsbevolkingskernen2011',
  'Champs-Élysées', 'Lombard Street', 'Abbey Road', 'Fifth Avenue',
  'Champs-Élysées', 'Lombard Street', 'Abbey Road', 'Fifth Avenue',
];
filteredStreets: Observable<string[]>;
filteredOptions: Observable<User[]>;

constructor() {}
ngOnInit() {
this.filteredStreets = this.control.valueChanges.pipe(
startWith(''),
map(value => this._filter(value))
);
}

private _filter(value: string): string[] {
const filterValue = this._normalizeValue(value);

return this.streets.filter(street => this._normalizeValue(street).includes(filterValue));
}

private _normalizeValue(value: string): string {
return value.toLowerCase().replace(/\s/g, '');
}

getInputValue() {
 this.InputTitle = (document.getElementById('InputTitle') as HTMLInputElement).value;
 if (this.InputTitle) {
  console.log('INPUT GING GOED');
  return this._InputTitle.emit(this.InputTitle);
 } else {
  console.log('else');
  }
 }
}
