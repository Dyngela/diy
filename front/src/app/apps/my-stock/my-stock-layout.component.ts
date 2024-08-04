import { Component } from '@angular/core';
import {RouterLink, RouterOutlet} from "@angular/router";
import {NgOptimizedImage} from "@angular/common";
import {NavbarComponent} from "./views/navbar/navbar.component";

@Component({
  selector: 'app-my-stock-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    NgOptimizedImage,
    NavbarComponent
  ],
  templateUrl: './my-stock-layout.component.html',
  styleUrl: './my-stock-layout.component.css'
})
export class MyStockLayoutComponent {
}
