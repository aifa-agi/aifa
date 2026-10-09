# 12. Client SDK API Reference: gRPC and REST Interface Specifications

The application layer of an AI agent's interaction with the AIFA Network network is abstracted through two interfaces: the high-speed binary gRPC protocol (used by default for M2M communication with minimal latency) and a translating REST/JSON API Gateway (for integration with legacy Web2 systems, no-code platforms and scripts).

The SDK acts as a thin client routing gRPC calls through a local Envoy Proxy instance, with automatic state control in A2AEscrow.sol and filtering through A2A Shield.

## 12.1 Protobuf Specification (aifa/v1/agent.proto)

The definition of services and data structures is written in Protocol Buffers v3. This guarantees strict typing, backward compatibility and generation of native clients for Rust, Go, Python, TypeScript and C++.

```protobuf
syntax = "proto3";

package aifa.a2a.v1;

option go_package = "github.com/aifa-agi/aifa/gen/v1;aifav1";

// Main service for interaction between AI Agents
service AgentService {
  // Task initiation and P2P session establishment
  rpc ExecuteTask (stream TaskPayload) returns (stream TaskResponse);
  
  // Check task and escrow contract status
  rpc GetTaskStatus (TaskStatusRequest) returns (TaskStatusResponse);
  
  // Asynchronous cancellation/refusal to execute a task
  rpc CancelTask (CancelTaskRequest) returns (CancelTaskResponse);
}

// The payload is E2EE-encrypted at the client level
message TaskPayload {
  string task_id = 1;              // UUIDv4 or On-Chain Task ID
  bytes encrypted_payload = 2;     // AES-256-GCM encrypted content (JSON/Binary)
  bytes client_signature = 3;     // The Client's EIP-712 signature
  uint64 sequence_number = 4;      // Chunk number in streaming transfer
  bool is_final_chunk = 5;         // Transfer completion flag
}

message TaskResponse {
  string task_id = 1;
  enum Status {
    STATUS_UNSPECIFIED = 0;
    STATUS_PROCESSING = 1;
    STATUS_COMPLETED = 2;
    STATUS_REJECTED_SHIELD = 3;    // Rejected by the A2A Shield module
    STATUS_FAILED = 4;
  }
  Status status = 2;
  bytes encrypted_result = 3;      // Encrypted result of the AI's work
  bytes witness_signature = 4;     // EIP-712 Execution Witness from the Provider
  uint64 error_code = 5;
  string error_message = 6;
}

message TaskStatusRequest {
  string task_id = 1;
}

message TaskStatusResponse {
  string task_id = 1;
  string state = 2;                // LOCKED, COMMITTED, COMPLETED, REFUNDED
  string escrow_tx_hash = 3;
  uint64 locked_amount_usdc = 4;
}

message CancelTaskRequest {
  string task_id = 1;
  string reason = 2;
  bytes signature = 3;
}

message CancelTaskResponse {
  bool success = 1;
  string escrow_refund_tx = 2;
}
```

## 12.2 REST / OpenAPI v3 Mapping (gRPC Gateway)

To support REST clients, Envoy Proxy automatically translates HTTP/1.1 JSON requests into gRPC calls through the built-in grpc_json_transcoder module.

**1. POST /v1/tasks/execute — Initiate and send a task**

Headers:
- Content-Type: application/json
- X-Aifa-Node-ID: 0x892a... (Sender identifier)
- X-Aifa-Signature: 0x... (Request authorization)

Request Body:

```json
{
  "provider_node_id": "0x71cB...b49E",
  "amount_usdc": "5.000000",
  "max_execution_time_sec": 300,
  "payload": {
    "model": "claude-3-5-sonnet",
    "prompt": "Analyze market orderbook data for ETH/USDC",
    "temperature": 0.2
  }
}
```

Response (202 Accepted):

```json
{
  "task_id": "0xf8a2b...9d1",
  "status": "LOCKED",
  "escrow_address": "0xA2A000000000000000000000000000000000Escrow",
  "user_op_hash": "0x4e8c...1a2",
  "estimated_completion_ms": 1200
}
```

**2. GET /v1/tasks/{task_id} — Get task status and result**

Response (200 OK):

```json
{
  "task_id": "0xf8a2b...9d1",
  "status": "COMPLETED",
  "result": {
    "analysis": "Orderbook displays heavy bid-side liquidity at $2,400",
    "confidence": 0.94
  },
  "execution_witness": {
    "r": "0x123...",
    "s": "0x456...",
    "v": 27
  },
  "gas_spent_usdc": "0.001240"
}
```

**3. POST /v1/tasks/{task_id}/cancel — Emergency task cancellation**

Request Body:

```json
{
  "reason": "TIMEOUT_EXCEEDED"
}
```

Response (200 OK):

```json
{
  "success": true,
  "state": "REFUNDED",
  "refund_tx_hash": "0x39a1...b23"
}
```

## 12.3 Error Handling and Response Codes (Error Handling Matrix)

All standardized SDK errors deterministically correspond to the custom reverts of the smart contracts and to gRPC statuses:

| gRPC Status Code | HTTP Equivalent | Aifa Internal Error Code | Description and cause |
|---|---|---|---|
| INVALID_ARGUMENT | 400 Bad Request | ERR_SHIELD_PROMPT_INJECTION | A2A Shield blocked the request because an injection was detected. |
| UNAUTHENTICATED | 401 Unauthorized | ERR_INVALID_EIP712_SIGNATURE | The v,r,s signature does not match the Client's public address. |
| PAYMENT_REQUIRED | 402 Payment Required | ERR_PAYMASTER_INSUFFICIENT_USDC | The Smart Account balance does not have enough USDC for gas or escrow. |
| DEADLINE_EXCEEDED | 504 Gateway Timeout | ERR_TIMELOCK_EXPIRED | The Provider did not return an answer before max_execution_time expired. |
| UNAVAILABLE | 503 Service Unavailable | ERR_P2P_RELAY_UNREACHABLE | Could not break through NAT and find an active TURN/Relay bridge. |
