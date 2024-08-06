import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MyStockRoutingModule} from "./my-stock.routing.module";
import {SharedModuleModule} from "../../shared-module/shared-module.module";
import {appConfig} from "../../app.config";



@NgModule({
  declarations: [

  ],
  imports: [
    CommonModule,
    MyStockRoutingModule,
    SharedModuleModule,
  ],
  providers: [
    appConfig.providers
  ],
})
export class MyStockModule { }
