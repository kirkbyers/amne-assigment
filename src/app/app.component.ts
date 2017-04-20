import { Component, Inject, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { GooglePlacesService } from './google-places.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {
  searchFormGroup: FormGroup;
  searchResults$ = new BehaviorSubject(null);
  progress$ = new BehaviorSubject(100);

  constructor (
    private _googlePlacesService: GooglePlacesService,
    private _formBuilder: FormBuilder
  ) {
    this.searchResults$.subscribe(val => console.log(val));
    this.progress$.subscribe(val => console.log(val));
  }

  ngOnInit () {
    this.searchFormGroup = this._formBuilder.group({
      addressOne: [''],
      addressTwo: ['']
    })
  }

  onSearch (updatedFormGroup: FormGroup) {
    this.progress$.next(0);
    const formGroupValue = updatedFormGroup.value;
    this._googlePlacesService.getNearestFrom2(formGroupValue.addressOne, formGroupValue.addressTwo)
      .subscribe(result => {
        this.progress$.next(100);
        this.searchResults$.next(result)
      });
  }
}
