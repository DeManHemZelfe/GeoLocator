import {Component, ViewChild, ElementRef, AfterViewInit, OnInit, Input, Optional, Output, EventEmitter,  Renderer2} from '@angular/core';
import { DialogService, DialogRef, DialogCloseResult
} from '@progress/kendo-angular-dialog';
import { FormControl } from '@angular/forms';
import { click } from 'ol/events/condition';
import { Feature } from 'ol';

@Component({
  selector: 'app-draw-menu',
  templateUrl: 'draw-menu.html',
  styleUrls: ['./draw-menu.css']
})
export class DrawMenuComponent {
  maakopen = false;
  maakopen2 = false;
  maakopen3 = false;
  show1 = false;  show2 = false;   show3 = false;
  show4 = false;  show5 = false;   show6 = false;
  show7 = false;  show8 = false;   show9 = false;
  show10 = false; show11 = false; show12 = false;
  show13 = false; show14 = false; show15 = false;
  grenzenvisi = false;           bagvisi = false;
  spoorvisi = false;        dienstenvisi = false;

  tooltip;
  drawCheck = new FormControl('');
  typeSelectStyle = new FormControl('');


  constructor(
    private dialogService: DialogService
    ) {}

    drawclick() {
      if (click) {
      console.log('Good');
      } else {
      console.log('Wrong');
     }
    }

    switchMode(value) {
      if (value !== '') { console.log(value); } else {console.log('fout'); }
    }


}



