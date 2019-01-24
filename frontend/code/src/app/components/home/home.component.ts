import { Component, OnInit } from '@angular/core';
import { SessionService } from '../../services/session.service';
import { Router } from '@angular/router';
import { RoleGroups } from './user-list/roles';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  roleGroups = RoleGroups;
  isCollapsed = false;
  constructor(public readonly session: SessionService, private readonly router: Router) {}

  ngOnInit() {}

  logout() {
    this.session.logout();
    this.router.navigate(['/login']);
  }

  modifyProfile() {
    this.router.navigate(['/home/user']);
  }
}
