export interface CreateSingleVehicle {
  numeroPolice: string;
  immat: string;
  chassis: string;
  annee: number;
  date1Mec: Date;
  marque: string;
  modele: string;
  energie: string;
  puissanceFiscale: string;
  puissanceReelle: string;
  nbPlaces: string;
  nbPortes: string;
  kilometrage: number;
  couleurInterieur: string;
  boite: string;
  nbRapports: string;
  prixVenteTTC: number;
  TVA: number;
  premiereMain: boolean;
  garantie: string;
  categorie: string;
  co2: string;
  ptac: string;
  longueur: number;
  largeur: number;
  empattement: string;
  hauteur: string;
  volume: number;
  serie: string;
  carrosserie: string;
  genre: string;
  dureeGarantie: string;
  totalFraisEstimes: number;
  totalFraisReels: number;
  codeGarantie: string;
  cylindree: string;
  origine: string;
  malus: number;
  critair: string;
  prixMarche: string;
  version: string;
  couple: string;
  nombreCylindres: string;
  propulsion: string;
  vitesseMax: string;
  acceleration: string;
  volumeMax: number;
  poidsTotal: number;
  poidsVide: number;
  capaciteReservoir: number;
  nbAirbag: number;
  couleurExterieur: string;
  sellerie: string;
  consoTrafficMixte: number;
  consoTrafficUrbain: number;
  consoTrafficExtraUrbain: number;
  dateCarteGrise: Date;
  dateDernierCT: Date;

  options: CreateOption[];
  photos: CreatePhoto[];
  avaries: CreateAvarie[];
}

export interface CreateOption {
  name: string;
}

export interface CreatePhoto {
  path: string;
  description: string;
}

export interface CreateAvarie {
  description: string;
  price: number;
  path: string;
}
