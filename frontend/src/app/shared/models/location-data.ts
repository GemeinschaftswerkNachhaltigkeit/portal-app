import { Point } from 'geojson';

export type Address = {
  name?: string;
  street?: string;
  streetNo?: string;
  supplement?: string;
  zipCode?: string;
  city?: string;
  state?: string;
  country?: string;
};
type LocationData = {
  address?: Address;
  online?: boolean;
  privateLocation?: boolean;
  url?: string;
  coordinate?: Point | null;
};

export default LocationData;
