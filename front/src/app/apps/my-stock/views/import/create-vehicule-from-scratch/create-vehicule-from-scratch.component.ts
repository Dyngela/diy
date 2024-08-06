import { Component } from '@angular/core';
import {FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule} from '@angular/forms';
import {InputTextModule} from "primeng/inputtext";
import {NgForOf} from "@angular/common";

@Component({
  selector: 'app-create-vehicule-from-scratch',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    InputTextModule,
    NgForOf
  ],
  templateUrl: './create-vehicule-from-scratch.component.html',
  styleUrl: './create-vehicule-from-scratch.component.css'
})
export class CreateVehiculeFromScratchComponent {
  vehiculeForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.vehiculeForm = this.fb.group({
      numeroPolice: ['', [Validators.required]],
      immat: ['', [Validators.required]],
      chassis: ['', [Validators.required]],
      annee: [null, []],
      date1Mec: [null, []],
      marque: ['', []],
      modele: ['', []],
      energie: ['', []],
      puissanceFiscale: ['', []],
      puissanceReelle: ['', []],
      nbPlaces: ['', []],
      nbPortes: ['', []],
      kilometrage: [null, []],
      couleurInterieur: ['', []],
      boite: ['', []],
      nbRapports: ['', []],
      prixVenteTTC: [null, []],
      TVA: [null, []],
      premiereMain: [false, []],
      garantie: ['', []],
      categorie: ['', []],
      co2: ['', []],
      ptac: ['', []],
      longueur: [null, []],
      largeur: [null, []],
      empattement: ['', []],
      hauteur: ['', []],
      volume: [null, []],
      serie: ['', []],
      carrosserie: ['', []],
      genre: ['', []],
      dureeGarantie: ['', []],
      totalFraisEstimes: [null, []],
      totalFraisReels: [null, []],
      codeGarantie: ['', []],
      cylindree: ['', []],
      origine: ['', []],
      malus: [null, []],
      critair: ['', []],
      prixMarche: ['', []],
      version: ['', []],
      couple: ['', []],
      nombreCylindres: ['', []],
      propulsion: ['', []],
      vitesseMax: ['', []],
      acceleration: ['', []],
      volumeMax: [null, []],
      poidsTotal: [null, []],
      poidsVide: [null, []],
      capaciteReservoir: [null, []],
      nbAirbag: [null, []],
      couleurExterieur: ['', []],
      sellerie: ['', []],
      consoTrafficMixte: [null, []],
      consoTrafficUrbain: [null, []],
      consoTrafficExtraUrbain: [null, []],
      dateCarteGrise: [null, []],
      dateDernierCT: [null, []],
      options: this.fb.array([]),
      photos: this.fb.array([]),
      avaries: this.fb.array([])
    });
  }

  onSubmit() {

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
