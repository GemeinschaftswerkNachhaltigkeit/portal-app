import { Point } from 'geojson';

type MarkerDto = {
  id: number;
  resultType: string;
  coordinate: Point;
};

export default MarkerDto;
