import { Component, Inject } from '@angular/core';
import { MAT_LEGACY_SNACK_BAR_DATA as MAT_SNACK_BAR_DATA } from '@angular/material/legacy-snack-bar';
import { FeedbackType } from '../feedback.service';

type SnackBarData = {
  msg: string;
  type: FeedbackType;
};

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.scss']
})
export class FeedbackComponent {
  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: SnackBarData) {}
}
