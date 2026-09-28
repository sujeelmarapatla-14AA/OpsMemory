/**
 * OpsMemory Mock Data
 * Realistic enterprise operational datasets for hackathon demo mode.
 * Matches backend contracts defined for FastAPI + Hindsight service.
 */

export const INITIAL_INCIDENTS = [
  {
    id: "INC-084",
    title: "Database connection timeout",
    service: "Payment API",
    severity: "Critical",
    environment: "Production",
    status: "Investigating",
    logs: `2026-09-27 21:41:02 ERROR database connection timeout
pool exhausted: active=100 max=100
request_id=pay_84a92
HTTP 500 returned by /api/payment
org.postgresql.util.PSQLException: Connection to 10.0.4.12:5432 refused (socket timeout: 15000ms)
    at org.postgresql.core.v3.ConnectionFactoryImpl.openConnectionImpl(ConnectionFactoryImpl.java:319)
    at com.zaxxer.hikari.pool.PoolBase.newConnection(PoolBase.java:359)
    at com.zaxxer.hikari.pool.HikariPool.getConnection(HikariPool.java:162)`,
    symptoms: "Checkout failures spiking at 84%. Users receiving 500 errors when processing Stripe webhooks and payment checkout. Latency p99 > 15s across US-East cluster.",
    created_at: "2 min ago",
    first_detected: "21:39:15 UTC",
    recent_change: "v2.14.2 deployed 35m ago (Added parallel payment verification queries)",
    affected_users: "~4,200 checkout sessions",
    memory_matches: 4
  },
  {
    id: "INC-083",
    title: "Redis memory pressure",
    service: "Cache Service",
    severity: "High",
    environment: "Production",
    status: "Resolved",
    logs: `2026-09-27 21:18:40 WARNING redis-server[1]: # Out of memory, allocating 64.00MB for key hash table
maxmemory limit 16.00GB reached, eviction policy=volatile-lru failed to reclaim sufficient memory
OOM command not allowed when used memory > 'maxmemory'`,
    symptoms: "Session cache evictions causing auth tokens to invalidate prematurely. Login retries jumped 400%.",
    created_at: "18 min ago",
    first_detected: "21:05:00 UTC",
    recent_change: "No recent deployments in past 24h",
    affected_users: "~1,800 active sessions",
    memory_matches: 7
  },
  {
    id: "INC-082",
    title: "API latency spike",
    service: "Order Service",
    severity: "Medium",
    environment: "Production",
    status: "Resolved",
    logs: `2026-09-27 20:55:12 WARN  [order-worker-4] Response time degraded: 4812ms for POST /orders/confirm
Lock contention detected on table 'orders' row id: 9812401`,
    symptoms: "Cart checkout step takes 8-12 seconds instead of 300ms baseline. High thread lock contention.",
    created_at: "42 min ago",
    first_detected: "20:50:00 UTC",
    recent_change: "Promotional flash sale campaign launched at 20:45 UTC",
    affected_users: "~850 shoppers",
    memory_matches: 3
  },
  {
    id: "INC-081",
    title: "Auth token validation failure",
    service: "Authentication",
    severity: "High",
    environment: "Production",
    status: "Resolved",
    logs: `2026-09-27 18:30:11 ERROR JWT signature verification failed: JWKS public key rotation sync lagged
Key ID 'key-2026-09' unknown to local gateway cache`,
    symptoms: "Microservices rejecting inter-service JWT tokens with 401 Unauthorized.",
    created_at: "2 hours ago",
    first_detected: "18:25:00 UTC",
    recent_change: "Automated quarterly security key rotation triggered",
    affected_users: "All inter-service API traffic",
    memory_matches: 5
  },
  {
    id: "INC-080",
    title: "Kafka consumer group lag critical",
    service: "Inventory API",
    severity: "Medium",
    environment: "Production",
    status: "Resolved",
    logs: `2026-09-27 15:10:04 WARN  org.apache.kafka.clients.consumer.internals.ConsumerCoordinator: 
[Consumer clientId=inv-sync-1, groupId=inventory-order-sync] 
Heartbeat poll timeout expired (300000ms), marking member dead and initiating partition rebalance.`,
    symptoms: "Inventory counts out of sync between warehouse and storefront by up to 15 minutes.",
    created_at: "5 hours ago",
    first_detected: "15:00:00 UTC",
    recent_change: "Batch warehouse stock import initiated",
    affected_users: "Warehouse logistics sync",
    memory_matches: 2
  },
  {
    id: "INC-079",
    title: "Elasticsearch cluster yellow status",
    service: "Search Service",
    severity: "Low",
    environment: "Staging",
    status: "Resolved",
    logs: `2026-09-26 19:40:15 WARN  [es-data-node-03] unassigned shards: [products_2026_09][2] 
reason: ALLOCATION_FAILED, disk watermarks 85% exceeded on disk /dev/nvme1n1`,
    symptoms: "Product catalog autocomplete intermittently failing on staging cluster.",
    created_at: "1 day ago",
    first_detected: "19:35:00 UTC",
    recent_change: "Staging synthetic load test dataset generated",
    affected_users: "Internal QA testers",
    memory_matches: 6
  }
];

