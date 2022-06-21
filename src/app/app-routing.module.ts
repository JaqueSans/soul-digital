import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './components/admin/admin.component';
import { LoginComponent } from './components/login/login.component';
import { hasCustomClaim, canActivate } from '@angular/fire/auth-guard/';
import { InfluencersComponent } from './components/influencers/influencers.component';

const superOnly = () => hasCustomClaim('super');
const adminOnly = () => hasCustomClaim('admin');

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'admin', component: AdminComponent, ...canActivate(superOnly) },
  {
    path: 'influencers',
    component: InfluencersComponent,
    ...canActivate(adminOnly),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}