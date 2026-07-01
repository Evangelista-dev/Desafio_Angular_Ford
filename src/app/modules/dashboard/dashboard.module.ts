import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';

@NgModule({
  declarations: [
    DashboardComponent // Declarado no módulo, sem a flag standalone!
  ],
  imports: [
    CommonModule,        // Habilita as diretivas *ngIf e *ngFor
    FormsModule,         // Habilita bindings padrão
    ReactiveFormsModule, // Habilita os FormControls para os operadores RxJS
    DashboardRoutingModule
  ]
})
export class DashboardModule { }
