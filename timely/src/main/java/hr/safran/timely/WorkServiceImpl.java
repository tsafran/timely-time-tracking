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
    public Optional<WorkSessionDTO> save(WorkSession workSession) {
         return Optional.of(workSessionJPARepository.saveAndFlush(workSession)).map(this::mapWorkSessionToDTO);
    }
    SimpleDateFormat dateFormat = new SimpleDateFormat("dd.MM.yyyy HH:mm");
    private WorkSessionDTO mapWorkSessionToDTO (final WorkSession workSession) {
        return new WorkSessionDTO(workSession.getName(), dateFormat.format(workSession.getStartTime()), dateFormat.format(workSession.getEndTime()));
    }
}
