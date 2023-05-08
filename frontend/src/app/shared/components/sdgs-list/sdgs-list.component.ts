import { Component, Input } from '@angular/core';
import { SdgsService } from '../../services/sdgs.service';

@Component({
  selector: 'app-sdgs-list',
  templateUrl: './sdgs-list.component.html',
  styleUrls: ['./sdgs-list.component.scss']
})
export class SdgsListComponent {
  @Input() sdgs: number[] = this.sdgsService.allSdgs;

  constructor(private sdgsService: SdgsService) {}
}
