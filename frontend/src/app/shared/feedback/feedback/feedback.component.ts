import { Component, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
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
