import {NgModule} from '@angular/core';
import {MaterialModule} from '@shared/modules/material.module';
import {FlexLayoutModule} from '@angular/flex-layout';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {MomentModule} from 'ngx-moment';

const SharedModules = [
  CommonModule,
  FlexLayoutModule,
  MaterialModule,
  ReactiveFormsModule,
  RouterModule,
  FormsModule,
  MomentModule,
];

@NgModule({
  imports: [
    ...SharedModules,
  ],
  exports: [
    ...SharedModules,
  ],
})
export class SharedModule {
}
