package kroely.diy.mystock.api.car_options;

import jakarta.persistence.*;
import kroely.diy.mystock.api.car.CarEntity;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Entity
@Setter
@Getter
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "option")
@FieldDefaults(level = AccessLevel.PRIVATE)
public class OptionEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", unique = true, nullable = false)
    Long id;

    @Column(name = "name")
    String name;

    @ManyToOne
    @JoinColumn(name = "car_id")
    CarEntity car;
}
