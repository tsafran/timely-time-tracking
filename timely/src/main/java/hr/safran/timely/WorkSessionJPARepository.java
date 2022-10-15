package hr.safran.timely;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface WorkSessionJPARepository extends JpaRepository<WorkSession, Integer> {
    List<WorkSession> findAll();

    @Transactional
    long deleteByName (String name);
}
