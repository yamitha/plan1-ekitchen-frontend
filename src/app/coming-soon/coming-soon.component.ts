import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-coming-soon',
  templateUrl: './coming-soon.component.html',
  styleUrls: ['./coming-soon.component.scss']
})
export class ComingSoonComponent implements OnInit {

  partners = [{
    img: '/assets/images/logos/ekitchen-alternative.png'
  }, {
    img: '/assets/images/logos/nutribowl.png'
  }, {
    img: '/assets/images/logos/sundaygrills.png'
  }];

  constructor() { }

  ngOnInit() {
  }

}
