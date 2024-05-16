import { Point } from 'geojson';

type MarkerDto = {
  id: number;
  resultType: string;
  coordinate: Point;
  period?: {
    start: string;
    end: string;
  };
};

export default MarkerDto;
