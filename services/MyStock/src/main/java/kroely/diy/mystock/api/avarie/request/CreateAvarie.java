package kroely.diy.mystock.api.avarie.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CreateAvarie {
    String path;
    String zone;
    float price;
}
