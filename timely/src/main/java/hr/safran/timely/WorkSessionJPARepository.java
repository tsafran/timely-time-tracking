package hr.safran.timely;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

public interface WorkSessionJPARepository extends JpaRepository<WorkSession, Integer> {
    List<WorkSession> findAllByOrderByStartTimeDesc();

    Optional<WorkSession> findByName (String name);

    Optional<WorkSession> findById (Integer id);

    @Transactional
    long deleteByName (String name);
}
