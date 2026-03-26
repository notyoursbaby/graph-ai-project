import { useEffect, useRef, useState } from "react";
import cytoscape from "cytoscape";
import axios from "axios";

function App() {
  const cyRef = useRef(null);
  const cyInstance = useRef(null);

  const [question, setQuestion] = useState("");
  const [response, setResponse] = useState("");

  useEffect(() => {
    axios.get("https://graph-ai-project.onrender.com//graph").then((res) => {
      const cy = cytoscape({
        container: cyRef.current,
        elements: [...res.data.nodes, ...res.data.edges],

        style: [
          {
            selector: "node",
            style: {
              label: "data(label)",
              "background-color": "#3B82F6",
              color: "#fff",
              "text-valign": "center",
              "text-halign": "center",
              "font-size": "10px",
              width: "30px",
              height: "30px",
            },
          },
          {
            selector: "edge",
            style: {
              width: 2,
              "line-color": "#aaa",
              "target-arrow-shape": "triangle",
              "target-arrow-color": "#aaa",
              "curve-style": "bezier",
            },
          },
        ],

        layout: {
          name: "cose",
          animate: true,
          fit: true,
          padding: 30,
          nodeRepulsion: 8000,
          ideaEdgeLength: 100,
        },

        minZoom: 0.3,
        maxZoom: 2,
        wheelSensitivity: 0.2,
      });

      cyInstance.current = cy;

      setTimeout(() => {
        cy.fit();
        cy.center();
      }, 300);
    });
  }, []);

  const ask = async () => {
  const res = await axios.post("https://graph-ai-project.onrender.com//query", {
    question,
  });

  setResponse(JSON.stringify(res.data, null, 2));

  const cy = cyInstance.current;

  if (!cy) return;

  cy.nodes().style("background-color", "#3B82F6");

  const id = res.data.result?.[0]?.id;

  if (id) {
    const node = cy.$(`#order-${id}`);

    if (node.length>0) {
      node.style("background-color", "red");

      cy.animate({
        center: {eles: node},
        zoom: 1.5,
        duration: 800,
      });
    }
  }
};

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        background: "#0f172a",
        color: "white",
      }}
    >
      {/* GRAPH */}
      <div
        ref={cyRef}
        style={{
          flex: 1,
          height: "100%",
        }}
      />

      {/* CHAT */}
      <div
        style={{
          width: "300px",
          background: "#111827",
          padding: "15px",
          borderLeft: "1px solid #333",
        }}
      >
        <h2>Ask Query</h2>

        <input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask something..."
          style={{
            width: "100%",
            padding: "8px",
            marginBottom: "10px",
            background: "#1f2937",
            color: "white",
            border: "none",
          }}
        />

        <button
          onClick={ask}
          style={{
            width: "100%",
            padding: "8px",
            background: "#3B82F6",
            color: "white",
            border: "none",
            cursor: "pointer",
          }}
        >
          Ask
        </button>

        <pre
          style={{
            marginTop: "15px",
            fontSize: "12px",
            overflow: "auto",
            maxHeight: "70vh",
          }}
        >
          {response}
        </pre>
      </div>
    </div>
  );
}

export default App;