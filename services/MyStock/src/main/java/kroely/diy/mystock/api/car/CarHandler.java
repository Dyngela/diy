package kroely.diy.mystock.api.car;

import jakarta.validation.Valid;
import kroely.diy.mystock.api.car.request.CreateSingleVehicle;
import kroely.diy.mystock.api.car.response.FindAllCar;
import kroely.diy.mystock.common.GenericApiResponse;
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
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RestController
@RequestMapping("internal/my-stock/api/v1/car")
public class CarHandler {

    CarService carService;

    @GetMapping("/all")
    @RolesAllowed({Roles.ADMIN, Roles.MANAGER})
    public ResponseEntity<List<FindAllCar>> getAllCars() {
        return ResponseEntity.ok(carService.findAll());
    }

    @PostMapping("/")
    public ResponseEntity<GenericApiResponse<Long>> addCar(@Valid @RequestBody CreateSingleVehicle car) {
        return ResponseEntity.ok(carService.createSingleCar(car));
    }

}
