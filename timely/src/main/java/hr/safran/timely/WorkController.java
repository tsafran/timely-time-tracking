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
                        workSessionDTO -> ResponseEntity
                                .status(HttpStatus.CREATED)
                                .body(workSessionDTO)
                )
                .orElseGet(
                        () -> ResponseEntity
                                .status(HttpStatus.CONFLICT)
                                .build()
                );
    }

    @PutMapping
    public ResponseEntity<WorkSessionDTO> update (@RequestBody final WorkSession workSession) {
        return workService.update(workSession)
                .map(
                        workSessionDTO -> ResponseEntity
                                .status(HttpStatus.OK)
                                .body(workSessionDTO)
                )
                .orElseGet(
                        () -> ResponseEntity
                                .status(HttpStatus.NOT_FOUND)
                                .build()
                );
    }

    @DeleteMapping("/{name}")
    public ResponseEntity delete(@PathVariable String name) {
        if (workService.deleteByName(name) > 0) {
            return ResponseEntity
                    .status(HttpStatus.NO_CONTENT)
                    .build();
        }
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .build();
    }
}
