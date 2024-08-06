import {LOCALE_ID, NgModule} from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import {RouterModule} from "@angular/router";
import {MessageService} from "primeng/api";
import {ToastModule} from "primeng/toast";
import {ConfirmDialogModule} from "primeng/confirmdialog";



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule,
    NgOptimizedImage,
    ToastModule,
    ConfirmDialogModule,
  ],
  providers: [
    {provide: LOCALE_ID, useValue: 'fr' },
    {provide: MessageService,},
  ],
})
export class SharedModuleModule { }
