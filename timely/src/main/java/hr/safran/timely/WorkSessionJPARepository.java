package hr.safran.timely;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface WorkSessionJPARepository extends JpaRepository<WorkSession, Integer> {
    List<WorkSession> findAll();
}
