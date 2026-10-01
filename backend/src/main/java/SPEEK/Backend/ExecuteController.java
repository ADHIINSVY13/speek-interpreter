package SPEEK.Backend;

import SPEEK.interpreter.Interpreter;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")
public class ExecuteController {

    @PostMapping("/execute")
    public String execute(@RequestBody String code) {

        try {
            code = code.replace("\r\n", "\n")
                       .replace("\r", "\n");

            Interpreter interpreter = new Interpreter(code);

            return interpreter.execute();

        } catch (Exception e) {
            return "Error: " + e.getMessage();
        }
    }
}