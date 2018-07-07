import { SuccessComponent } from './success/success.component';
import { UserComponent } from './user/user.component';
import { KitchenComponent } from './kitchen/kitchen.component';
import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';
import { CorporateComponent } from './corporate/corporate.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { HomeComponent } from './home/home.component';
import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ComingSoonComponent } from 'app/coming-soon/coming-soon.component';
import { EventHomeComponent } from './event-home/event-home.component';
import { EventDetailedComponent } from './event-detailed/event-detailed.component';
import { PurchasesComponent } from './purchases/purchases.component';

const routes: Routes = [
    { path: 'coming-soon', component: ComingSoonComponent },
    { path: 'login', component: LoginComponent },
    { path: 'login/:status', component: LoginComponent },
    { path: 'signup', component: SignupComponent},
    { path: 'kitchen', component: KitchenComponent},
    { path: 'kitchen/:name', component: KitchenComponent},
    { path: 'events', component: EventHomeComponent},
    { path: 'purchases', component: PurchasesComponent},
    { path: 'event/:name', component: EventDetailedComponent},
    { path: 'home', component: HomeComponent, data: {title: 'Ekitchen'} },
    { path: 'profile', component: UserComponent },
    { path: 'checkout', component: CheckoutComponent },
    { path: 'checkout/:name', component: CheckoutComponent },
    { path: 'success', component: SuccessComponent },
    { path: 'corporate', component: CorporateComponent, data: {title: 'Ekitchen - Corporate Ordering'}},
    { path: '**', redirectTo: 'events' }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(routes);
