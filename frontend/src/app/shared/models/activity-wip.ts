import Activity from './actvitiy';

export type ActivityWIP = Activity & {
  privacyConsent?: boolean;

  randomUniqueId?: string;
};
