// server.js
const express = require('express');
const client = require('prom-client');

const app = express();

// registra métricas padrão (CPU, memória, GC, event loop, etc.)
client.collectDefaultMetrics({ register: client.register });

// Counter (não coloque _total, o Prometheus adiciona)
const requestCounter = new client.Counter({
  name: 'app_request',
  help: 'Total de requisições recebidas',
});

// Gauge de status do servidor (0/1)
const serverStatusGauge = new client.Gauge({
  name: 'server_status',
  help: 'Status do servidor: 1 = online, 0 = offline',
});

// middleware para contar requisições e manter status
app.use((req, res, next) => {
  requestCounter.inc();
  serverStatusGauge.set(1);
  next();
});

app.get('/', (_req, res) => {
  res.send('Servidor Node rodando! Prometheus e Grafana conectados!');
});

app.get('/healthz', (_req, res) => res.status(200).send('ok'));

app.get('/metrics', async (_req, res) => {
  res.set('Content-Type', client.register.contentType);
  res.end(await client.register.metrics());
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  serverStatusGauge.set(1);
});

// desligamento gracioso
process.on('SIGTERM', () => {
  serverStatusGauge.set(0);
  process.exit(0);
});
