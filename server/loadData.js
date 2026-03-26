const fs = require('fs');
const readline = require('readline');
const db = require('./db');

async function loadJSONL(filePath, type) {
  const rl = readline.createInterface({
    input: fs.createReadStream(filePath),
    crlfDelay: Infinity,
  });

  for await (const line of rl) {
    if (!line.trim()) continue;

    const data = JSON.parse(line);

    if (type === "orders") {
      db.run(
        `INSERT INTO orders (id, customer_id) VALUES (?, ?)`,
        [data.salesOrder, data.soldToParty]
      );
    }

    if (type === "customers") {
      db.run(
        `INSERT INTO customers (id, name) VALUES (?, ?)`,
        [data.businessPartner, data.businessPartnerName]
      );
    }

    if (type === "deliveries") {
      db.run(
        `INSERT INTO deliveries (id) VALUES (?)`,
        [data.deliveryDocument]
      );
    }

    if (type === "payments") {
      db.run(
        `INSERT INTO payments (id, customer_id) VALUES (?, ?)`,
        [data.accountingDocument, data.customer]
      );
    }
  }

  console.log(type + " loaded");
}

(async () => {
  await loadJSONL('./data/sales_order_headers.jsonl', 'orders');
  await loadJSONL('./data/business_partners.jsonl', 'customers');
  await loadJSONL('./data/outbound_delivery_headers.jsonl', 'deliveries');
  await loadJSONL('./data/accounts_receivable.jsonl', 'payments');
})();