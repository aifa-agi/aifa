# 16. Node Operator Guide: Deployment (Docker Compose, Prometheus, Grafana and Alerting Rules)

The final stage of deploying a AIFA Network Super-Node is assembling an isolated containerized environment with automatic orchestration and continuous monitoring. Infrastructure failures (Downtime, missed PING requests in the Kademlia DHT, Envoy Proxy response delays) lead directly to calls of the slashValidator() function in the ValidatorStaking.sol contract.

A monitoring stack based on Prometheus, Grafana and Alertmanager with an integrated Node Exporter and Envoy Statsd guarantees the operator instant detection of anomalies before they lead to financial penalties (Slashing).

## 16.1 Containerization Manifest (docker-compose.yml)

To isolate network resources, limit RAM consumption and restart automatically on failure, the node is deployed as a multi-container stack.

```yaml
version: '3.8'

networks:
  aifa-mesh:
    driver: bridge
    ipam:
      config:
        - subnet: 172.28.0.0/16

volumes:
  aifa-data:
  prometheus-data:
  grafana-data:

services:
  # 1. Main executive node (Control Plane + Kademlia DHT)
  aifa-core:
    image: ghcr.io/aifa-agi/core-node:v6.0.0
    container_name: aifa-core
    restart: unless-stopped
    network_mode: host # Required for NAT traversal and STUN/TURN
    volumes:
      - /etc/aifa/node.toml:/etc/aifa/node.toml:ro
      - /etc/aifa/node_key.json:/etc/aifa/node_key.json:ro
      - aifa-data:/var/lib/aifa/data
    environment:
      - RUST_LOG=info,aifa_core=debug
      - NODE_CONFIG=/etc/aifa/node.toml
    logging:
      driver: "json-file"
      options:
        max-size: "100m"
        max-file: "3"

  # 2. Envoy Proxy (Data Plane / mTLS / Dynamic xDS)
  aifa-envoy:
    image: envoyproxy/envoy:v1.30-latest
    container_name: aifa-envoy
    restart: unless-stopped
    network_mode: host
    volumes:
      - /etc/aifa/envoy.yaml:/etc/envoy/envoy.yaml:ro
    command: envoy -c /etc/envoy/envoy.yaml --service-cluster super-relay --service-node aifa-core
    depends_on:
      - aifa-core

  # 3. Metrics collection server (Prometheus)
  prometheus:
    image: prom/prometheus:v2.51.0
    container_name: aifa-prometheus
    restart: unless-stopped
    networks:
      aifa-mesh:
        ipv4_address: 172.28.0.10
    ports:
      - "127.0.0.1:9090:9090" # Closed from outside, available locally or through an SSH tunnel
    volumes:
      - /etc/aifa/prometheus.yml:/etc/prometheus/prometheus.yml:ro
      - prometheus-data:/prometheus
    command:
      - '--config.file=/etc/prometheus/prometheus.yml'
      - '--storage.tsdb.path=/prometheus'
      - '--storage.tsdb.retention.time=30d'

  # 4. Visualization system (Grafana)
  grafana:
    image: grafana/grafana:10.4.0
    container_name: aifa-grafana
    restart: unless-stopped
    networks:
      aifa-mesh:
        ipv4_address: 172.28.0.11
    ports:
      - "127.0.0.1:3000:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=CHANGE_THIS_SECURE_PASSWORD
      - GF_USERS_ALLOW_SIGN_UP=false
    volumes:
      - grafana-data:/var/lib/grafana
      - /etc/aifa/grafana/dashboards:/etc/grafana/provisioning/dashboards:ro
    depends_on:
      - prometheus

  # 5. Alert manager (Alertmanager)
  alertmanager:
    image: prom/alertmanager:v0.27.0
    container_name: aifa-alertmanager
    restart: unless-stopped
    networks:
      aifa-mesh:
        ipv4_address: 172.28.0.12
    volumes:
      - /etc/aifa/alertmanager.yml:/etc/alertmanager/alertmanager.yml:ro
```

## 16.2 Prometheus Configuration (prometheus.yml)

Prometheus continuously collects metrics on the state of the p2p network, Envoy latencies and the stablecoin/gas balance.

