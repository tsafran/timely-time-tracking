package hr.safran.timely;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.Date;

@Data
@AllArgsConstructor
public class WorkSessionDTO {
    private final String name;
    private final String startTime;
    private final String endTime;
}
