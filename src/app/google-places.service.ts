import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/finally';
import 'rxjs/add/operator/combineLatest';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/combineLatest';

import { Injectable, Inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class GooglePlacesService {
  private _googlePlaces;
  private _LatLang;
  private _geocoder;
  private _destinationMatrixService;
  private _imperialUnits;

  constructor(
    @Inject('windowObject') window: any
  ) {
    this._googlePlaces = new window.google.maps.places.PlacesService(window.document.createElement('div'));
    this._LatLang = window.google.maps.LatLng;
    this._geocoder = new window.google.maps.Geocoder();
    this._destinationMatrixService = new window.google.maps.DistanceMatrixService();
    this._imperialUnits = window.google.maps.UnitSystem.IMPERIAL;
  }

  findNearByAgent (inpLatLng) {
    /** Finds near by real estate agent for a given Lat-Lang */
    const result = new BehaviorSubject(null);
    this._googlePlaces.textSearch({
      query: 'real estate agent',
      radius: 16093,
      location:inpLatLng
    }, res => {
      result.next(res);
      result.complete();
    });
    return result
  }

  geocodeAddresses (address1: string, address2: string) {
    /** Gets geocodes for 2 addresses */
    return this.geocode(address1).combineLatest(this.geocode(address2));
  }

  geocode (address: string) {
    /** Gets geocode for an address */
    const result = new BehaviorSubject(null);
    this._geocoder.geocode({
      address
    }, res => {
      result.next(res[0]);
      result.complete();
    })
    return result;
  }

  getAgentsFromAddress (address1: string, address2: string) {
    return this.geocodeAddresses(address1, address2)
      .filter(([geocode1, geocode2]) => {
        return !!geocode1 && !!geocode2;
      }).switchMap(geocodes => {
        return this.findNearByAgent(geocodes[0].geometry.location).combineLatest(this.findNearByAgent(geocodes[1].geometry.location), Observable.of(geocodes))
      }).filter(([agentList1, agentList2, origins]) => {
        return !!agentList1 && agentList2;
      }).map(([agentList1, agentList2, origins]) => {
        return this.combineNearbyAgents(origins, agentList1, agentList2);
      });
  }

  combineNearbyAgents (origins: any[], list1: any[], list2: any[]) {
    const result = [];
    const visited = {}
    list1.forEach(agent => {
      visited[agent.id] = agent.geometry.location
      result.push(agent);
    });
    list2.forEach(agent => {
      if (!visited[agent.id]) {
        result.push(agent);
      }
    });
    return {origins, nearByAgents: result};
  }

  getDistanceMatrix (origins: any[], destinations: any[]) {
    const result = new BehaviorSubject(null);
    this._destinationMatrixService.getDistanceMatrix({
      origins,
      destinations,
      unitSystem: this._imperialUnits,
      travelMode: 'DRIVING'
    }, (results, status) => {
      result.next(results);
      result.complete();
    });
    return result;
  }

  getNearestFrom2 (address1: string, address2: string) {
    return this.getAgentsFromAddress(address1, address2)
      .switchMap(({origins, nearByAgents}) => {
        const originLocations = origins.map(o => o.geometry.location);
        const destLocations = nearByAgents.map(a => a);
        const destLocationsChunks = [];
        const destLocationsAddressChunks = [];
        const chunckSize = 25;
        while(destLocations.length > 0) {
          const temp = destLocations.splice(0, chunckSize);
          destLocationsChunks.push(temp)
          destLocationsAddressChunks.push(temp.map(a => a.formatted_address))
        }

        const distanceMatrices = destLocationsAddressChunks.map(chunck => this.getDistanceMatrix(originLocations, chunck).filter(m => !!m));
        return Observable.combineLatest(distanceMatrices)
          .map(matrices => {
            console.log(destLocationsChunks);
            const results = [];
            matrices.forEach((matrix, mIndex) => {
              matrix.destinationAddresses.forEach((address, aIndex) => {
                results.push({
                  address: address,
                  name: destLocationsChunks[mIndex][aIndex].name,
                  distanceSum: matrix.rows[0].elements[aIndex].distance.value + matrix.rows[1].elements[aIndex].distance.value
                })
              })
            })
            return results.sort((a, b) => {
              return a.distanceSum - b.distanceSum
            });
          });
      });
  }
}
