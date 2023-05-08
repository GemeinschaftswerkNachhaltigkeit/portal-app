import { Injectable } from '@angular/core';
import { Contact } from 'src/app/shared/models/contact';
import { Address } from 'src/app/shared/models/location-data';

@Injectable({
  providedIn: 'root'
})
export class ProfileUtilsService {
  contactString(contact?: Contact): string {
    if (contact) {
      const fullname = this.fullName(contact);
      const position = `, ${contact.position}`;
      let contactString = fullname;
      if (contact?.position) {
        contactString += position;
      }
      return contactString;
    }
    return '';
  }

  fullName(contact?: Contact): string {
    if (contact) {
      return `${contact.firstName} ${contact.lastName}`;
    }
    return '';
  }

  addressString(address?: Address): string {
    if (address) {
      let addressString = '';
      if (address.street) {
        addressString += address.street;
      }
      if (address.streetNo) {
        addressString += ` ${address.streetNo}`;
      }
      if (address.supplement) {
        addressString += ` ${address.supplement}`;
      }
      return addressString;
    }
    return '';
  }
  cityString(address?: Address): string {
    if (address) {
      let cityString = '';
      if (address.zipCode) {
        cityString += address.zipCode;
      }
      if (address.city) {
        cityString += ` ${address.city}`;
      }
      return cityString;
    }
    return '';
  }
}
