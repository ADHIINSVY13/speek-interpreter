import { useState } from "react";
import { Play, BookOpen, RotateCcw, GitBranch } from "lucide-react";
import Editor from "@monaco-editor/react";

import "./App.css";

const defaultCode = `let x be 10
let y be 20

say x + y`;

function App() {
  const [code, setCode] = useState(defaultCode);
  const [output, setOutput] = useState("");
  const [activeTab, setActiveTab] = useState("output");
  const [isRunning, setIsRunning] = useState(false);

  const runCode = () => {
    setIsRunning(true);

    // Temporary result.
    // Later this will call your Java interpreter.
    setTimeout(() => {
      setOutput("30");
      setIsRunning(false);
      setActiveTab("output");
    }, 500);
  };

  const resetCode = () => {
    setCode(defaultCode);
    setOutput("");
  };

  return (
    <div className="app">

      {/* HEADER */}
      <header className="header">

        <div className="brand">
          <div className="brand-icon">S</div>

          <div>
            <h1>SPEEK</h1>
            <span>Programming Language</span>
          </div>
        </div>

        <div className="header-actions">

          <button className="header-button">
            <BookOpen size={17} />
            Documentation
          </button>

          <button className="header-button">
            <GitBranch size={17} />
            GitHub
          </button>

          <button
            className="run-button"
            onClick={runCode}
            disabled={isRunning}
          >
            <Play size={17} fill="currentColor" />

            {isRunning ? "Running..." : "Run"}
          </button>

        </div>

      </header>


      {/* MAIN WORKSPACE */}
      <main className="workspace">

        {/* EDITOR */}
        <section className="editor-section">

          <div className="panel-header">

            <div className="file-name">
              <span className="file-dot"></span>
              main.speek
            </div>

            <button
              className="reset-button"
              onClick={resetCode}
            >
              <RotateCcw size={15} />
              Reset
            </button>

          </div>

          <div className="editor-container">

            <Editor
              height="100%"
              defaultLanguage="plaintext"
              theme="vs-dark"
              value={code}
              onChange={(value) => setCode(value || "")}
              options={{
                fontSize: 15,

                minimap: {
                  enabled: false,
                },

                padding: {
                  top: 18,
                  bottom: 18,
                },

                lineNumbers: "on",
                wordWrap: "on",
                scrollBeyondLastLine: false,
                automaticLayout: true,
              }}
            />

          </div>

        </section>


        {/* CONSOLE */}
        <section className="output-section">

          <div className="panel-header">

            <span>Console</span>

            <span className="status">
              <span className="status-dot"></span>
              Ready
            </span>

          </div>

          <div className="console">

            {output ? (

              <>
                <div className="console-label">
                  OUTPUT
                </div>

                <pre>{output}</pre>

                <div className="success-message">
                  ✓ Program executed successfully
                </div>
              </>

            ) : (

              <div className="empty-console">

                <div className="terminal-symbol">
                  &gt;_
                </div>

                <h3>No output yet</h3>

                <p>
                  Write a SPEEK program and click Run
                  to execute it.
                </p>

              </div>

            )}

          </div>

        </section>

      </main>


      {/* BOTTOM PANEL */}
      <section className="bottom-panel">

        <div className="tabs">

          {[
            "output",
            "tokens",
            "ast",
            "environment",
            "errors",
          ].map((tab) => (

            <button
              key={tab}
              className={`tab ${
                activeTab === tab ? "active" : ""
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.toUpperCase()}
            </button>

          ))}

        </div>


        <div className="tab-content">

          {activeTab === "output" && (
            <div className="tab-placeholder">
              Program output will appear here.
            </div>
          )}


          {activeTab === "tokens" && (

            <div className="token-table">

              <div className="table-header">
                <span>TYPE</span>
                <span>VALUE</span>
              </div>

              <div className="table-row">
                <span>LET</span>
                <span>let</span>
              </div>

              <div className="table-row">
                <span>IDENTIFIER</span>
                <span>x</span>
              </div>

              <div className="table-row">
                <span>NUMBER</span>
                <span>10</span>
              </div>

            </div>

          )}


          {activeTab === "ast" && (

            <div className="tree">

              <div>Program</div>

              <div className="tree-child">
                ├── Assignment
              </div>

              <div className="tree-child">
                │   ├── x
              </div>

              <div className="tree-child">
                │   └── Number(10)
              </div>

              <div className="tree-child">
                └── Print
              </div>

            </div>

          )}


          {activeTab === "environment" && (

            <div className="environment">

              <div className="env-item">
                <span>x</span>
                <span>10</span>
              </div>

              <div className="env-item">
                <span>y</span>
                <span>20</span>
              </div>

            </div>

          )}


          {activeTab === "errors" && (

            <div className="no-errors">
              ✓ No errors detected
            </div>

          )}

        </div>

      </section>

    </div>
  );
}

export default App;