import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataService } from './data.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { ComingSoonComponent } from './coming-soon/coming-soon.component';
import { routing } from 'app/app.routing';
import { HomeComponent } from './home/home.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { CorporateComponent } from './corporate/corporate.component';
import { NavigationComponent } from './navigation/navigation.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { OverlayModule } from 'angular-io-overlay';
import { DatePickerModule } from 'angular-io-datepicker/src/datepicker/index';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { KitchenComponent } from './kitchen/kitchen.component';

import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { environment } from './../environments/environment';
import { UserService } from './_services/user.service';

// Do not import from 'firebase' as you'd lose the tree shaking benefits
import * as firebase from 'firebase';
import { UserComponent } from './user/user.component';
import { SuccessComponent } from './success/success.component';

import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { EventHomeComponent } from './event-home/event-home.component';
import { EventDetailedComponent } from './event-detailed/event-detailed.component';
import { PurchasesComponent } from './purchases/purchases.component';

firebase.initializeApp(environment.firebase);

@NgModule({
  declarations: [
    AppComponent,
    ComingSoonComponent,
    HomeComponent,
    CheckoutComponent,
    CorporateComponent,
    NavigationComponent,
    LoginComponent,
    SignupComponent,
    KitchenComponent,
    UserComponent,
    SuccessComponent,
    EventHomeComponent,
    EventDetailedComponent,
    PurchasesComponent
  ],
  imports: [
    BrowserModule,
    routing,
    NgSelectModule,
    FormsModule,
    NgbModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    OverlayModule,
    DatePickerModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    AngularFireAuthModule
  ],
  providers: [
    DataService,
    UserService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
