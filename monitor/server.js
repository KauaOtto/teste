
// Importa bibliotecas
const express = require('express');
const client = require('prom-client');

// Cria o app express
const app = express();

// Ativa métricas padrão (CPU, memória, etc)
client.collectDefaultMetrics();

// Cria contador para contar requisições
const requestCounter = new client.Counter({
  name: 'app_request_total',
  help: 'Contador total de requisições recebidas',
});

// Cria gauge para status do servidor
const serverStatusGauge = new client.Gauge({
  name: 'server_status',
  help: 'Status do servidor: 1 = online, 0 = offline',
});

// Ao iniciar, define como "online"
serverStatusGauge.set(1);

// Rota principal
app.get('/', (req, res) => {
  requestCounter.inc(); // incrementa contador
  serverStatusGauge.set(1); // garante status online
  res.send('Servidor Node rodando! Prometheus e Grafana conectados!');
});

// Endpoint de métricas para o Prometheus
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', client.register.contentType);
  res.end(await client.register.metrics());
});

// Inicia servidor
app.listen(3123, () => {
  console.log('🚀 Servidor rodando na porta 3123');
  serverStatusGauge.set(1); // mantém a métrica registrada
});

// Em caso de desligamento
process.on('SIGTERM', () => {
  serverStatusGauge.set(0);
  process.exit(0);
});
