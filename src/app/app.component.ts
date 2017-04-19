import { Component, Inject } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app works!';
  googlePlaces;

  constructor (
    @Inject('windowObject') window: any
  ) {
    this.googlePlaces = new window.google.maps.places.PlacesService(window.document.createElement('div'));
    this.googlePlaces.textSearch({
      query: 'real estate agent',
      radius: 16093,
      location: new window.google.maps.LatLng(29.7676286,-95.4058181)
    }, res => console.log(res))
  }
}
