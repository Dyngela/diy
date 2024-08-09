import { Component } from '@angular/core';
import {FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule, FormsModule} from '@angular/forms';
import {InputTextModule} from "primeng/inputtext";
import {KeyValuePipe, NgClass, NgForOf, NgIf} from "@angular/common";
import {DropdownModule} from "primeng/dropdown";
import {StatutStockVehicule} from "../../../../../shared-module/core/enums/statutStockVehicule";

@Component({
  selector: 'app-create-vehicule-from-scratch',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    InputTextModule,
    NgForOf,
    NgIf,
    NgClass,
    DropdownModule,
    KeyValuePipe,
    FormsModule,
  ],
  templateUrl: './create-vehicule-from-scratch.component.html',
  styleUrl: './create-vehicule-from-scratch.component.css'
})
export class CreateVehiculeFromScratchComponent {
  vehiculeForm: FormGroup;
  formSubmitted = false;
  statutStockVehicule = StatutStockVehicule;

  constructor(private fb: FormBuilder) {
    this.vehiculeForm = this.fb.group({
      statut: ['', [Validators.required]],
      dateEntree: ['', [Validators.required]],
      origine: ['', [Validators.required]],
      immatriculation: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(7)]],
      departement: ['', [Validators.required]],
      vin: ['', [Validators.required]],
      dateMiseEnCirculation: ['', [Validators.required]],
      marque: ['', [Validators.required]],
      modele: ['', [Validators.required]],
      version: ['', [Validators.required]],
    });
  }

  onSubmit() {
    this.formSubmitted = true;
    if (this.vehiculeForm.valid) {
      console.log(this.vehiculeForm.value);
    }
  }

  addOption() {
    this.options.push(this.fb.group({
      name: ['', []]
    }));
  }

  addPhoto() {
    this.photos.push(this.fb.group({
      path: ['', []],
      description: ['', []]
    }));
  }

  addAvarie() {
    this.avaries.push(this.fb.group({
      description: ['', []],
      price: [null, []],
      path: ['', []]
    }));
  }

  get options(): FormArray {
    return this.vehiculeForm.get('options') as FormArray;
  }

  get photos(): FormArray {
    return this.vehiculeForm.get('photos') as FormArray;
  }

  get avaries(): FormArray {
    return this.vehiculeForm.get('avaries') as FormArray;
  }

}

// new FormControl<Reduction[]>([])
