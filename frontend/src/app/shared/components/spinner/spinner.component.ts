import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { LoadingService } from '../../services/loading.service';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.scss']
})
export class SpinnerComponent implements OnInit {
  @Input() forId?: string;
  @Input() title? = '';
  @Input() small? = false;
  @Input() noPadding? = false;
  @Input() miniSpinnerInTopRightCorner? = false;
  loading$?: Observable<boolean>;

  constructor(private loading: LoadingService) {}

  ngOnInit(): void {
    this.loading$ = this.loading.isLoading$(this.forId);
  }
}
