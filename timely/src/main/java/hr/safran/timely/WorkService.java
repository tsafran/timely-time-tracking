package hr.safran.timely;

import java.util.List;
import java.util.Optional;

public interface WorkService {
    List<WorkSessionDTO> findAll();
    Optional<WorkSessionDTO> save(WorkSession workSession);
    long deleteByName(String name);
}