package SPEEK.interpreter;

import SPEEK.interpreter.tokenizer.Tokenizer;
import SPEEK.interpreter.tokenizer.Token;
import SPEEK.interpreter.parser.Parser;
import SPEEK.interpreter.evaluator.Evaluator;
import SPEEK.interpreter.evaluator.Instruction;

import java.util.List;

public class Interpreter {

    private String sourceCode;
    private List<Instruction> program;

    public Interpreter(String sourceCode) {
        this.sourceCode = sourceCode;
    }

    public String execute() {

        // 1. TOKENIZE
        Tokenizer tokenizer = new Tokenizer(sourceCode);

        List<Token> tokens = tokenizer.tokenize();

        // 2. PARSE
        Parser parser = new Parser(tokens);

        program = parser.parse();

        // 3. EVALUATE
        Evaluator evaluator = new Evaluator();

        return evaluator.executeProgram(program);
    }
}