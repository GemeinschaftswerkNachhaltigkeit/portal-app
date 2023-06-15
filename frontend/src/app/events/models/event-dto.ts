import Activity from 'src/app/shared/models/actvitiy';

type EventDto = Activity & {
  resultType: string;
};

export default EventDto;
