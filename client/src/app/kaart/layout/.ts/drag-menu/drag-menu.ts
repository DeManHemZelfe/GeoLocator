import {Component, ViewChild, ElementRef, AfterViewInit, OnInit, Input, Optional, Output, EventEmitter,  Renderer2} from '@angular/core';
import { DialogService, DialogRef, DialogCloseResult
} from '@progress/kendo-angular-dialog';
import { FormControl } from '@angular/forms';
import { click } from 'ol/events/condition';
import { Feature } from 'ol';

@Component({
  selector: 'app-drag-menu',
  templateUrl: 'drag-menu.html',
  styleUrls: ['./drag-menu.css']
})
export class DragMenuComponent {


  constructor(
    private dialogService: DialogService
    ) {}

} // EINDE



