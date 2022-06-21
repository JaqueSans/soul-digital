import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(
    private authService: AuthService,
    private toast: HotToastService,
    private router: Router
  ) { }

  email: string = '';
  password: string = '';

  login() {
    this.authService.login(this.email, this.password)
      .pipe(this.toast.observe({
        loading: 'Carregando...',
        success: 'Login realizado',
        error: 'Um erro aconteceu',
      })
      )
      .subscribe(() => {
        this.router.navigate(['/']);
      });
  }

  ngOnInit(): void {
  }

}
