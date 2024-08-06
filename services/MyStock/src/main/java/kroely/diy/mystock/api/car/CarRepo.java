package kroely.diy.mystock.api.car;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CarRepo extends JpaRepository<CarEntity, Long> {
    List<CarEntity> findAllByDeletedAtIsNull();
}
