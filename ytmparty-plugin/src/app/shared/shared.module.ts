import {NgModule} from '@angular/core';
import {MaterialModule} from './modules/material.module';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

const SharedModules = [
  CommonModule,
  MaterialModule,
  ReactiveFormsModule,
  FormsModule,
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
