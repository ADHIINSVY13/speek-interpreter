import { useState } from "react";
import {
  Play,
  BookOpen,
  RotateCcw,
  GitBranch,
  X,
} from "lucide-react";
import Editor from "@monaco-editor/react";
import "./App.css";

const defaultCode = `let x be 10
let y be 20

say x + y`;

function App() {
  const [code, setCode] = useState(defaultCode);
  const [output, setOutput] = useState("");
  const [environment, setEnvironment] = useState({});
  const [tokens, setTokens] = useState([]);
  const [error, setError] = useState(null);

  const [activeTab, setActiveTab] = useState("output");
  const [isRunning, setIsRunning] = useState(false);
  const [showDocumentation, setShowDocumentation] = useState(false);

  const runCode = async () => {
    setIsRunning(true);
    setError(null);

    try {
      const response = await fetch(
        "http://localhost:8080/api/execute",
        {
          method: "POST",
          headers: {
            "Content-Type": "text/plain",
          },
          body: code,
        }
      );

      if (!response.ok) {
        throw new Error(
          `Backend returned ${response.status}`
        );
      }

      const result = await response.json();

      // REAL backend data
      setOutput(result.output || "");
      setEnvironment(result.environment || {});
      setTokens(result.tokens || []);
      setError(result.error || null);

      setActiveTab("output");
    } catch (err) {
      console.error(err);

      setOutput("");
      setEnvironment({});
      setTokens([]);

      setError(
        "Could not connect to SPEEK backend. Make sure Spring Boot is running on port 8080."
      );

      setActiveTab("errors");
    } finally {
      setIsRunning(false);
    }
  };

  const resetCode = () => {
    setCode(defaultCode);
    setOutput("");
    setEnvironment({});
    setTokens([]);
    setError(null);
    setActiveTab("output");
  };

  const openGitHub = () => {
    
    const githubUrl = "https://github.com/ADHIINSVY13/speek-interpreter";

    if (githubUrl !== "https://github.com/ADHIINSVY13/speek-interpreter") {
      window.open(
        githubUrl,
        "_blank",
        "noopener,noreferrer"
      );
    }
  };

  return (
    <div className="app">

      {/* =========================
          TOP BAR
      ========================== */}

      <header className="topbar">
        <div className="brand">
          <div className="brand-icon">S</div>

          <div>
            <h1>SPEEK</h1>
            <span>Speak. Code. Execute.</span>
          </div>
        </div>

        <div className="header-actions">

          <button
            className="header-btn"
            onClick={() => setShowDocumentation(true)}
          >
            <BookOpen size={16} />
            Documentation
          </button>

          <button
            className="header-btn"
            onClick={openGitHub}
          >
            <GitBranch size={16} />
            GitHub
          </button>

        </div>
      </header>


      {/* =========================
          MAIN WORKSPACE
      ========================== */}

      <main className="workspace">

        {/* =========================
            EDITOR
        ========================== */}

        <section className="editor-section">

          <div className="section-header">

            <div className="section-title">
              <span className="status-dot"></span>
              SPEEK Editor
            </div>

            <div className="editor-actions">

              <button
                className="reset-btn"
                onClick={resetCode}
                title="Reset code"
              >
                <RotateCcw size={15} />
                Reset
              </button>

              <button
                className="run-btn"
                onClick={runCode}
                disabled={isRunning}
              >
                <Play size={15} />

                {isRunning
                  ? "Running..."
                  : "Run"}
              </button>

            </div>

          </div>


          <div className="editor-container">

            <Editor
              height="100%"
              language="plaintext"
              theme="vs-dark"
              value={code}
              onChange={(value) =>
                setCode(value || "")
              }
              options={{
                fontSize: 15,
                minimap: {
                  enabled: false,
                },
                lineNumbers: "on",
                wordWrap: "on",
                padding: {
                  top: 20,
                },
                scrollBeyondLastLine: false,
                automaticLayout: true,
              }}
            />

          </div>

        </section>


        {/* =========================
            CONSOLE
        ========================== */}

        <section className="console-section">

          <div className="console-header">

            <div className="console-title">
              Console
            </div>

          </div>


          <div className="console-content">

            {/* =========================
                OUTPUT
            ========================== */}

            {activeTab === "output" && (
              <>
                {output ? (
                  <pre className="output-text">
                    {output}
                  </pre>
                ) : (
                  <div className="empty-state">
                    Run your SPEEK program to see
                    the output here.
                  </div>
                )}
              </>
            )}


            {/* =========================
                DYNAMIC TOKENS
            ========================== */}

            {activeTab === "tokens" && (
              <div className="token-panel">

                <div className="panel-description">
                  Tokens generated by the SPEEK
                  tokenizer.
                </div>

                {tokens.length === 0 ? (

                  <div className="empty-state">
                    Run your SPEEK program to
                    generate tokens.
                  </div>

                ) : (

                  <div className="token-table">

                    <div className="token-row token-header">
                      <span>Type</span>
                      <span>Value</span>
                    </div>

                    {tokens.map(
                      (token, index) => (
                        <div
                          className="token-row"
                          key={index}
                        >
                          <span>
                            {token.type}
                          </span>

                          <span>
                            {token.value}
                          </span>
                        </div>
                      )
                    )}

                  </div>

                )}

              </div>
            )}

            {/* =========================
                ENVIRONMENT
                ALREADY DYNAMIC
            ========================== */}

            {activeTab === "environment" && (
              <div className="environment-panel">

                <div className="panel-description">
                  Variables currently stored in
                  the SPEEK runtime environment.
                </div>

                {Object.keys(environment).length === 0 ? (

                  <div className="empty-state">

                    No variables in environment.

                    <br />

                    Run a program containing
                    <code> let </code>
                    statements.

                  </div>

                ) : (

                  <div className="environment-list">

                    {Object.entries(environment).map(
                      ([name, value]) => (

                        <div
                          className="environment-row"
                          key={name}
                        >

                          <span className="environment-name">
                            {name}
                          </span>

                          <span className="environment-value">

                            {typeof value === "string"
                              ? `"${value}"`
                              : String(value)}

                          </span>

                        </div>

                      )
                    )}

                  </div>

                )}

              </div>
            )}


            {/* =========================
                ERRORS
                STILL DYNAMIC FOR
                BACKEND ERROR VALUE
            ========================== */}

            {activeTab === "errors" && (
              <div className="errors-panel">

                {error ? (

                  <div className="error-box">

                    <strong>
                      Runtime Error
                    </strong>

                    <p>
                      {error}
                    </p>

                  </div>

                ) : (

                  <div className="empty-state">
                    No errors detected.
                  </div>

                )}

              </div>
            )}

          </div>


          {/* =========================
              CONSOLE TABS
          ========================== */}

          <div className="console-tabs">

            <button
              className={
                activeTab === "output"
                  ? "console-tab active"
                  : "console-tab"
              }
              onClick={() =>
                setActiveTab("output")
              }
            >
              OUTPUT
            </button>

            <button
              className={
                activeTab === "tokens"
                  ? "console-tab active"
                  : "console-tab"
              }
              onClick={() =>
                setActiveTab("tokens")
              }
            >
              TOKENS
            </button>

            <button
              className={
                activeTab === "environment"
                  ? "console-tab active"
                  : "console-tab"
              }
              onClick={() =>
                setActiveTab("environment")
              }
            >
              ENVIRONMENT
            </button>

            <button
              className={
                activeTab === "errors"
                  ? "console-tab active"
                  : "console-tab"
              }
              onClick={() =>
                setActiveTab("errors")
              }
            >
              ERRORS
            </button>

          </div>

        </section>

      </main>


      {/* =========================
          DOCUMENTATION MODAL
      ========================== */}

      {showDocumentation && (

        <div
          className="documentation-overlay"
          onClick={() =>
            setShowDocumentation(false)
          }
        >

          <div
            className="documentation-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <div className="documentation-header">

              <div>

                <span className="doc-label">
                  SPEEK LANGUAGE
                </span>

                <h2>
                  Documentation
                </h2>

                <p>
                  Learn the syntax, execution
                  model, and architecture of SPEEK.
                </p>

              </div>

              <button
                className="doc-close"
                onClick={() =>
                  setShowDocumentation(false)
                }
              >
                <X size={20} />
              </button>

            </div>


            <div className="documentation-content">

              {/* 01 */}

              <section className="doc-section">

                <div className="doc-number">
                  01
                </div>

                <div>

                  <h3>
                    What is SPEEK?
                  </h3>

                  <p>
                    SPEEK is a simple programming
                    language designed to make
                    programming syntax easy to
                    read and understand.
                  </p>

                  <p>
                    A SPEEK program passes through
                    three main stages:
                  </p>

                  <div className="pipeline-box">

                    <span>
                      Source Code
                    </span>

                    <span>→</span>

                    <span>
                      Tokenizer
                    </span>

                    <span>→</span>

                    <span>
                      Parser
                    </span>

                    <span>→</span>

                    <span>
                      Evaluator
                    </span>

                  </div>

                </div>

              </section>


              {/* 02 */}

              <section className="doc-section">

                <div className="doc-number">
                  02
                </div>

                <div>

                  <h3>
                    Your First SPEEK Program
                  </h3>

                  <p>
                    A basic SPEEK program can
                    declare variables and print
                    an expression.
                  </p>

                  <pre className="doc-code">
{`let x be 10
let y be 20

say x + y`}
                  </pre>

                  <div className="doc-output">
                    Output: 30
                  </div>

                </div>

              </section>


              {/* 03 */}

              <section className="doc-section">

                <div className="doc-number">
                  03
                </div>

                <div>

                  <h3>
                    Variables
                  </h3>

                  <p>
                    Variables are created using
                    <code> let </code>
                    followed by the variable
                    name,
                    <code> be </code>
                    and its value.
                  </p>

                  <pre className="doc-code">
{`let age be 20
let score be 95`}
                  </pre>

                  <p>
                    Variables can later be
                    referenced by their names.
                  </p>

                  <pre className="doc-code">
{`let x be 10
let y be x

say y`}
                  </pre>

                </div>

              </section>


              {/* 04 */}

              <section className="doc-section">

                <div className="doc-number">
                  04
                </div>

                <div>

                  <h3>
                    Numbers
                  </h3>

                  <p>
                    SPEEK supports numeric values
                    and arithmetic expressions.
                  </p>

                  <pre className="doc-code">
{`let x be 10
let y be 5

say x + y
say x - y
say x * y
say x / y`}
                  </pre>

                </div>

              </section>


              {/* 05 */}

              <section className="doc-section">

                <div className="doc-number">
                  05
                </div>

                <div>

                  <h3>
                    Strings
                  </h3>

                  <p>
                    SPEEK can represent string
                    values.
                  </p>

                  <pre className="doc-code">
{`let name be "Divyanshi"

say name`}
                  </pre>

                </div>

              </section>


              {/* 06 */}

              <section className="doc-section">

                <div className="doc-number">
                  06
                </div>

                <div>

                  <h3>
                    Output with say
                  </h3>

                  <p>
                    The
                    <code> say </code>
                    keyword evaluates an expression
                    and prints its value.
                  </p>

                  <pre className="doc-code">
{`say 10

let x be 25
say x

say x + 5`}
                  </pre>

                </div>

              </section>


              {/* 07 */}

              <section className="doc-section">

                <div className="doc-number">
                  07
                </div>

                <div>

                  <h3>
                    Arithmetic Operators
                  </h3>

                  <table className="documentation-table">

                    <thead>

                      <tr>
                        <th>Operator</th>
                        <th>Meaning</th>
                        <th>Example</th>
                      </tr>

                    </thead>

                    <tbody>

                      <tr>
                        <td>+</td>
                        <td>Addition</td>
                        <td>
                          <code>x + y</code>
                        </td>
                      </tr>

                      <tr>
                        <td>-</td>
                        <td>Subtraction</td>
                        <td>
                          <code>x - y</code>
                        </td>
                      </tr>

                      <tr>
                        <td>*</td>
                        <td>Multiplication</td>
                        <td>
                          <code>x * y</code>
                        </td>
                      </tr>

                      <tr>
                        <td>/</td>
                        <td>Division</td>
                        <td>
                          <code>x / y</code>
                        </td>
                      </tr>

                    </tbody>

                  </table>

                </div>

              </section>


              {/* 08 */}

              <section className="doc-section">

                <div className="doc-number">
                  08
                </div>

                <div>

                  <h3>
                    Operator Precedence
                  </h3>

                  <p>
                    Multiplication and division
                    are evaluated before addition
                    and subtraction.
                  </p>

                  <pre className="doc-code">
{`say 10 + 5 * 2`}
                  </pre>

                  <p>
                    The multiplication is evaluated
                    first.
                  </p>

                  <pre className="doc-code">
{`5 * 2 = 10
10 + 10 = 20`}
                  </pre>

                </div>

              </section>


              {/* 09 */}

              <section className="doc-section">

                <div className="doc-number">
                  09
                </div>

                <div>

                  <h3>
                    Comparison Operators
                  </h3>

                  <p>
                    SPEEK supports readable
                    comparison expressions.
                  </p>

                  <table className="documentation-table">

                    <thead>

                      <tr>
                        <th>SPEEK Syntax</th>
                        <th>Meaning</th>
                      </tr>

                    </thead>

                    <tbody>

                      <tr>
                        <td>
                          is greater than
                        </td>
                        <td>
                          Greater than
                        </td>
                      </tr>

                      <tr>
                        <td>
                          is less than
                        </td>
                        <td>
                          Less than
                        </td>
                      </tr>

                      <tr>
                        <td>
                          is equal to
                        </td>
                        <td>
                          Equality
                        </td>
                      </tr>

                    </tbody>

                  </table>

                  <pre className="doc-code">
{`let x be 10

if x is greater than 5 then
    say "yes"`}
                  </pre>

                </div>

              </section>


              {/* 10 */}

              <section className="doc-section">

                <div className="doc-number">
                  10
                </div>

                <div>

                  <h3>
                    Conditional Statements
                  </h3>

                  <p>
                    Conditions use
                    <code> if </code>
                    and
                    <code> then </code>
                    followed by an indented block.
                  </p>

                  <pre className="doc-code">
{`let age be 20

if age is greater than 18 then
    say "Adult"`}
                  </pre>

                </div>

              </section>


              {/* 11 */}

              <section className="doc-section">

                <div className="doc-number">
                  11
                </div>

                <div>

                  <h3>
                    Repeat Statements
                  </h3>

                  <p>
                    SPEEK supports repeated
                    execution using
                    <code> repeat </code>
                    and
                    <code> times </code>.
                  </p>

                  <pre className="doc-code">
{`repeat 3 times
    say "Hello"`}
                  </pre>

                  <p>
                    The indented block is executed
                    for each repetition.
                  </p>

                </div>

              </section>


              {/* 12 */}

              <section className="doc-section">

                <div className="doc-number">
                  12
                </div>

                <div>

                  <h3>
                    Blocks and Indentation
                  </h3>

                  <p>
                    Indentation is important for
                    statements such as
                    <code> if </code>
                    and
                    <code> repeat </code>.
                  </p>

                  <pre className="doc-code">
{`if x is greater than 5 then
    say x`}
                  </pre>

                  <p>
                    The indented statement belongs
                    to the conditional block.
                  </p>

                </div>

              </section>


              {/* 13 */}

              <section className="doc-section">

                <div className="doc-number">
                  13
                </div>

                <div>

                  <h3>
                    Identifiers
                  </h3>

                  <p>
                    Identifiers are names used
                    for variables.
                  </p>

                  <pre className="doc-code">
{`let total be 100
let score be 90
let name be "Alex"`}
                  </pre>

                </div>

              </section>


              {/* 14 */}

              <section className="doc-section">

                <div className="doc-number">
                  14
                </div>

                <div>

                  <h3>
                    SPEEK Keywords
                  </h3>

                  <div className="keyword-list">

                    <span>let</span>
                    <span>be</span>
                    <span>say</span>
                    <span>if</span>
                    <span>then</span>
                    <span>repeat</span>
                    <span>times</span>

                  </div>

                </div>

              </section>


              {/* 15 */}

              <section className="doc-section">

                <div className="doc-number">
                  15
                </div>

                <div>

                  <h3>
                    Tokenizer
                  </h3>

                  <p>
                    The tokenizer converts the
                    source code into tokens.
                  </p>

                  <p>
                    For example:
                  </p>

                  <pre className="doc-code">
{`let x be 10`}
                  </pre>

                  <p>
                    becomes a sequence containing
                    tokens such as:
                  </p>

                  <div className="keyword-list">

                    <span>LET</span>
                    <span>IDENTIFIER</span>
                    <span>BE</span>
                    <span>NUMBER</span>

                  </div>

                </div>

              </section>


              {/* 16 */}

              <section className="doc-section">

                <div className="doc-number">
                  16
                </div>

                <div>

                  <h3>
                    Parser
                  </h3>

                  <p>
                    The parser takes the tokens
                    produced by the tokenizer and
                    builds the program structure.
                  </p>

                  <div className="pipeline-box">

                    <span>
                      Tokens
                    </span>

                    <span>→</span>

                    <span>
                      Parser
                    </span>

                    <span>→</span>

                    <span>
                      Instructions / Expressions
                    </span>

                  </div>

                </div>

              </section>


              {/* 17 */}

              <section className="doc-section">

                <div className="doc-number">
                  17
                </div>

                <div>

                  <h3>
                    Evaluator
                  </h3>

                  <p>
                    The evaluator executes the
                    parsed instructions.
                  </p>

                  <p>
                    It maintains the runtime
                    environment and produces
                    program output.
                  </p>

                </div>

              </section>


              {/* 18 */}

              <section className="doc-section">

                <div className="doc-number">
                  18
                </div>

                <div>

                  <h3>
                    Environment
                  </h3>

                  <p>
                    The environment stores the
                    current values of variables
                    while the program is running.
                  </p>

                  <pre className="doc-code">
{`let x be 10
let y be 20`}
                  </pre>

                  <p>
                    The runtime environment becomes:
                  </p>

                  <pre className="doc-code">
{`x → 10
y → 20`}
                  </pre>

                  <p>
                    The IDE's Environment panel
                    displays these runtime values
                    after execution.
                  </p>

                </div>

              </section>


              {/* 19 */}

              <section className="doc-section">

                <div className="doc-number">
                  19
                </div>

                <div>

                  <h3>
                    Instruction Types
                  </h3>

                  <div className="instruction-grid">

                    <div>
                      <strong>
                        AssignInstruction
                      </strong>

                      <p>
                        Creates or updates a
                        variable.
                      </p>
                    </div>

                    <div>
                      <strong>
                        PrintInstruction
                      </strong>

                      <p>
                        Evaluates and prints a
                        value.
                      </p>
                    </div>

                    <div>
                      <strong>
                        IfInstruction
                      </strong>

                      <p>
                        Executes a conditional
                        block.
                      </p>
                    </div>

                    <div>
                      <strong>
                        RepeatInstruction
                      </strong>

                      <p>
                        Executes a block repeatedly.
                      </p>
                    </div>

                  </div>

                </div>

              </section>


              {/* 20 */}

              <section className="doc-section">

                <div className="doc-number">
                  20
                </div>

                <div>

                  <h3>
                    Errors
                  </h3>

                  <p>
                    SPEEK can report errors
                    encountered during tokenization,
                    parsing, or evaluation.
                  </p>

                  <p>
                    Runtime errors are displayed
                    by the IDE's Errors panel.
                  </p>

                </div>

              </section>


              {/* 21 */}

              <section className="doc-section">

                <div className="doc-number">
                  21
                </div>

                <div>

                  <h3>
                    Complete SPEEK Example
                  </h3>

                  <pre className="doc-code">
{`let x be 10
let y be 20
let total be x + y

say total

if total is greater than 20 then
    say "Total is greater than 20"

repeat 3 times
    say total`}
                  </pre>

                </div>

              </section>


              {/* 22 */}

              <section className="doc-section">

                <div className="doc-number">
                  22
                </div>

                <div>

                  <h3>
                    SPEEK IDE Panels
                  </h3>

                  <div className="ide-panel-grid">

                    <div>
                      <strong>
                        OUTPUT
                      </strong>

                      <p>
                        Displays program output.
                      </p>
                    </div>

                    <div>
                      <strong>
                        TOKENS
                      </strong>

                      <p>
                        Shows lexical tokens.
                      </p>
                    </div>

                    <div>
                      <strong>
                        AST
                      </strong>

                      <p>
                        Shows the parsed structure.
                      </p>
                    </div>

                    <div>
                      <strong>
                        ENVIRONMENT
                      </strong>

                      <p>
                        Shows runtime variables.
                      </p>
                    </div>

                    <div>
                      <strong>
                        ERRORS
                      </strong>

                      <p>
                        Shows execution errors.
                      </p>
                    </div>

                  </div>

                </div>

              </section>


              {/* 23 */}

              <section className="doc-section">

                <div className="doc-number">
                  23
                </div>

                <div>

                  <h3>
                    Quick Reference
                  </h3>

                  <table className="documentation-table">

                    <thead>

                      <tr>
                        <th>Feature</th>
                        <th>Syntax</th>
                      </tr>

                    </thead>

                    <tbody>

                      <tr>
                        <td>
                          Variable
                        </td>

                        <td>
                          <code>
                            let x be 10
                          </code>
                        </td>
                      </tr>

                      <tr>
                        <td>
                          Output
                        </td>

                        <td>
                          <code>
                            say x
                          </code>
                        </td>
                      </tr>

                      <tr>
                        <td>
                          Addition
                        </td>

                        <td>
                          <code>
                            x + y
                          </code>
                        </td>
                      </tr>

                      <tr>
                        <td>
                          Greater Than
                        </td>

                        <td>
                          <code>
                            x is greater than y
                          </code>
                        </td>
                      </tr>

                      <tr>
                        <td>
                          Less Than
                        </td>

                        <td>
                          <code>
                            x is less than y
                          </code>
                        </td>
                      </tr>

                      <tr>
                        <td>
                          Equality
                        </td>

                        <td>
                          <code>
                            x is equal to y
                          </code>
                        </td>
                      </tr>

                      <tr>
                        <td>
                          Condition
                        </td>

                        <td>
                          <code>
                            if condition then
                          </code>
                        </td>
                      </tr>

                      <tr>
                        <td>
                          Loop
                        </td>

                        <td>
                          <code>
                            repeat n times
                          </code>
                        </td>
                      </tr>

                    </tbody>

                  </table>

                </div>

              </section>


              <div className="documentation-footer">

                <strong>
                  SPEEK
                </strong>

                <span>
                  A simple language with a complete
                  tokenizer → parser → evaluator
                  pipeline.
                </span>

              </div>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

export default App;