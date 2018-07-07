import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-corporate',
  templateUrl: './corporate.component.html',
  styleUrls: ['./corporate.component.scss']
})
export class CorporateComponent implements OnInit {

  selectedDate: any;
  selectedVegetable: any;
  selectedChicken: any;
  selectedFish: any;
  selectedGreens: any;

  vegetables = [
    {name: 'Beans curry'},
    {name: 'Potato curry'},
    {name: 'Pumpkin curry'},
    {name: 'Capsicum and brinjal curry '},
    {name: 'Mango curry '},
    {name: 'Ambarella curry '},
    {name: 'Beetroot curry '},
    {name: 'Ashpantain curry '},
    {name: 'Manioc curry'},
    {name: 'Mix vegetables curry '},
    {name: 'Bittergrod curry'},
    {name: 'Cabbage curry'},
    {name: 'Ladies fingers curry'},
    {name: 'Kankun curry'},
    {name: 'Cauliflower tempered '},
    {name: 'Radish tempered'},
    {name: 'Spring onion tempered '},
    {name: 'Pollos curry '},
    {name: 'Radish tempered '},
    {name: 'Potato tempered'},
    {name: 'Cabbage tampered'}
  ];

  chicken = [
    {name: 'Stew chiken'},
    {name: 'Pepper chicken '},
    {name: 'Savory chicken curry'},
    {name: 'Chicken yellow curry '},
    {name: 'Chicken red curry '},
    {name: 'Chicken black curry '},
    {name: 'Cashew curry '},
    {name: 'Oregon chicken curry '},
    {name: 'Mutton kurma '},
    {name: 'Chicken curry kg'},
    {name: 'Lahore chicken curry '},
    {name: 'Chicken deep fry curry'}
  ];

  fish = [
    {name: 'Pepper fish'},
    {name: 'Fish stew'},
    {name: 'Savory fish curry'},
    {name: 'Fish yellow curry'},
    {name: 'Fish curry'},
    {name: 'Fish black curry'},
    {name: 'Fish and cashew curry'},
    {name: 'Oregano fish curry'},
    {name: 'Lahore fish curry'},
    {name: 'Fish deep fry curry'}
  ];

  greens = [
    {name: 'Raitha salads'},
    {name: 'Cucumber salads'},
    {name: 'Snakegroud salad'},
    {name: 'Brinjal salad'},
    {name: 'Bittergrod'},
    {name: 'Cabbage salad'},
    {name: 'Sri lankan achcharu'},
    {name: 'Jack fruit salad '},
    {name: 'Carrot selad'},
    {name: 'onions and green chilly salad '},
    {name: 'Mukunuana'},
    {name: 'Gottukola'}
  ];

  constructor(private route: ActivatedRoute, private router: Router, titleService: Title) {
    router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        const title = this.getTitle(router.routerState, router.routerState.root).join('-');
        console.log('title', title);
        titleService.setTitle(title);
      }
    });
  }

  ngOnInit() {
  }

  checkout() {
    console.log(this.selectedVegetable);
    let stringy = '';
    const number = '94777740273';

    const selectedDate = new Date(this.selectedDate);
    const dd = selectedDate.getDate();
    const mm = selectedDate.getMonth() + 1; // Jan is 0

    const yyyy = selectedDate.getFullYear();

    if (dd < 10) {
      const newDD = '0' + dd.toString();
    }

    if ( mm < 10) {
      const newMM = '0' + mm.toString();
    }

    const formattedDate = dd + '/' + mm + '/' + yyyy;

    // stringy = stringy + '_' + formattedDate + '_' + '\r\n\r\n'
    stringy = stringy + '*Rice & Curry Required for ' + formattedDate + '*\r\n\r\n';
    stringy = stringy + 'Vegetables = ' + this.selectedVegetable + '\r\n';
    stringy = stringy + 'Chicken = ' + this.selectedChicken + '\r\n';
    stringy = stringy + 'Fish = ' + this.selectedFish + '\r\n';
    stringy = stringy + 'Green Salads = ' + this.selectedGreens;

    const whatsappMessage = (<any>window).encodeURIComponent(stringy);
    const url = 'https://api.whatsapp.com/send?phone=' + number + '&text=' + whatsappMessage;

    window.open(url);
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

}
