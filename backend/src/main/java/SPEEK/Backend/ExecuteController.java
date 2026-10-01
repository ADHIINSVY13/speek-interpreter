package SPEEK.Backend;

import SPEEK.interpreter.Interpreter;
import SPEEK.interpreter.tokenizer.Token;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")
public class ExecuteController {

    @PostMapping("/execute")
    public ExecutionResponse execute(@RequestBody String code) {

        try {

            // Normalize Windows line endings
            code = code.replace("\r\n", "\n")
                       .replace("\r", "\n");

            // Create interpreter
            Interpreter interpreter = new Interpreter(code);

            // Execute program
            String output = interpreter.execute();

            // Get REAL tokens
            List<Token> tokens = interpreter.getTokens();

            // Get REAL environment
            Map<String, Object> environment =
                    interpreter.getEnvironment();

            return new ExecutionResponse(
                    output,
                    environment,
                    tokens,
                    null
            );

        } catch (Exception e) {

            return new ExecutionResponse(
                    "",
                    Map.of(),
                    List.of(),
                    e.getMessage()
            );
        }
    }

    // Response object sent to React
    public static class ExecutionResponse {

        private final String output;
        private final Map<String, Object> environment;
        private final List<Token> tokens;
        private final String error;

        public ExecutionResponse(
                String output,
                Map<String, Object> environment,
                List<Token> tokens,
                String error
        ) {
            this.output = output;
            this.environment = environment;
            this.tokens = tokens;
            this.error = error;
        }

        public String getOutput() {
            return output;
        }

        public Map<String, Object> getEnvironment() {
            return environment;
        }

        public List<Token> getTokens() {
            return tokens;
        }

        public String getError() {
            return error;
        }
    }
}