```yaml
global:
  scrape_interval: 10s
  evaluation_interval: 10s

rule_files:
  - "/etc/prometheus/alerts.yml"

alerting:
  alertmanagers:
    - static_configs:
        - targets: ['172.28.0.12:9093']

scrape_configs:
  - job_name: 'aifa-core-node'
    static_configs:
      - targets: ['localhost:9090'] # Local metrics endpoint of the Rust core

  - job_name: 'aifa-envoy-proxy'
    static_configs:
      - targets: ['localhost:9901'] # Envoy Admin / Stats endpoint
    metrics_path: '/stats/prometheus'

  - job_name: 'node-exporter'
    static_configs:
      - targets: ['localhost:9100']
```

## 16.3 Alerting Rules (alerts.yml)

The alerting system must fire an alarm instantly when conditions arise that threaten the operator's stake:

```yaml
groups:
  - name: AifaNodeCriticalAlerts
    rules:
      # 1. Soft-Slash threat (dropping out of the network)
      - alert: AifaNodeDown
        expr: up{job="aifa-core-node"} == 0
        for: 1m
        labels:
          severity: critical
        annotations:
          summary: "CRITICAL ERROR: AIFA Super-Node is down!"
          description: "The aifa-core container has been unavailable for more than 1 minute. Risk of Jail and Soft-Slash!"

      # 2. Loss of Kademlia DHT connectivity
      - alert: KademliaPeersLow
        expr: aifa_kademlia_active_peers < 5
        for: 3m
        labels:
          severity: warning
        annotations:
          summary: "Low number of P2P neighbors"
          description: "The node is connected to only {{ $value }} Kademlia nodes. Check whether UDP port 4001 is blocked."

      # 3. Rising routing latency (Envoy Latency)
      - alert: HighMtlsLatency
        expr: histogram_quantile(0.99, sum(rate(envoy_http_downstream_rq_time_bucket[5m])) by (le)) > 200
        for: 2m
        labels:
          severity: warning
        annotations:
          summary: "High mTLS Data Plane latency (>200ms)"
          description: "The 99th percentile of Envoy latency exceeds 200 ms. Risk of packet drops and receiving a Fraud Proof!"

      # 4. Depletion of native gas balance for Bundler/Relay
      - alert: LowRelayGasBalance
        expr: aifa_node_native_gas_balance_eth < 0.05
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "ETH is running out in the node wallet"
          description: "The gas balance for serving UserOps is below 0.05 ETH. Transaction sending may stop."
```

## 16.4 Alertmanager Configuration (alertmanager.yml)

Setting up direct routing of critical notifications to Telegram/PagerDuty for the on-duty DevOps engineer:

```yaml
global:
  resolve_timeout: 5m

route:
  group_by: ['alertname']
  group_wait: 10s
  group_interval: 30s
  repeat_interval: 2h
  receiver: 'telegram-notifications'

receivers:
  - name: 'telegram-notifications'
    telegram_configs:
      - bot_token: 'YOUR_TELEGRAM_BOT_TOKEN'
        chat_id: YOUR_TELEGRAM_CHAT_ID
        send_resolved: true
        parse_mode: 'HTML'
        message: |
          <b>{{ if eq .Status "firing" }}🚨 ALERT: {{ .CommonAnnotations.summary }}{{ else }}✅ RESOLVED: {{ .CommonAnnotations.summary }}{{ end }}</b>
          <b>Description:</b> {{ .CommonAnnotations.description }}
          <b>Severity:</b> {{ .CommonLabels.severity }}
          <b>Time:</b> {{ .StartsAt }}
```

## 16.5 Final Architecture of the Grafana Dashboard (Core Metrics Dashboard)

The Grafana monitoring dashboard includes 4 key visual widgets:

Network Health: Number of active neighbors in k-buckets, status of PING checks from network peers.

Relay Throughput: Rate of encrypted E2EE traffic pumped in Mbit/s, number of active TURN sessions.

Financial Accounting: Accumulated amount of USDC fees for bandwidth, balance of burned $AIFA tokens.

Slashing Risk Metrics: Counter of recorded anomalies and a timer until the stake can be safely withdrawn (Unbonding Countdown).
