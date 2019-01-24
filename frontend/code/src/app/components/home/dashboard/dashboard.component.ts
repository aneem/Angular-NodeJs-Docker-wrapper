import { Component, OnInit } from '@angular/core';
import { SessionService } from '../../../services/session.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  constructor(public session: SessionService, private readonly router: Router) {}
  ngOnInit() {
    if (this.session.isAdmin || this.session.isUserManager) {
      this.router.navigateByUrl('/home/user-list');
    }
  }
}
