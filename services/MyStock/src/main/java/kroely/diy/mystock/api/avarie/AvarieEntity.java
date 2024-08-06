package kroely.diy.mystock.api.avarie;

import jakarta.persistence.*;
import kroely.diy.mystock.api.car.CarEntity;
import lombok.*;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.experimental.FieldDefaults;

@Entity
@Setter
@Getter
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "avarie")
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AvarieEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", unique = true, nullable = false)
    Long id;

    @Column(name = "path")
    String path;

    @Column(name = "zone")
    String zone;

    @Column(name = "price")
    float price;

    @ManyToOne
    @JoinColumn(name = "car_id")
    CarEntity car;
}
