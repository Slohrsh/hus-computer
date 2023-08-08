import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HusGridComponent } from './view/hus-grid/hus-grid.component';

const routes: Routes = [
  {
    path: '',
    component: HusGridComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
