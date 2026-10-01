package SPEEK.interpreter;

import SPEEK.interpreter.tokenizer.Token;
import SPEEK.interpreter.tokenizer.Tokenizer;
import SPEEK.interpreter.parser.Parser;
import SPEEK.interpreter.evaluator.Evaluator;
import SPEEK.interpreter.evaluator.Instruction;

import java.util.List;
import java.util.Map;

public class Interpreter {

    private final String sourceCode;

    private List<Instruction> program;
    private Evaluator evaluator;

    public Interpreter(String sourceCode) {
        this.sourceCode = sourceCode;
    }

    public String execute() {

        Tokenizer tokenizer = new Tokenizer(sourceCode);

        List<Token> tokens = tokenizer.tokenize();

        Parser parser = new Parser(tokens);

        program = parser.parse();

        evaluator = new Evaluator();

        return evaluator.executeProgram(program);
    }

    public Map<String, Object> getEnvironment() {

        if (evaluator == null) {
            return Map.of();
        }

        return evaluator
                .getEnvironment()
                .getVariables();
    }
}