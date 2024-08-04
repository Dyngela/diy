import { Component } from '@angular/core';
import {RouterOutlet} from "@angular/router";
import {FormsModule} from "@angular/forms";
import {ToastModule} from "primeng/toast";

@Component({
  selector: 'app-connect-layout',
  standalone: true,
    imports: [
        RouterOutlet,
        FormsModule,
        ToastModule
    ],
  templateUrl: './connect-layout.component.html',
  styleUrl: './connect-layout.component.css'
})
export class ConnectLayoutComponent {

}
