import { Component, ViewChild, ElementRef, AfterViewInit, OnInit, Input, Optional} from '@angular/core';
import {defaults as defaultControls, Control, ZoomToExtent, Rotate, ScaleLine, ZoomSlider, OverviewMap, Zoom} from 'ol/control';

@Component({
  selector: 'app-toolbar-functions',
  templateUrl: './toolbar-functions.component.html',
  styleUrls: ['./toolbar-functions.component.css']
})
export class ToolbarFunctionsComponent implements AfterViewInit {
  show1  = false;
  show2  = false;
  show3  = false;
  show4  = false;
  show5  = false;
  show6  = false;
  show7  = true;
  show8  = false;
  show9  = false;
  show10 = false;
  isShow = false;


  constructor() {}

  ngAfterViewInit() {}
  toggle1() {
    this.show1 = !this.show1;
  }
  toggle2() {
    this.show2 = !this.show2;
  }
  toggle3() {
    this.show3 = !this.show3;
  }
  toggle4() {
    this.show4 = !this.show4;
  }
  toggle5() {
    this.show5 = !this.show5;
  }
  toggle6() {
    this.show6 = !this.show6;
  }
  toggle7() {
    this.show7 = !this.show7;
  }
  toggle8() {
    this.show8 = !this.show8;
  }
  toggle9() {
    this.show9 = !this.show9;
  }
  toggle10() {
    this.show10 = !this.show10;
  }

 }
