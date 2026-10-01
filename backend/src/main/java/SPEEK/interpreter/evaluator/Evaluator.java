package SPEEK.interpreter.evaluator;

import java.util.List;

public class Evaluator {

    private final Environment env;

    public Evaluator() {
        env = new Environment();
    }

    public String executeProgram(List<Instruction> program) {

        StringBuilder output = new StringBuilder();

        try {

            for (Instruction instr : program) {

                if (instr instanceof PrintInstruction) {

                    PrintInstruction printInstruction =
                            (PrintInstruction) instr;

                    Object value =
                            printInstruction.evaluateForWeb(env);

                    output.append(value).append("\n");

                } else {

                    instr.execute(env);
                }
            }

        } catch (RuntimeException e) {

            output.append("Runtime error: ")
                  .append(e.getMessage());
        }

        return output.toString();
    }

    public Environment getEnvironment() {
        return env;
    }
}