import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/services/auth.service';
import { AccountFacadeService } from '../../account-facade.service';
import UserData from '../../models/user-data';

type HomeTile = {
  title: string;
  description: string;
  route?: string[];
  extUrl?: string;
  onlyOrga?: boolean;
};

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  userData?: UserData;

  userTiles: HomeTile[] = [
    {
      title: 'account.titles.map',
      description: 'account.texts.map',
      route: ['/map']
    },
    {
      title: 'account.titles.myData',
      description: 'account.texts.myDataShort',
      route: ['/account/my-data']
    },
    {
      title: 'account.titles.myOrga',
      description: 'account.texts.myOrga',
      route: ['/account/my-organisation']
    },
    {
      title: 'account.titles.activities',
      description: 'account.texts.activities',
      route: ['/account/activities'],
      onlyOrga: true
    },
    {
      title: 'account.titles.offers',
      description: 'account.texts.offers',
      route: ['/account/offers'],
      onlyOrga: true
    },
    {
      title: 'account.titles.bestPractices',
      description: 'account.texts.bestPractices',
      route: ['/account/best-practices'],
      onlyOrga: true
    }
  ];

  adminTiles: HomeTile[] = [
    {
      title: 'account.titles.map',
      description: 'account.texts.map',
      route: ['/map']
    },
    {
      title: 'account.titles.myData',
      description: 'account.texts.myDataShort',
      route: ['/account/my-data']
    },
    {
      title: 'account.titles.clearing',
      description: 'account.texts.clearing',
      route: ['/clearing']
    },
    {
      title: 'account.titles.orgas',
      description: 'account.texts.orgas',
      route: ['/administration/organisations']
    },
    {
      title: 'account.titles.userManagement',
      description: 'account.texts.userManagement',
      extUrl: this.accountFacade.getKeycloakConsoleUrl()
    }
  ];

  tiles;

  constructor(
    private accountFacade: AccountFacadeService,
    private auth: AuthService
  ) {
    this.tiles = accountFacade.isAdminUser() ? this.adminTiles : this.userTiles;
  }

  hasOrga(): boolean {
    return this.auth.userHasOrga();
  }

  ngOnInit(): void {
    this.userData = this.accountFacade.getUserData();
  }
}
