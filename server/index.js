const fs = require("fs");

// load JSONL data
function loadJSONL(file) {
  const data = fs.readFileSync(`./data/${file}`, "utf-8")
    .split("\n")
    .filter(Boolean)
    .map(JSON.parse);
  return data;
}

const orders = loadJSONL("sales_order_headers.jsonl");
const customers = loadJSONL("business_partners.jsonl");
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./db');
const askLLM = require('./llm');

require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send("Server running 🚀");
});

// QUERY API
app.post("/query", (req, res) => {
  const { question } = req.body;

  if (!question.match(/order/i)) {
    return res.json({
      answer: "Only dataset-related queries"
    });
  }

  const match = question.match(/\d+/);

  if (!match) {
    return res.json({ answer: "No order id found" });
  }

  const id = match[0];

  const result = orders.filter(o => o.id == id);

  const answer = result.length
    ? `Order ${id} belongs to customer ${result[0].customer_id}`
    : "No data found";

  res.json({
    answer,
    result,
    highlightIds: [`order-${id}`]
  });
});

app.get("/graph", (req, res) => {
  const nodes = [];
  const edges = [];

  orders.slice(0, 50).forEach(o => {
    nodes.push({
      data: { id: `order-${o.id}`, label: `Order ${o.id}` }
    });

    edges.push({
      data: {
        source: `customer-${o.customer_id}`,
        target: `order-${o.id}`
      }
    });
  });

  customers.slice(0, 50).forEach(c => {
    nodes.push({
      data: { id: `customer-${c.id}`, label: c.name }
    });
  });

  res.json({ nodes, edges });
});

app.listen(5000, () => console.log("Server running on port 5000"));