import { NgModule } from '@angular/core';

import { Storage } from '@ionic/storage';
import { SecureStorage } from 'ionic-native';
import { IonicApp, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';

import { AuthPage } from '../pages/auth/auth';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import { ShiftsPage } from '../pages/shifts/shifts';
import { ShiftsCreatePage } from '../pages/shifts-create/shifts-create';
import { ShiftsDetailPage } from '../pages/shifts-detail/shifts-detail';
import { ShiftsFilterPage } from '../pages/shifts-filter/shifts-filter';
import { TasksPage } from '../pages/tasks/tasks';
import { TasksDetailPage } from '../pages/tasks-detail/tasks-detail';
import { TasksFilterPage } from '../pages/tasks-filter/tasks-filter';
import { UserPage } from '../pages/user/user';

import { Http } from '@angular/http';
import { AuthHttp, AuthConfig} from 'angular2-jwt';
import { AuthService } from '../providers/auth';
import { DeliveryData } from '../providers/delivery-data';

export function getAuthHttp(http) {
  return new AuthHttp(new AuthConfig({
    noJwtError: true
  }), http);
}

export function provideStorage() {
 return new Storage(['sqlite', 'websql', 'indexeddb'], { name: '__mydb' });
}

@NgModule({
  declarations: [
    MyApp,
    AuthPage,
    HomePage,
    TabsPage,
    ShiftsPage,
    ShiftsCreatePage,
    ShiftsDetailPage,
    ShiftsFilterPage,
    TasksPage,
    TasksDetailPage,
    TasksFilterPage,
    UserPage
  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AuthPage,
    HomePage,
    TabsPage,
    ShiftsPage,
    ShiftsCreatePage,
    ShiftsDetailPage,
    ShiftsFilterPage,
    TasksPage,
    TasksDetailPage,
    TasksFilterPage,
    UserPage
  ],
  providers: [
    SecureStorage,
    DeliveryData,
    AuthService,
    { 
      provide: AuthHttp,
      useFactory: getAuthHttp,
      deps: [Http]
    },
    { 
      provide: Storage,
      useFactory: provideStorage
    }
  ]
})
export class AppModule { }