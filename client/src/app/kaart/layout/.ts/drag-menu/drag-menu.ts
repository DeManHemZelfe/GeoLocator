import {Component, ViewChild, ElementRef, AfterViewInit, OnInit, Input, Optional, Output, EventEmitter,  Renderer2} from '@angular/core';
import { DialogService, DialogRef, DialogCloseResult
} from '@progress/kendo-angular-dialog';
import { FormControl } from '@angular/forms';
import { click } from 'ol/events/condition';
import { Feature } from 'ol';
import { Align } from '@progress/kendo-angular-popup';

@Component({
  selector: 'app-drag-menu',
  templateUrl: 'drag-menu.html',
  styleUrls: ['./drag-menu.css']
})
export class DragMenuComponent {
  @Output() _submit: EventEmitter<any> = new EventEmitter<any>();
  @Input() ObjectInformatie;

  anchorAlign: Align = { horizontal: 'center', vertical: 'top' };
  popupAlign: Align = { horizontal: 'center', vertical: 'bottom' };
  show = false;


  constructor(
    private dialogService: DialogService
    ) {}

    check() {
      console.log(this.ObjectInformatie);
    }
    onClick() {
      this.show = !this.show;
      console.log('doet het');
  }

}



