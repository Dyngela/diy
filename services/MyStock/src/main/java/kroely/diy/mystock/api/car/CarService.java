package kroely.diy.mystock.api.car;

import kroely.diy.mystock.api.car.response.FindAllCar;
import kroely.diy.mystock.mapper_utils.CycleAvoidingMappingContext;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Log4j2
public class CarService {

    CarRepo carRepo;
    CarMapper carMapper;

    public List<FindAllCar> findAll() {
        return carMapper.entitiesToDtos(carRepo.findAll(), new CycleAvoidingMappingContext());
    }
}
