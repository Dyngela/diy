package kroely.diy.mystock.api.car;

import kroely.diy.mystock.api.car.response.FindAllCar;
import kroely.diy.mystock.security.Roles;
import kroely.diy.mystock.security.RolesAllowed;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.log4j.Log4j2;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RestController
@RequestMapping("apps/my-stock/api/v1/car")
public class CarHandler {

    CarService carService;

    @GetMapping("/all")
    @RolesAllowed({Roles.ADMIN, Roles.MANAGER})
    public ResponseEntity<List<FindAllCar>> getAllCars() {
        return ResponseEntity.ok(carService.findAll());
    }

    @GetMapping("/ez")
    public ResponseEntity<List<FindAllCar>> ez() {
        log.warn("Getting all cars");

        return ResponseEntity.ok(carService.findAll());
    }
}
