package hr.safran.timely;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.text.SimpleDateFormat;
import java.time.Period;
import java.time.ZonedDateTime;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

@Service
public class WorkServiceImpl implements WorkService{

    private final WorkSessionJPARepository workSessionJPARepository;

    public WorkServiceImpl (WorkSessionJPARepository workSessionJPARepository) {
        this.workSessionJPARepository = workSessionJPARepository;
    }

    @Override
    public List<WorkSessionDTO> findAll() {
        return workSessionJPARepository.findAllByOrderByStartTimeDesc().stream()
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

    private String findDuration (ZonedDateTime d1, ZonedDateTime d2) {
        long diff = Date.from(d2.toInstant()).getTime() - Date.from(d1.toInstant()).getTime();
        long minutes = TimeUnit
                .MILLISECONDS
                .toMinutes(diff)
                %60;
        long hours = TimeUnit
                .MILLISECONDS
                .toHours(diff)
                %60;
        return String.format("%02d", hours) + ":" + String.format("%02d", minutes);
    }

    private WorkSessionDTO mapWorkSessionToDTO (final WorkSession workSession) {
        return new WorkSessionDTO(workSession.getId(), workSession.getName(), workSession.getStartTime(), workSession.getEndTime(), findDuration(workSession.getStartTime(), workSession.getEndTime()));
    }
}