export const MOCK_INVESTIGATIONS = {
  "INC-084": {
    incident: INITIAL_INCIDENTS[0],
    memory_matches: [
      {
        incident_id: "INC-073",
        title: "Database connection timeout",
        relevance: 94,
        root_cause: "Connection pool exhaustion",
        previous_resolution: "Increased DB pool size from 80 to 150 and restarted Payment API",
        outcome: "Resolved successfully",
        resolved_in: "11 minutes",
        date: "12 days ago"
      },
      {
        incident_id: "INC-061",
        title: "Payment API database timeout",
        relevance: 89,
        root_cause: "Connection pool exhaustion",
        previous_resolution: "Increased max connections and enabled statement timeout (10s)",
        outcome: "Resolved successfully",
        resolved_in: "8 minutes",
        date: "28 days ago"
      },
      {
        incident_id: "INC-042",
        title: "Postgres connection spike during flash sale",
        relevance: 82,
        root_cause: "Unindexed query hogging connection pool",
        previous_resolution: "Hotfixed query indexes and recycled idle pool connections",
        outcome: "Resolved successfully",
        resolved_in: "19 minutes",
        date: "45 days ago"
      },
      {
        incident_id: "INC-029",
        title: "Connection starvation under traffic surge",
        relevance: 77,
        root_cause: "HikariCP pool leak in order checkout",
        previous_resolution: "Patched connection leak in payment transaction manager",
        outcome: "Resolved successfully",
        resolved_in: "14 minutes",
        date: "62 days ago"
      }
    ],
    analysis: {
      summary: "Critical database connection pool exhaustion detected on Payment API cluster. Symptoms, active pool saturation (active=100/100), and socket timeout error signatures strongly mirror historical incidents INC-073 and INC-061 following release v2.14.2.",
      likely_root_cause: "Database connection pool exhaustion caused by high concurrent transaction hold times during Stripe webhook validation.",
      recommended_steps: [
        "Check active database connections on postgres-primary-pool.",
        "Compare active connections against pool limits (active=100 max=100).",
        "Increase connection pool if exhaustion is confirmed (bump max-pool-size to 150).",
        "Restart affected service if required to purge leaked connection handles.",
        "Monitor connection recovery and payment webhook latencies."
      ],
      recommended_resolution: "Temporarily scale HikariCP max-pool-size from 100 to 150 in the helm config and roll restart Payment API pods to release deadlocked handles. This restored full throughput in INC-073 within 11 minutes.",
      confidence: 94,
      reasoning: "3 similar historical incidents were found in Hindsight memory. 2 previously successful resolutions involved database connection pool exhaustion with identical error signature."
    }
  },
  "INC-083": {
    incident: INITIAL_INCIDENTS[1],
    memory_matches: [
      {
        incident_id: "INC-055",
        title: "Redis cluster OOM kill",
        relevance: 96,
        root_cause: "Memory leak from unbound session cache keys lacking TTL",
        previous_resolution: "Configured maxmemory-policy allkeys-lru and applied batch expiration script",
        outcome: "Resolved successfully",
        resolved_in: "14 minutes",
        date: "34 days ago"
      },
      {
        incident_id: "INC-038",
        title: "Redis latency degraded due to memory fragmentation",
        relevance: 87,
        root_cause: "Memory fragmentation ratio > 2.8 on cache shard 01",
        previous_resolution: "Triggered active defragmentation and scaled memory limit",
        outcome: "Resolved successfully",
        resolved_in: "9 minutes",
        date: "51 days ago"
      }
    ],
    analysis: {
      summary: "Cache Service has reached the 16.00GB maxmemory ceiling. Key eviction failed to keep pace with new session allocations.",
      likely_root_cause: "Volatile-LRU policy unable to evict non-expiring session keys during traffic surge.",
      recommended_steps: [
        "Inspect Redis `INFO memory` for fragmentation and used memory breakdown.",
        "Verify maxmemory-policy configuration (`CONFIG GET maxmemory-policy`).",
        "Switch eviction policy to `allkeys-lru` or flush orphaned guest sessions.",
        "Ensure memory metrics stabilize below 80% threshold."
      ],
      recommended_resolution: "Execute emergency eviction of guest cart keys without TTL and enable allkeys-lru eviction policy.",
      confidence: 92,
      reasoning: "2 historical incidents matched Redis OOM patterns. Past incident INC-055 was successfully resolved with identical LRU policy shift."
    }
  }
};

