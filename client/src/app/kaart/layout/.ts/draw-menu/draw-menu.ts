import {Component, ViewChild, ElementRef, AfterViewInit, OnInit, Input, Optional, Output, EventEmitter,  Renderer2} from '@angular/core';
import { DialogService, DialogRef, DialogCloseResult
} from '@progress/kendo-angular-dialog';
import { FormControl } from '@angular/forms';
import { click } from 'ol/events/condition';
import { Feature } from 'ol';
import { Icon, Stroke, Style, Fill, Circle} from 'ol/style';
import { PaletteSettings } from '@progress/kendo-angular-inputs';

@Component({
  selector: 'app-draw-menu',
  templateUrl: 'draw-menu.html',
  styleUrls: ['./draw-menu.css']
})
export class DrawMenuComponent {
// OUTPUT
@Output() _giveDrawValue: EventEmitter<any> = new EventEmitter<any>();
@Output() _giveMeetValue: EventEmitter<any> = new EventEmitter<any>();
@Output() _select: EventEmitter<any> = new EventEmitter<any>();
@Output() _transform: EventEmitter<any> = new EventEmitter<any>();
@Output() _settings: EventEmitter<any> = new EventEmitter<any>();
@Output() _Enable: EventEmitter<any> = new EventEmitter<any>();
@Output() _Disable: EventEmitter<any> = new EventEmitter<any>();
@Output() _check: EventEmitter<any> = new EventEmitter<any>();
@Output() _ColorDrawMenu: EventEmitter<any> = new EventEmitter<any>();
@Output() _Modify: EventEmitter<any> = new EventEmitter<any>();
@Output() _Snap: EventEmitter<any> = new EventEmitter<any>();
// INPUT
@Input() DataUndoArray = [];
@Input() DrawArray;
@Input() DataActiveArray;
@Input() TekenSource;
//
public windowOpened = false;
public dialogOpened = false;
public selected = '#fe413b';
public settings: PaletteSettings =
{
 tileSize: 30,
};
//
opened2 = true;
opened3 = true;
opened4 = true;
opened5 = true;
//
Checkthebox;
maakopen = false;
maakopen2 = false;
maakopen3 = false;
//
show1 = false;  show2 = false;   show3 = false;
show4 = false;  show5 = false;   show6 = false;
show7 = false;  show8 = false;   show9 = false;
show10 = false; show11 = false; show12 = false;
show13 = false; show14 = false; show15 = false;
//
grenzenvisi = false;           bagvisi = false;
spoorvisi = false;        dienstenvisi = false;
//
EnablekleurArray  = false;   DisablekleurArray = false;
EnablekleurArray1  = false;  DisablekleurArray1 = false;
EnablekleurArray2  = false;  DisablekleurArray2 = false;
//
constructor(
private dialogService: DialogService
) {}
//
public close(component) { this[component + 'Opened'] = false; }
public open(component)  { this[component + 'Opened'] = true;  }
//
open2()  {this.opened2 = false; }
open3()  { this.opened3 = false; }
open4()  { this.opened4 = false; }
//
close2() {this.opened2 = true; }
close3() { this.opened3 = true; }
close4() { this.opened4 = true; }
//
onChange(color: string): void {
this.selected = color;
if (this.selected !== '') {
 return this._ColorDrawMenu.emit(this.selected);
 }
return this._ColorDrawMenu.emit('');
 }
// Select
Select() {return this._select.emit(); }
Transform() {return this._transform.emit(); }
OpenSettings() {
console.log('OpenSettings');
return this._settings.emit();
}
// Drawclick
drawclick() {
if (click) {
 console.log('Good');
 } else {
 console.log('Wrong');
 }
}

undo(value) {
 console.log(value);
 console.log(this.DrawArray);
 const index = this.DrawArray.findIndex(x => x === value);
 this.DrawArray.splice(index, 1);
 this.DataUndoArray.push(value);
 this.TekenSource.removeFeature(value);
}
redo(array) {
 console.log(array);
 console.log(this.DrawArray);
 const index = this.DataUndoArray.findIndex(x => x === array);
 this.DataUndoArray.splice(index, 1);
 this.DrawArray.push(array);
 this.TekenSource.addFeature(array);
}
EnableBox(event) {
const value = event.target.value;
const check = event.target.checked;
if (check === true) {
 console.log(value);
 this._Enable.emit(value);
} else {
 console.log('false');
 }
}
Disable(value) {
if (value === 'modify') {
 console.log(value);
 this.EnablekleurArray = false;
 this.DisablekleurArray = true;
 return this._Disable.emit('');
} else if (value === 'snap') {
 console.log(value);
 this.EnablekleurArray1 = false;
 this.DisablekleurArray1 = true;
 return this._Disable.emit('');
} else if (value === 'holes') {
 console.log(value);
 this.EnablekleurArray2 = false;
 this.DisablekleurArray2 = true;
 return this._Disable.emit('');
} else {
 return this._Disable.emit('');
 }
}
switchMode(value) {
if (value !== '') {
 return this._giveDrawValue.emit(value);
 }
return this._giveDrawValue.emit('');
}
switchMetenMode(value: 'length' | 'area') {
if (value === 'length') {
 return this._giveMeetValue.emit('LineString');
} else if (value === 'area') {
 return this._giveMeetValue.emit('Polygon');
} else {
 return this._giveMeetValue.emit('');
 }
}

}



