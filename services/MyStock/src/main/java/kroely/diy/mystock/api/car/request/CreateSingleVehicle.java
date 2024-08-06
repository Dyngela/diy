package kroely.diy.mystock.api.car.request;

import kroely.diy.mystock.api.avarie.request.CreateAvarie;
import kroely.diy.mystock.api.car_options.request.CreateOption;
import kroely.diy.mystock.api.photo.request.CreatePhoto;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CreateSingleVehicle {

    String numeroPolice;
    String immat;
    String chassis;
    int annee;
    LocalDateTime date1Mec;
    String marque;
    String modele;
    String energie;
    String puissanceFiscale;
    String puissanceReelle;
    String nbPlaces;
    String nbPortes;
    float kilometrage;
    String couleurInterieur;
    String boite;
    String nbRapports;
    float prixVenteTTC;
    float TVA;
    boolean premiereMain;
    String garantie;
    String categorie;
    String co2;
    String ptac;
    float longueur;
    float largeur;
    String empattement;
    String hauteur;
    float volume;
    String serie;
    String carrosserie;
    String genre;
    String dureeGarantie;
    float totalFraisEstimes;
    float totalFraisReels;
    String codeGarantie;
    String cylindree;
    String origine;
    float malus;
    String critair;
    String prixMarche;
    String version;
    String couple;
    String nombreCylindres;
    String propulsion;
    String vitesseMax;
    String acceleration;
    float volumeMax;
    float poidsTotal;
    float poidsVide;
    float capaciteReservoir;
    float nbAirbag;
    String couleurExterieur;
    String sellerie;
    float consoTrafficMixte;
    float consoTrafficUrbain;
    float consoTrafficExtraUrbain;
    LocalDateTime dateCarteGrise;
    LocalDateTime dateDernierCT;

    List<CreateOption> options;
    List<CreatePhoto> photos;
    List<CreateAvarie> avaries;
}
