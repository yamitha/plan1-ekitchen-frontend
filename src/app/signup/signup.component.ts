import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';

import * as firebase from 'firebase';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  errorMessage = '';
  loading = false;

  newUser: any = {
    fullName: '',
    email: '',
    password: '',
    address: '',
    contactNumber: '',
    orders: {}
  }

  constructor(
    private afAuth: AngularFireAuth,
    private afDb: AngularFireDatabase,
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit() {
  }

  addUser(user) {
    this.loading = true;
    this.errorMessage = '';

    // phone number validation
    let valid = false;
    let error = '';

    // check if theres any strings
    if (/^\d+$/.test(this.newUser.contactNumber)) {
      if (this.newUser.contactNumber.startsWith('0')) {
        if (this.newUser.contactNumber.length === 10) {
          valid = true;
        } else {
          error = 'Invalid Contact Number';
        }
      } else {
        if (this.newUser.contactNumber.length === 9) {
          valid = true;
        } else {
          error = 'Invalid Phone Number';
        }
      }
      // check if the length is between range
    } else {
      error = 'Please Enter a Valid Contact Number';
    }

    if (valid) {
      this.afAuth.auth.createUserWithEmailAndPassword(this.newUser.email, this.newUser.password).then((addedUser) => {
        console.log(addedUser);
        this.afDb.object('customers/' + addedUser.uid).set({
          userId: addedUser.uid,
          fullName: this.newUser.fullName,
          email: this.newUser.email,
          addedOn: new Date().toISOString(),
          orders: this.newUser.orders,
          address: this.newUser.address,
          contactNumber: '94' + this.newUser.contactNumber
        }).then((res) => {
          // this.toaster.addToastSuccess('Added User Successfully', '');
          // user.resetForm();
          this.loading = false;
          this.router.navigate(['/login', 'success']);
        }).catch(err => {
          // this.toaster.addToastError('Error', err.message);
          this.loading = false;
          this.errorMessage = err.message;
        })
      }).catch(err => {
        // this.toaster.addToastError('Error', err.message);
        this.loading = false;
        this.errorMessage = err.message;
      })
    } else {
      this.errorMessage = error;
      this.loading = false;
    }
  }

}
