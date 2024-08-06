package kroely.diy.mystock.api.car;

import jakarta.persistence.*;
import kroely.diy.mystock.api.avarie.AvarieEntity;
import kroely.diy.mystock.api.car_options.OptionEntity;
import kroely.diy.mystock.api.photo.PhotoEntity;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Setter
@Getter
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "car")
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CarEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", unique = true, nullable = false)
    Long id;

    @Column(name = "numero_police")
    String numeroPolice;

    @Column(name = "immat")
    String immat;

    @Column(name = "chassis")
    String chassis;

    @Column(name = "annee")
    int annee;

    @Column(name = "date_premiere_mec")
    LocalDateTime date1Mec;

    @Column(name = "marque")
    String marque;

    @Column(name = "modele")
    String modele;

    @Column(name = "energie")
    String energie;

    @Column(name = "puissance_fiscale")
    String puissanceFiscale;

    @Column(name = "puissance_reelle")
    String puissanceReelle;

    @Column(name = "nb_places")
    String nbPlaces;

    @Column(name = "nb_portes")
    String nbPortes;

    @Column(name = "kilometrage")
    float kilometrage;

    @Column(name = "couleur_interieur")
    String couleurInterieur;

    @Column(name = "boite")
    String boite;

    @Column(name = "nb_rapports")
    String nbRapports;

    @Column(name = "prix_vente_TTC")
    float prixVenteTTC;

    @Column(name = "TVA")
    float TVA;

    @Column(name = "premiere_main")
    boolean premiereMain;

    @Column(name = "garantie")
    String garantie;

    @Column(name = "categorie")
    String categorie;

    @Column(name = "co2")
    String co2;

    @Column(name = "PTAC")
    String ptac;

    @Column(name = "longueur")
    float longueur;

    @Column(name = "largeur")
    float largeur;

    @Column(name = "empattement")
    String empattement;

    @Column(name = "hauteur")
    String hauteur;

    @Column(name = "volume")
    float volume;

    @Column(name = "serie")
    String serie;

    @Column(name = "carrosserie")
    String carrosserie;

    @Column(name = "genre")
    String genre;

    @Column(name = "duree_garantie")
    String dureeGarantie;

    @Column(name = "total_frais_estimes")
    float totalFraisEstimes;

    @Column(name = "total_frais_reels")
    float totalFraisReels;

    @Column(name = "code_garantie")
    String codeGarantie;

    @Column(name = "cylindree")
    String cylindree;

    @Column(name = "origine")
    String origine;

    @Column(name = "malus")
    float malus;

    @Column(name = "critair")
    String critair;

    @Column(name = "prix_marche")
    String prixMarche;

    @Column(name = "version")
    String version;

    @Column(name = "couple")
    String couple;

    @Column(name = "nombre_cylindres")
    String nombreCylindres;

    @Column(name = "propulsion")
    String propulsion;

    @Column(name = "vitesse_max")
    String vitesseMax;

    @Column(name = "acceleration")
    String acceleration;

    @Column(name = "volume_max")
    float volumeMax;

    @Column(name = "poids_total")
    float poidsTotal;

    @Column(name = "poids_vide")
    float poidsVide;

    @Column(name = "capacite_reservoir")
    float capaciteReservoir;

    @Column(name = "nb_airbag")
    float nbAirbag;

    @Column(name = "couleur_exterieur")
    String couleurExterieur;

    @Column(name = "sellerie")
    String sellerie;

    @Column(name = "conso_traffic_mixte")
    float consoTrafficMixte;

    @Column(name = "conso_traffic_urbain")
    float consoTrafficUrbain;

    @Column(name = "conso_traffic_extra_urbain")
    float consoTrafficExtraUrbain;

    @Column(name = "date_carte_grise")
    LocalDateTime dateCarteGrise;

    @Column(name = "date_dernier_ct")
    LocalDateTime dateDernierCT;

    @Column(name = "created_at")
    LocalDateTime createdAt;

    @Column(name = "updated_at")
    LocalDateTime updatedAt;

    @Column(name = "deleted_at")
    LocalDateTime deletedAt;

    @OneToMany(mappedBy = "car")
    List<OptionEntity> options;

    @OneToMany(mappedBy = "car")
    List<PhotoEntity> photos;

    @OneToMany(mappedBy = "car")
    List<AvarieEntity> avaries;

}
