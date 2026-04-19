import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthRoutingModule } from './auth-routing.module';

@NgModule({
  imports: [AuthRoutingModule, RouterModule]
})
export class AuthModule {}