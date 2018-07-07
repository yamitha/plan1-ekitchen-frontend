import { UserService } from './../_services/user.service';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { DataService } from './../data.service';
import { RouterModule, ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-event-detailed',
  templateUrl: './event-detailed.component.html',
  styleUrls: ['./event-detailed.component.scss']
})
export class EventDetailedComponent implements OnInit {

  coupon;
  couponUrl = '';
  loggedIn;

  couponOrders: FirebaseListObservable<any>;

  constructor(
    private route: ActivatedRoute,
    private data: DataService,
    private router: Router,
    private afDb: AngularFireDatabase,
    titleService: Title,
    private afAuth: AngularFireAuth,
    private userService: UserService
  ) {
    router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        const title = this.getTitle(router.routerState, router.routerState.root).join('-');
        titleService.setTitle(title);
      }
    });

    this.afAuth.authState.subscribe(auth => {
      if (auth) {
        this.loggedIn = true;
      } else {
        this.loggedIn = false;
      }
    });

    // Checking if authenticated
    this.afAuth.authState.subscribe(auth => {
      if (auth) {
        this.loggedIn = true;
      } else {
        this.loggedIn = false;
      }
    });

    // Getting the parameters from the url and then setting it to the coupon url var
    this.route.params.subscribe((params) => {
      if (params['name']) {
        this.couponUrl = params['name'];
      };
    });

    // getting the list of coupons in the db
    const couponsList = this.afDb.list('coupons', { preserveSnapshot: true });

    // checking if the coupons matches the coupon url, if so set it
    couponsList.forEach(snapshots => {
      snapshots.forEach(snapshot => {
        if (this.couponUrl === snapshot.val().url) {
          this.coupon = snapshot.val();
          console.log(this.coupon);
        }
      })
    });

    this.couponOrders = this.afDb.list('coupon-orders', {preserveSnapshot: true});

  }

  ngOnInit() {
  }

  // collect that title data properties from all child routes
  // there might be a better way but this worked for me
  getTitle(state, parent) {
    const data = [];
    if (parent && parent.snapshot.data && parent.snapshot.data.title) {
      data.push(parent.snapshot.data.title);
    }

    if (state && parent) {
      data.push(... this.getTitle(state, state.firstChild(parent)));
    }
    return data;
  }

  // claiming coupon
  claimCoupon() {
    // Sending Message
    let stringy = '';
    const today = new Date();
    const dd = today.getDate();
    const mm = today.getMonth() + 1; // Jan is 0

    const yyyy = today.getFullYear();

    if (dd < 10) {
      const newDD = '0' + dd.toString();
    }

    if (mm < 10) {
      const newMM = '0' + mm.toString();
    }

    const formattedDate = dd + '/' + mm + '/' + yyyy;

    stringy = stringy + '_' + formattedDate + '_' + '\r\n'
    stringy = stringy + 'You claimed the coupon for event ' + this.coupon.title + '. The cost is ' + this.coupon.value + '\r\n';
    stringy = stringy + '*please send this message to maintain your receipt.*';

    // console.log(stringy);

    const whatsappMessage = (<any>window).encodeURIComponent(stringy);

    const url = 'https://api.whatsapp.com/send?phone=' + this.coupon.whatsappNumber + '&text=' + whatsappMessage;

    this.router.navigate(['success']);

    window.open(url);
  }


}
