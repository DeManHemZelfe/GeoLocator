import { Component, ViewChild, ElementRef, AfterViewInit, OnInit, Input, Optional, Output, EventEmitter, Renderer2 } from '@angular/core';
import {
  DialogService, DialogRef, DialogCloseResult
} from '@progress/kendo-angular-dialog';
import { FormControl } from '@angular/forms';
import { click } from 'ol/events/condition';
import { Align } from '@progress/kendo-angular-popup';

@Component({
  selector: 'app-drag-menu',
  templateUrl: 'drag-menu.html',
  styleUrls: ['./drag-menu.css']
})
export class DragMenuComponent {
  @Output() _submit: EventEmitter<any> = new EventEmitter<any>();
  @Input() ObjectInformatie: any;
  @Input() BagObjectInformatie: any;
  @Input() PhotoSource: any;
  @Input() Legenda: any;
  @Input() ActiveLegenda: any;
  hidden = true;

  anchorAlign: Align = { horizontal: 'center', vertical: 'top' };
  popupAlign: Align = { horizontal: 'center', vertical: 'bottom' };
  show = false;
  foto;

  constructor(
    private dialogService: DialogService
  ) {
    if (this.PhotoSource) {
      const Image = document.getElementById('legend') as HTMLImageElement;
      Image.src = this.PhotoSource;
    }
  }
  click(event) {
    console.log('click');
    if (click) {
      if (this.hidden === false) {
        this.hidden = true;
      } else if (this.hidden === true) {
        this.hidden = false;
      }
    }
  }
  onClick() {
    this.show = !this.show;
    console.log('doet het');
  }
  OpenInfo() {
    console.log('open');
  }

}



