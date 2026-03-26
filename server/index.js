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
app.post('/query', async (req, res) => {
  const { question } = req.body;

  // guardrail
  if (!question.match(/order|customer|delivery|payment/i)) {
    return res.json({
      answer: "Only dataset-related queries allowed."
    });
  }

  try {
    let sql = await askLLM(question);

// remove ```sql ``` and extra formatting
    sql = sql.replace(/```sql|```/g, "").trim();

    console.log("Generated SQL:", sql);   

    db.all(sql, (err, rows) => {
      if (err) return res.json({ error: err.message });

      const answer = rows.length
  ? `Found ${rows.length} result(s). Example: ${JSON.stringify(rows[0])}`
  : "No data found.";

res.json({
  answer,
  sql,
  result: rows,
  highlightIds: rows.map(r => `order-${r.id}`)
});
    });
  } catch (err) {
  console.log("FULL ERROR:", err.response?.data || err.message);
  res.json({ error: err.response?.data || err.message });
}
});
app.get('/graph', (req, res) => {
  const nodes = [];
  const edges = [];

  const orders = db.prepare("SELECT * FROM orders LIMIT 50").all();

  orders.forEach(o => {
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

  const customers = db.prepare("SELECT * FROM customers LIMIT 50").all();

  customers.forEach(c => {
    nodes.push({
      data: { id: `customer-${c.id}`, label: c.name }
    });
  });

  res.json({ nodes, edges });
});
 
app.listen(5000, () => console.log("Server running on port 5000"));