import { Feedback } from 'src/app/clearing/models/feedback';
import Organisation from './organisation';

/**
 * OrganisationWorkInProgressDto
 */
export type OrganisationWIP = Organisation & {
  contactInvite?: boolean;

  privacyConsent?: boolean;

  hasDuplicates?: boolean;
  modifiedAt?: string;
  randomUniqueId?: string;
  source?: string;
  feedbackRequest?: string;
  feedbackHistory?: Feedback[];
};
