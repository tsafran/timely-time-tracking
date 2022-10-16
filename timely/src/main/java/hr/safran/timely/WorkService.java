package hr.safran.timely;

import java.util.List;
import java.util.Optional;

public interface WorkService {
    List<WorkSessionDTO> findAll();

    Optional<WorkSession> findByName (String name);

    Optional<WorkSession> findById (Integer id);

    Optional<WorkSessionDTO> save(WorkSession workSession);

    Optional<WorkSessionDTO> update(WorkSession workSession);

    long deleteByName(String name);
}