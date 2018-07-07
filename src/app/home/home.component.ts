import { DataService } from './../data.service';
import { RouterModule, ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';

import * as firebase from 'firebase'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  kitchensRef: firebase.database.Reference;
  kitchensList: FirebaseListObservable<any>;
  onlineOrdering: FirebaseObjectObservable<any>;

  globalOrdering = true;
  globalOrderingReason = '';

  constructor(
    private route: ActivatedRoute,
    private data: DataService,
    private router: Router,
    private afDb: AngularFireDatabase,
    titleService: Title,
  ) {
    router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        const title = this.getTitle(router.routerState, router.routerState.root).join('-');
        titleService.setTitle(title);
      }
    });

    this.kitchensList = this.afDb.list('kitchens', {preserveSnapshot: true});
    this.onlineOrdering = this.afDb.object('onlineOrdering', {preserveSnapshot: true});

    this.onlineOrdering.subscribe(value => {
      this.globalOrdering = value.val().globalOrdering;
      this.globalOrderingReason = value.val().globalOrderingReason;
    })

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
}
