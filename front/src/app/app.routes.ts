import { Routes } from '@angular/router';
import {MainMenuComponent} from "./shared-module/components/main-menu/main-menu.component";
import {MyStockLayoutComponent} from "./apps/my-stock/my-stock-layout.component";
import {ConnectLayoutComponent} from "./apps/connect/connect-layout.component";
import {isConnectedGuard} from "./shared-module/core/services/auth.guard";

export const routes: Routes = [
  {path: '', component: MainMenuComponent},

  {path: 'connect',
    component: ConnectLayoutComponent,
    loadChildren: () => import('./apps/connect/connect.module').then(m => m.ConnectModule)},

  {path: 'my-stock',
    component: MyStockLayoutComponent,
    canActivate: [isConnectedGuard],
    loadChildren: () => import('./apps/my-stock/my-stock.module').then(m => m.MyStockModule)},
];
