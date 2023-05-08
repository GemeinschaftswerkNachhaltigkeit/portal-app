import {} from '@angular/animations';
import { Component } from '@angular/core';
import { ProfileAnimation } from 'src/app/shared/components/animations/profile-animation';

@Component({
  selector: 'app-profile-layout',
  templateUrl: './profile-layout.component.html',
  styleUrls: ['./profile-layout.component.scss'],
  animations: [ProfileAnimation]
})
export class ProfileLayoutComponent {}
