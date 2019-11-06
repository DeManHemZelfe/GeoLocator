import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title = 'client';
  lat = 52.370216;
  lng = 4.895168;

  onButtonClick() {
    console.log('click');
  }
}
