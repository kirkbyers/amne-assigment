import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {
  MdInputModule,
  MdButtonModule
} from '@angular/material';

import { AppComponent } from './app.component';
import { GooglePlacesService } from './google-places.service';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpModule,
    NoopAnimationsModule,

    MdInputModule,
    MdButtonModule
  ],
  providers: [
    { provide: "windowObject", useValue: window},
    GooglePlacesService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
