import {Component, AfterViewInit, Output, EventEmitter} from '@angular/core';
import { GeocoderService } from 'angular-geocoder';


@Component({
  selector: 'app-toolbar-functions',
  templateUrl: './toolbar-functions.component.html',
  styleUrls: ['./toolbar-functions.component.css']
})
export class ToolbarFunctionsComponent implements AfterViewInit {
  @Output() _placefound: EventEmitter<any> = new EventEmitter<any>();

  // GEOLOCATOR
  public searchInput = '';
  public places = [];
  public collations = [];
  public searchThreshold = 2;
  public foundPlace: any = null;
  public selectedItem = [];
  public selectedIndex = -1;

  constructor(
    public geocoderService: GeocoderService
  ) {}

  ngAfterViewInit() {}
  onPlaceFound(place) { return this._placefound.emit(place); }
}
