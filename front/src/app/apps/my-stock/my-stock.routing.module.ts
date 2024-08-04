import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {
  CreateVehiculeFromScratchComponent
} from "./views/import/create-vehicule-from-scratch/create-vehicule-from-scratch.component";
import {IdentificationCallComponent} from "./views/import/identification-call/identification-call.component";
import {AutoImportComponent} from "./views/import/auto-import/auto-import.component";
import {MainPageComponent} from "./views/main-page/main-page.component";

const routes: Routes = [
  {path: 'accueil', component: MainPageComponent},
  {path: 'import/create', component: CreateVehiculeFromScratchComponent},
  {path: 'import/identification', component: IdentificationCallComponent},
  {path: 'import/auto-import', component: AutoImportComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MyStockRoutingModule { }
