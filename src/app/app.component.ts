import 'rxjs/add/observable/of';

import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs/Observable';

import { GooglePlacesService } from './google-places.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  searchFormGroup: FormGroup;
  searchResults$: Observable<any[]>;

  constructor (
    private _googlePlacesService: GooglePlacesService,
    private _formBuilder: FormBuilder
  ) {
    this.searchResults$ = Observable.of([])
    this._googlePlacesService.getNearestFrom2('826 Greenpark Drive, Houston, TX', '4419 Blossom St, Houston, Tx').subscribe(val => console.log(val));
  }

  ngOnInit () {
    this.searchFormGroup = this._formBuilder.group({
      addressOne: [''],
      addressTwo: ['']
    })
  }

  onSearch (updatedFormGroup: FormGroup) {
    const formGroupValue = updatedFormGroup.value();
    // this._googlePlacesService.findNearByAgent([formGroupValue.addressOne, formGroupValue.addressTwo])
    //   .subscribe(val => console.log(val));
  }
}
