import {Component, ViewChild, ElementRef, AfterViewInit, OnInit, Input, Optional, Output, EventEmitter} from '@angular/core';
import { DialogService, DialogRef, DialogCloseResult
} from '@progress/kendo-angular-dialog';
import { FormControl } from '@angular/forms';
import { click } from 'ol/events/condition';

@Component({
  selector: 'app-dialog-component',
  templateUrl: 'dialog.html',
})
export class DialogComponent {
  waarde;
  // ALLE OUTPUTS
  @Output() _submit: EventEmitter<any> = new EventEmitter<any>();
  @Output() _styleswitchDialog: EventEmitter<any> = new EventEmitter<any>();




  typeSelectDialogStyle = new FormControl('');

  constructor(private dialogService: DialogService) {}
  // PUBLIC
  opened  = false;
  opened1 = false;
  public opened2 = false;
  public opened3 = false;
  public opened4 = false;
  public opened5 = false;
  // PRIVATE

  // OPEN
  open()   { this.opened = true; }
  open1()  { this.opened1 = true; }
  public open2()  { this.opened2 = true; }
  public open3()  { this.opened3 = true; }
  public open4()  { this.opened4 = true; }
  // CLOSE
  close() { this.opened   = false; }
  close1() { this.opened1 = false; }
  public close2() { this.opened2 = false; }
  public close3() { this.opened3 = false; }
  public close4() { this.opened4 = false; }

  // SUBMIT
  check() {
    console.log(this.waarde);
  }
  submit() {
    if (click) {
      this.waarde = this.typeSelectDialogStyle.value;
      this.close();
      return this._submit.emit(this.waarde); }
    return this._submit.emit('');
   }

   styleswitchDialog() {
     this.waarde = this.typeSelectDialogStyle.value;
     if (this.waarde !== '') {
     return this._styleswitchDialog.emit(this.waarde); }
     return this._styleswitchDialog.emit('');
  }


} // EINDE



