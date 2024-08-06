package kroely.diy.mystock.api.photo;

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
@Table(name = "photo")
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PhotoEntity {

        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        @Column(name = "id", unique = true, nullable = false)
        Long id;

        @Column(name = "path")
        String path;

        @Column(name = "description")
        String description;

        @ManyToOne
        @JoinColumn(name = "car_id")
        CarEntity car;
}
