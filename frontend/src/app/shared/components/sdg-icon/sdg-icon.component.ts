import { Component, Input, OnInit } from '@angular/core';
import { SdgsService } from '../../services/sdgs.service';

@Component({
  selector: 'app-sdg-icon',
  templateUrl: './sdg-icon.component.html',
  styleUrls: ['./sdg-icon.component.scss']
})
export class SdgIconComponent implements OnInit {
  @Input() goal = 0;
  @Input() size: 'sm' | 'md' | 'lg' | 'full' = 'full';
  goalUrl = '';

  constructor(private sdgsService: SdgsService) {}

  ngOnInit(): void {
    this.goalUrl = this.sdgsService.getGoalIconPath(this.goal);
  }
}
