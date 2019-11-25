import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import User from 'src/app/interfaces/user.interface';
import { UserService } from 'src/app/services/user.service';
import { FormControl } from '@angular/forms';
import Draw from 'ol/interaction/Draw';
import VectorSource from 'ol/source/Vector';
import Map from 'ol/Map';
import { MapViewComponent } from 'src/app/components/map-view/map-view.component';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {

  @ViewChild(MapViewComponent, { static: false }) mapView;

  private JWTToken: string = localStorage.getItem('JWT');

  drawType = new FormControl('');

  constructor(private router: Router, private service: UserService) { }

  ngOnInit() {
    // if (!this.user) {
    //   this.router.navigateByUrl('/login');
    // }
    if (!this.JWTToken) {
      this.router.navigateByUrl('/login');
    }
  }
}