export const MOCK_MEMORY_STATS = {
  total_memories: 84,
  incidents_learned: 67,
  successful_resolutions: 52,
  learned_patterns: 12,
  growth: [
    { date: "Day 1", count: 12 },
    { date: "Day 2", count: 18 },
    { date: "Day 3", count: 27 },
    { date: "Day 4", count: 39 },
    { date: "Day 5", count: 51 },
    { date: "Day 6", count: 67 },
    { date: "Day 7", count: 84 }
  ]
};

export const MOCK_LEARNED_PATTERNS = [
  {
    id: "pat-1",
    pattern: "Database Timeout",
    cause: "Connection Pool Exhaustion",
    incidents: 7,
    successful_resolutions: 6,
    success_rate: 86,
    last_seen: "2 hours ago",
    related_services: ["Payment API", "Order Service"],
    description: "Occurs when concurrent read/write transactions exceed client connection pool capacity, commonly triggered after deployments with unindexed query loops.",
    preventive_rule: "Enforce connection checkout timeouts (<= 5s) and monitor HikariCP active-to-max ratio alert at 80%."
  },
  {
    id: "pat-2",
    pattern: "Redis OOM",
    cause: "Memory Leak",
    incidents: 5,
    successful_resolutions: 5,
    success_rate: 100,
    last_seen: "5 hours ago",
    related_services: ["Cache Service", "API Gateway"],
    description: "Unbounded key generation without TTL on session caching under high traffic causing out-of-memory errors and evictions.",
    preventive_rule: "Enforce strict TTL default on all session cache keys and configure allkeys-lru fallback eviction."
  },
  {
    id: "pat-3",
    pattern: "API 500 Errors",
    cause: "Database Deadlock",
    incidents: 4,
    successful_resolutions: 3,
    success_rate: 75,
    last_seen: "1 day ago",
    related_services: ["Inventory API", "Order Service"],
    description: "Concurrent row updates acquiring table locks in conflicting order during checkout causing postgres transaction aborts.",
    preventive_rule: "Order database row locks deterministically by sorted primary ID during batch mutations."
  },
  {
    id: "pat-4",
    pattern: "Kafka Lag Spike",
    cause: "Consumer Heartbeat Timeout",
    incidents: 3,
    successful_resolutions: 3,
    success_rate: 100,
    last_seen: "2 days ago",
    related_services: ["Inventory API", "Notification Service"],
    description: "Long stop-the-world GC pauses or synchronous HTTP calls inside Kafka consumer poll loop causing coordinator eviction.",
    preventive_rule: "Offload asynchronous processing to thread workers and increase max.poll.interval.ms."
  }
];

export const MOCK_TIMELINE_EVENTS = [
  {
    time: "09:12",
    incident_id: "INC-081",
    action: "Incident Resolved",
    description: "Root cause identified: Database pool exhaustion",
    status_label: "Memory Retained",
    type: "retained"
  },
  {
    time: "10:47",
    incident_id: "INC-082",
    action: "Incident Resolved",
    description: "Similar pattern detected: Query lock contention on order tables",
    status_label: "Memory Reinforced",
    type: "reinforced"
  },
  {
    time: "12:31",
    incident_id: "INC-083",
    action: "Incident Investigated",
    description: "Previous resolution recalled: 2 matching memories applied to Redis OOM",
    status_label: "Memory Recalled",
    type: "recalled"
  },
  {
    time: "13:05",
    incident_id: "INC-083",
    action: "Incident Resolved",
    description: "New successful outcome retained: LRU eviction fix validated",
    status_label: "Memory Retained",
    type: "retained"
  }
];
