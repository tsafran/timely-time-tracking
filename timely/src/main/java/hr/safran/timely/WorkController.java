package hr.safran.timely;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("timely")
@CrossOrigin(origins = "http://localhost:4200")
public class WorkController {
    private final WorkService workService;

    public WorkController (WorkService workService) {
        this.workService = workService;
    }

    @GetMapping
    public List<WorkSessionDTO> getAllWorkSessions() {
        return workService.findAll();
    }

    @PostMapping
    public ResponseEntity<WorkSessionDTO> save (@RequestBody final WorkSession workSession) {
        return workService.save(workSession)
                .map(
                        WorkSessionDTO -> ResponseEntity
                                .status(HttpStatus.CREATED)
                                .body(WorkSessionDTO)
                )
                .orElseGet(
                        () -> ResponseEntity
                                .status(HttpStatus.CONFLICT)
                                .build()
                );
    }
}
