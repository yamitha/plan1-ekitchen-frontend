import { UserService } from './../_services/user.service';
import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit {

  user;

  constructor(
    private af: AngularFireAuth,
    private afDatabase: AngularFireDatabase,
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService
  ) {
    this.user = this.userService.getUser();
  }

  ngOnInit() {
  }

}
