import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { GooglePlacesService } from './google-places.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  searchFormGroup: FormGroup;
  searchResults$ = new BehaviorSubject(null);

  constructor (
    private _googlePlacesService: GooglePlacesService,
    private _formBuilder: FormBuilder
  ) {
    this.searchResults$.subscribe(val => console.log(val));
  }

  ngOnInit () {
    this.searchFormGroup = this._formBuilder.group({
      addressOne: [''],
      addressTwo: ['']
    })
  }

  onSearch (updatedFormGroup: FormGroup) {
    const formGroupValue = updatedFormGroup.value;
    this._googlePlacesService.getNearestFrom2(formGroupValue.addressOne, formGroupValue.addressTwo)
      .subscribe(result => this.searchResults$.next(result));
  }
}
