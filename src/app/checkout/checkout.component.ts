import { UserService } from './../_services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from './../data.service';
import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase, FirebaseObjectObservable, FirebaseListObservable } from 'angularfire2/database';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {

  user;
  kitchen = {
    url: '',
    id: '',
    image: '',
    whatsappNumber: '',
    name: ''
  }

  cart = {
    items: [],
    numberOfItems: 0,
    total: 0
  };

  kitchens: FirebaseListObservable<any>;
  orders: FirebaseListObservable<any>;

  kitchenOrders = [];
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
        this.kitchen.url = params['name'];
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
    this.orders = this.afDb.list('orders', {preserveSnapshot: true});

    this.kitchens = this.afDb.list('kitchens/' + this.kitchen.id, {preserveSnapshot: true});

    // Matching kitchen
    const kitchens = this.afDb.list('kitchens', {preserveSnapshot: true});

    // This could be more efficent
    kitchens.forEach(snapshots => {
      for (let i = 0; i < snapshots.length; i++) {
        if (snapshots[i].val().url === this.kitchen.url) {
          this.kitchen.id = snapshots[i].key;
          this.kitchen.image = snapshots[i].val().logoUrl;
          this.kitchen.whatsappNumber = snapshots[i].val().whatsappNumber;
          this.kitchen.name = snapshots[i].val().kitchenName;
          break;
        }
      }
    });


    const kitchenFirebaseOrders = this.afDb.list('kitchens/' + this.kitchen.id + '/orders', {preserveSnapshot: true});
    const customerFirebaseOrders = this.afDb.list('customers/' + this.user.userId + '/orders', {preserveSnapshot: true});

    kitchenFirebaseOrders.subscribe(values => {
      values.forEach(element => {
        this.kitchenOrders.push(element.val());
      });
    })

    customerFirebaseOrders.subscribe(values => {
      values.forEach(element => {
        this.customerOrders.push(element.val());
      });
    })
};

  ngOnInit() {
    this.data.currentCart.subscribe(cart => this.cart = cart);
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
          deliveryAddress: this.user.address,
          customerContactNumber: this.user.contactNumber,
          kitchenId: this.kitchen.id,
          kitchenName: this.kitchen.name,
          kitchenWhatsappNumber: this.kitchen.whatsappNumber,
          items: this.cart.items,
          numberOfItems: this.cart.numberOfItems,
          orderTotal: this.cart.total,
          cancelled: false,
          reasonForCancelling: '',
          completed: false,
          paymentMethod: 'Cash',
          paid: false,
          transactionAmount: 0
        }

        // Sending to server
        this.orders.push(order).then(addedOrder => {
          this.kitchenOrders.push(addedOrder.key);
          this.customerOrders.push(addedOrder.key);

          this.afDb.object('kitchens/' + this.kitchen.id).update({orders: this.kitchenOrders}).then(res => {});
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
        stringy = stringy + '\r\n\r\n*Items Ordered* \r\n\r\n';

        this.cart.items.forEach(item => {
          stringy = stringy + item.itemQty + ' x ' + item.itemName + ' @ Rs ' + item.itemPrice + '\r\n';
        });

        // tslint:disable-next-line:max-line-length
        stringy = stringy + '\r\n*Total Quantity is ' + this.cart.numberOfItems + '* \r\n' + '*Amount Payable is Rs ' + this.cart.total + '*';

        // console.log(stringy);

        const whatsappMessage = (<any>window).encodeURIComponent(stringy);
        const url = 'https://api.whatsapp.com/send?phone=' + this.kitchen.whatsappNumber + '&text=' + whatsappMessage;

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
    this.router.navigate(['kitchen', this.kitchen.url]);
  }

}
