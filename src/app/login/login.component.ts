import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import * as firebase from 'firebase/app';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  status = false;
  user: Observable<firebase.User>;
  model: any = {};
  loading = false;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private afAuth: AngularFireAuth,
    private afDatabase: AngularFireDatabase,
  ) {
    this.route.params.subscribe((params) => {
      if (params['status']) {
        if (params['status'] === 'success') {
          this.status = true;
        }
      } else {
        this.status = false;
      }
    })
  }

  ngOnInit() {
    this.afAuth.auth.signOut();
    localStorage.removeItem('currentCustomer');
  }

  login() {
    this.loading = true;
    this.afAuth.auth.signInWithEmailAndPassword(this.model.email, this.model.password).then(value => {
      this.loading = false;

      const userObj = this.afDatabase.object('customers/' + value.uid);

      userObj.subscribe((res) => {
        // tslint:disable-next-line:max-line-length
        localStorage.setItem('currentCustomer', JSON.stringify({ userId: value.uid, fullName: res.fullName, email: res.email, contactNumber: res.contactNumber, address: res.address}));
        this.router.navigate(['/']);
      });

    })
    .catch(err => {
      this.loading = false;
      this.error = err.message;
    });
  }

}
