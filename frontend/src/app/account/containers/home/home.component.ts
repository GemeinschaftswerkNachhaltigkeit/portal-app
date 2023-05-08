import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/services/auth.service';
import { AccountFacadeService } from '../../account-facade.service';
import UserData from '../../models/user-data';
import { FeatureService } from 'src/app/shared/components/feature/feature.service';
import { Features } from 'src/app/shared/components/feature/feature.component';

type HomeTile = {
  new?: boolean;
  title: string;
  description: string;
  route?: string[];
  extUrl?: string;
  onlyOrga?: boolean;
  featureFlag?: Features;
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
      new: true,
      title: 'account.titles.danActivities',
      description: 'account.texts.danActivities',
      route: ['/account/dan-activities'],
      featureFlag: 'dan-account'
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

  tiles: HomeTile[] = [];

  constructor(
    private accountFacade: AccountFacadeService,
    private auth: AuthService,
    public featureService: FeatureService
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
