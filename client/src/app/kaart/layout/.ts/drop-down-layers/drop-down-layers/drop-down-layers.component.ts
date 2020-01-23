import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import LayerGroup from 'ol/layer/Group';

@Component({
  selector: 'app-drop-down-layers',
  templateUrl: './drop-down-layers.component.html',
  styleUrls: ['./drop-down-layers.component.css']
})
export class DropDownLayersComponent implements OnInit {
@Output() _InputValue: EventEmitter<any> = new EventEmitter<any>();
InputValue;


constructor() {
}

ngOnInit() {}
getInputValue() {
 this.InputValue = (document.getElementById('InputTitle') as HTMLInputElement).value;
 if (this.InputValue) {
  console.log('INPUT GING GOED');
  return this._InputValue.emit(this.InputValue);
 } else {
  console.log('else');
  }
 }
}
