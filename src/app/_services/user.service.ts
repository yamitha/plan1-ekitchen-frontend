import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import * as _ from 'lodash';
import 'rxjs/add/operator/map'

@Injectable()
export class UserService {

    customer: any;

    constructor(
        private af: AngularFireAuth,
        private afDatabase: AngularFireDatabase,
        private afAuth: AngularFireAuth
    ) {

    }

    getUser() {
        this.customer = JSON.parse(localStorage.getItem('currentCustomer'));
        return this.customer;
    }

    checkState() {
        this.afAuth.authState.subscribe(auth => {
            if (auth) {
                return true;
            } else {
                return false;
            }
        });
    };

}
