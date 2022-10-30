package hr.safran.timely;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;
import java.time.ZonedDateTime;
import java.util.Date;

@Data
@AllArgsConstructor
public class WorkSessionDTO {
    private final Integer id;
    private final String name;
    private final ZonedDateTime startTime;
    private final ZonedDateTime endTime;
    private final String duration;
}
