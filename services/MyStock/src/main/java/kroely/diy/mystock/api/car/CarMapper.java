package kroely.diy.mystock.api.car;

import kroely.diy.mystock.api.car.response.FindAllCar;
import kroely.diy.mystock.mapper_utils.CycleAvoidingMappingContext;
import org.mapstruct.*;

import java.util.List;

@Mapper(unmappedSourcePolicy = ReportingPolicy.IGNORE, unmappedTargetPolicy = ReportingPolicy.IGNORE,
        typeConversionPolicy = ReportingPolicy.ERROR, componentModel = MappingConstants.ComponentModel.SPRING)
public interface CarMapper {
    List<FindAllCar> entitiesToDtos(List<CarEntity> entities, @Context CycleAvoidingMappingContext context);
}
