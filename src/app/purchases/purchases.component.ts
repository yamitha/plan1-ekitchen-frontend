import { UserService } from './../_services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from './../data.service';
import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase, FirebaseObjectObservable, FirebaseListObservable } from 'angularfire2/database';

@Component({
  selector: 'app-checkout',
  templateUrl: './purchases.component.html',
  styleUrls: ['./purchases.component.scss']
})
export class PurchasesComponent implements OnInit {

  user;
  coupon = {
    url: '',
    id: '',
    artWorkLink: '',
    whatsappNumber: '',
    title: ''
  }

  purchases = {
    coupons: [],
    numberOfCoupons: 0,
    total: 0
  };

  coupons: FirebaseListObservable<any>;
  orders: FirebaseListObservable<any>;

  couponOrders = [];
  customerOrders = [];

  errorMessage = '';

  globalOrdering = false;
  globalOrderingReason = '';

  constructor(
    private data: DataService,
    private route: ActivatedRoute,
    private router: Router,
    private afDb: AngularFireDatabase,
    private userService: UserService
  ) {
    this.route.params.subscribe((params) => {
      if (params['name']) {
        this.coupon.url = params['name'];
      };
    });

    // Getting user
    this.user = userService.getUser();

    // Getting online ordering status
    this.afDb.object('onlineOrdering', {preserveSnapshot: true}).subscribe(value => {
      this.globalOrdering = value.val().globalOrdering;
      this.globalOrderingReason = value.val().globalOrderingReason;
    })

    // Getting lists
    this.orders = this.afDb.list('purchases', {preserveSnapshot: true});

    this.coupons = this.afDb.list('coupons/' + this.coupon.id, {preserveSnapshot: true});

    // Matching coupon
    const coupons = this.afDb.list('coupons', {preserveSnapshot: true});

    // This could be more efficent
    coupons.forEach(snapshots => {
      for (let i = 0; i < snapshots.length; i++) {
        if (snapshots[i].val().url === this.coupon.url) {
          this.coupon.id = snapshots[i].key;
          this.coupon.artWorkLink = snapshots[i].val().logoUrl;
          this.coupon.whatsappNumber = snapshots[i].val().whatsappNumber;
          this.coupon.title = snapshots[i].val().couponTitle;
          break;
        }
      }
    });


    const couponFirebaseOrders = this.afDb.list('coupons/' + this.coupon.id + '/purchases', {preserveSnapshot: true});
    const customerFirebaseOrders = this.afDb.list('customers/' + this.user.userId + '/orders', {preserveSnapshot: true});

    couponFirebaseOrders.subscribe(values => {
      values.forEach(element => {
        this.couponOrders.push(element.val());
      });
    })

    customerFirebaseOrders.subscribe(values => {
      values.forEach(element => {
        this.customerOrders.push(element.val());
      });
    })
};

  ngOnInit() {
    this.data.currentPurchases.subscribe(purchases => this.purchases = purchases);
  }

  sendOrder() {
    if (this.globalOrdering) {
      if (this.user.address !== '') {
        const orderId = 0;

        const order = {
          orderId: orderId,
          orderDateTime: new Date().toISOString(),
          customerId: this.user.userId,
          customerName: this.user.fullName,
          customerContactNumber: this.user.contactNumber,
          couponId: this.coupon.id,
          couponTitle: this.coupon.title,
          couponWhatsappNumber: this.coupon.whatsappNumber,
          coupons: this.purchases.coupons,
          numberOfCoupons: this.purchases.numberOfCoupons,
          orderTotal: this.purchases.total,
          cancelled: false,
          reasonForCancelling: '',
          completed: false,
          paymentMethod: 'Cash',
          paid: false,
          transactionAmount: 0
        }

        // Sending to server
        this.orders.push(order).then(addedOrder => {
          this.couponOrders.push(addedOrder.key);
          this.customerOrders.push(addedOrder.key);

          this.afDb.object('coupons/' + this.coupon.id).update({orders: this.couponOrders}).then(res => {});
          this.afDb.object('customers/' + this.user.userId).update({orders: this.customerOrders}).then(res => {});
        });

        // Sending Message
        let stringy = '';
        const today = new Date();
        const dd = today.getDate();
        const mm = today.getMonth() + 1; // Jan is 0

        const yyyy = today.getFullYear();

        if (dd < 10) {
          const newDD = '0' + dd.toString();
        }

        if ( mm < 10) {
          const newMM = '0' + mm.toString();
        }

        const formattedDate = dd + '/' + mm + '/' + yyyy;

        stringy = stringy + '_' + formattedDate + '_' + '\r\n'
        stringy = stringy + '*Your order is being processed, please send this message to maintain your receipt.*';
        stringy = stringy + '\r\n\r\n*Coupons Ordered* \r\n\r\n';

        this.purchases.coupons.forEach(coupon => {
          stringy = stringy + coupon.couponQty + ' x ' + coupon.couponName + ' @ Rs ' + coupon.couponPrice + '\r\n';
        });

        // tslint:disable-next-line:max-line-length
        stringy = stringy + '\r\n*Total Quantity is ' + this.purchases.numberOfCoupons + '* \r\n' + '*Amount Payable is Rs ' + this.purchases.total + '*';

        // console.log(stringy);

        const whatsappMessage = (<any>window).encodeURIComponent(stringy);
        const url = 'https://api.whatsapp.com/send?phone=' + this.coupon.whatsappNumber + '&text=' + whatsappMessage;

        this.router.navigate(['success']);

        window.open(url);
      } else {
        this.errorMessage = 'Address is Required!';
      }
    } else {
      this.errorMessage = this.globalOrderingReason;
    }
  }

  navigateTo() {
    this.router.navigate(['coupon', this.coupon.url]);
  }

}
