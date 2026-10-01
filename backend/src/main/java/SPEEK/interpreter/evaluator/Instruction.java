package SPEEK.interpreter.evaluator;

/*
 * Every executable statement implements this interface.
 */
public interface Instruction {

    /*
     * Execute instruction using the shared environment.
     */
    void execute(Environment env);
}