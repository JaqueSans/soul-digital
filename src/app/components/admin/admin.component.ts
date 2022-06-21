import { Component, OnInit } from '@angular/core';
import { EMPTY, Observable } from 'rxjs';
import { Admin } from 'src/app/models/admin';
import { AdminService } from 'src/app/services/admin/admin.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  constructor(
    private adminService: AdminService
  ) { }

  admin: Admin = {} as Admin;
  admins$: Observable<Admin[]> = EMPTY;

  addAdmin(){
    this.adminService.addAdmin(this.admin).subscribe();
  }

  delete(admin: Admin){
    this.adminService.deleteAdmin(admin).subscribe();
  }

  ngOnInit(): void {
    this.admins$ = this.adminService.getAdmins();
  }

}
