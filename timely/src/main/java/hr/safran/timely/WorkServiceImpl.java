package hr.safran.timely;

import org.springframework.stereotype.Service;

import java.text.SimpleDateFormat;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class WorkServiceImpl implements WorkService{

    private final WorkSessionJPARepository workSessionJPARepository;

    public WorkServiceImpl (WorkSessionJPARepository workSessionJPARepository) {
        this.workSessionJPARepository = workSessionJPARepository;
    }

    @Override
    public List<WorkSessionDTO> findAll() {
        return workSessionJPARepository.findAll().stream()
                .map(this::mapWorkSessionToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public Optional<WorkSession> findByName(String name) {
        return workSessionJPARepository.findByName(name);
    }

    @Override
    public Optional<WorkSession> findById(Integer id) {
        return workSessionJPARepository.findById(id);
    }

    @Override
    public Optional<WorkSessionDTO> save(WorkSession workSession) {
        Optional<WorkSession> newSession = findByName(workSession.getName());
        if (newSession.isEmpty()) {
            return Optional.of(workSessionJPARepository.save(workSession)).map(this::mapWorkSessionToDTO);
        }
        return Optional.empty();
    }

    @Override
    public Optional<WorkSessionDTO> update(WorkSession workSession) {
        Optional<WorkSession> sessionToUpdate = findById(workSession.getId());
        if (sessionToUpdate.isPresent()) {
            WorkSession updatedSession = new WorkSession(sessionToUpdate.get().getId(), workSession.getName(), workSession.getStartTime(), workSession.getEndTime());
            return Optional.of(workSessionJPARepository.save(updatedSession)).map(this::mapWorkSessionToDTO);
        }
        return Optional.empty();
    }

    @Override
    public long deleteByName(String name) {
        return workSessionJPARepository.deleteByName(name);
    }

    SimpleDateFormat dateFormat = new SimpleDateFormat("dd.MM.yyyy HH:mm");
    private WorkSessionDTO mapWorkSessionToDTO (final WorkSession workSession) {
        return new WorkSessionDTO(workSession.getId(), workSession.getName(), dateFormat.format(workSession.getStartTime()), dateFormat.format(workSession.getEndTime()));
    }
}
