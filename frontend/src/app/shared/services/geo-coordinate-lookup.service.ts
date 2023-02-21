import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import LocationData from '../models/location-data';
import OpenStreetMapCoordinate from '../models/openstreetmap-coordinate';
import { Point } from 'geojson';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GeoCoordinateLookupService {
  constructor(private http: HttpClient) {}

  async getCoordinates(location: LocationData): Promise<Point | undefined> {
    const address = location?.address;
    if (!address || !address.zipCode || !address.street || !address.city) {
      return undefined;
    }

    if (
      address.zipCode.length > 0 &&
      address.street.length > 0 &&
      address.city.length > 0
    ) {
      const searchParamsWithStreet = new URLSearchParams();
      searchParamsWithStreet.append('format', 'json');
      searchParamsWithStreet.append('city', address.city);
      searchParamsWithStreet.append('postalcode', address.zipCode);

      if (address.country && address.country?.length > 0) {
        searchParamsWithStreet.append('country', address.country);
      }

      let street = address.street;
      if (address.streetNo && address.streetNo?.length > 0) {
        street += ' ' + address.streetNo;
      }
      searchParamsWithStreet.append('street', street);

      const result = await this.fetch(
        'https://nominatim.openstreetmap.org/search?' + searchParamsWithStreet
      );

      return result;
    } else {
      return undefined;
    }
  }

  async fetch(url: string): Promise<Point | undefined> {
    let result: OpenStreetMapCoordinate[] = [];
    try {
      result = await lastValueFrom(
        this.http.get<OpenStreetMapCoordinate[]>(url)
      );

      if (result.length === 0) {
        return undefined;
      }

      return {
        type: 'Point',
        coordinates: [Number(result[0].lat), Number(result[0].lon)]
      };
    } catch (error) {
      console.error('Error during location resulution', error);
      return undefined;
    }
  }
}
