import {Component, Input, Output, EventEmitter} from '@angular/core';
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
  @Input() DataUndoMeetArray = [];
  @Input() DrawArray: any;
  @Input() DrawMeetArray: any;
  @Input() DataActiveArray: any;
  @Input() TekenSource: any;
  @Input() MeetSource: any;
  //
  public windowOpened = false;
  public dialogOpened = false;
  public selected = '#fe413b';
  public settings: PaletteSettings = { tileSize: 30 };
  // Open
  opened2 = true;
  opened3 = true;
  opened4 = true;
  // CheckBox
  Checkthebox = true;
  // Show
  show1 = false;
  show2 = false;
  // Enable
  EnablekleurArray = false;
  EnablekleurArray1 = false;
  EnablekleurArray2 = false;
  // Disable
  DisablekleurArray = false;
  DisablekleurArray1 = false;
  DisablekleurArray2 = false;

  constructor() {}
  public close(component: any) {
    this[component + 'Opened'] = false;
  }
  public open(component: any) {
    this[component + 'Opened'] = true;
  }

  // Open
  open2() { this.opened2 = false; }
  open3() { this.opened3 = false; }
  open4() { this.opened4 = false; }
  // Close
  close2() { this.opened2 = true; }
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
  Select() {
    return this._select.emit();
  }
  Transform() {
    return this._transform.emit();
  }
  OpenSettings() {
    console.log('OpenSettings');
    return this._settings.emit();
  }

  undo(value: any) {
    const index = this.DrawArray.findIndex(x => x === value);
    this.DrawArray.splice(index, 1);
    this.DataUndoArray.push(value);
    this.TekenSource.removeFeature(value);
  }
  undoMeet(value: any) {
    const index = this.DrawMeetArray.findIndex(x => x === value);
    this.DrawMeetArray.splice(index, 1);
    this.DataUndoMeetArray.push(value);
    this.MeetSource.removeFeature(value);
  }
  redo(array: any) {
    const index = this.DataUndoArray.findIndex(x => x === array);
    this.DataUndoArray.splice(index, 1);
    this.DrawArray.push(array);
    this.TekenSource.addFeature(array);
  }
  redoMeet(array: any) {
    const index = this.DataUndoMeetArray.findIndex(x => x === array);
    this.DataUndoMeetArray.splice(index, 1);
    this.DrawMeetArray.push(array);
    this.MeetSource.addFeature(array);
  }

  EnableBox(event: any) {
    const value = event.target.value;
    const check = event.target.checked;
    this.Checkthebox = check;
    if (check === true) {
      this._Enable.emit(value);
    }
    if (check === false) {
      this.Checkthebox = false;
      this._Enable.emit('');
    }
  }
  Disable(value: any) {
    if (value === 'modify') {
      console.log(value);
      this.EnablekleurArray = false;
      this.DisablekleurArray = true;
      return this._Disable.emit('');
    } else
        if (value === 'snap') {
          console.log(value);
          this.EnablekleurArray1 = false;
          this.DisablekleurArray1 = true;
          return this._Disable.emit('');
        } else
        if (value === 'holes') {
          console.log(value);
          this.EnablekleurArray2 = false;
          this.DisablekleurArray2 = true;
          return this._Disable.emit('');
        } else {
     return this._Disable.emit('');
    }
  }
  switchMode(value: any) {
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
