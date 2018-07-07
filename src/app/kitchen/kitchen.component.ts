import { UserService } from './../_services/user.service';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import { DataService } from './../data.service';
import { RouterModule, ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-kitchen',
  templateUrl: './kitchen.component.html',
  styleUrls: ['./kitchen.component.scss']
})
export class KitchenComponent implements OnInit {

  cart = {
    items: [],
    numberOfItems: 0,
    total: 0,
  };

  kitchenUrl = '';
  kitchenItems = [];

  loggedIn;

  constructor(
    private route: ActivatedRoute,
    private data: DataService,
    private router: Router,
    private afDb: AngularFireDatabase,
    titleService: Title,
    private afAuth: AngularFireAuth,
    private userService: UserService
  ) {

    // Getting the page title from the routing.module and then setting it from the component
    router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        const title = this.getTitle(router.routerState, router.routerState.root).join('-');
        titleService.setTitle(title);
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

    // Getting the parameters from the url and then setting it to the kitchen url
    this.route.params.subscribe((params) => {
      if (params['name']) {
        this.kitchenUrl = params['name'];
      };
    });

    // getting the list of items in the db
    const itemsList = this.afDb.list('items', { preserveSnapshot: true });

    // Pushing the items matching the kitchen url into the kitchen items
    itemsList.forEach(snapshots => {
      snapshots.forEach(snapshot => {
        if (this.kitchenUrl === snapshot.val().kitchenUrl) {
          this.kitchenItems.push({
            itemId: snapshot.key,
            itemImg: snapshot.val().imageUrl,
            itemName: snapshot.val().itemName,
            itemPrice: snapshot.val().price,
            itemDescription: snapshot.val().description,
            itemQtyInCart: 0,
          });
        }
      });
    });

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


  // Adding to cart
  addToCart(item) {
    // Increasing qty in frontend
    item.itemQtyInCart++;

    let i = -99;

    // check if items exist in the cart already, if it does get the index
    i = this.containsObject(item, this.cart.items);

    if (i !== -99) {
      // match item to index and increment the qty
      // console.log('item matched ' + item.itemName)
      this.cart.items[i].itemQty++;
    } else {
      // add a new item to the cart
      this.cart.items.push({ itemId: item.itemId, itemImg: item.itemImg, itemName: item.itemName, itemQty: 1, itemPrice: item.itemPrice });
    }

    // Run the total calculations
    this.runCalculation();
    // console.log(this.cart);
  }

  // removing item from cart
  removeFromCart(item) {
    const i = this.containsObject(item, this.cart.items);

    if (i !== -99) {
      // updating frontend
      item.itemQtyInCart--;
      this.cart.items[i].itemQty--;

      if (this.cart.items[i].itemQty === 0) {
        this.cart.items.splice(i, 1);
      }

      this.runCalculation();
    }
  }

  // Running the total cost calculations
  runCalculation() {
    this.cart.numberOfItems = 0;
    this.cart.total = 0;

    this.cart.items.forEach(item => {
      this.cart.numberOfItems += item.itemQty;
      this.cart.total += item.itemPrice * item.itemQty;
    });
  }

  // Check if the object exists in the list
  containsObject(obj, list) {
    let i;
    for (i = 0; i < list.length; i++) {
      if (list[i].itemId === obj.itemId) {
        return i;
      }
    }
    return -99;
  }

  // got to checkout page
  checkout() {
    if (this.loggedIn) {
      this.data.changeCart(this.cart);
      this.router.navigate(['/checkout', this.kitchenUrl]);
    } else {
      this.router.navigate(['/signup']);
    }
  }

}
