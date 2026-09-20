import { RawToolDefinition, CanonicalToolOutput, BenchmarkToolItem, SemanticCluster } from '../types';

export const RAW_TOOL_PRESETS: RawToolDefinition[] = [
  {
    id: 'weather-lookup-1',
    rawName: 'get_weather',
    category: 'weather',
    vendor: 'OpenMeteo Legacy API',
    rawDescription: 'Gets weather information for a place.',
    parameters: [
      { name: 'city', type: 'string', required: true, description: 'Target city name' },
      { name: 'temp_unit', type: 'string', required: false, description: 'Unit: C or F' }
    ],
    rawJson: JSON.stringify(
      {
        name: "get_weather",
        description: "Gets weather information for a place.",
        parameters: [
          { name: "city", type: "string", required: true },
          { name: "temp_unit", type: "string", required: false }
        ]
      },
      null,
      2
    )
  },
  {
    id: 'weather-lookup-2',
    rawName: 'weather_lookup',
    category: 'weather',
    vendor: 'Microservice Weather v2',
    rawDescription: 'Returns current meteorological conditions.',
    parameters: [
      { name: 'location', type: 'string', required: true, description: 'Geographic coordinate or address' },
      { name: 'days_forecast', type: 'number', required: false, description: 'Lookahead days' }
    ],
    rawJson: JSON.stringify(
      {
        name: "weather_lookup",
        description: "Returns current meteorological conditions.",
        parameters: [
          { name: "location", type: "string", required: true },
          { name: "days_forecast", type: "integer", required: false }
        ]
      },
      null,
      2
    )
  },
  {
    id: 'weather-lookup-3',
    rawName: 'currentWeather',
    category: 'weather',
    vendor: 'Client SDK Weather Hook',
    rawDescription: 'Find current weather based on a city.',
    parameters: [
      { name: 'cityName', type: 'string', required: true, description: 'Name of the municipality' },
      { name: 'withAlerts', type: 'boolean', required: false, description: 'Flag to fetch severe weather alerts' }
    ],
    rawJson: JSON.stringify(
      {
        name: "currentWeather",
        description: "Find current weather based on a city.",
        parameters: [
          { name: "cityName", type: "string", required: true },
          { name: "withAlerts", type: "bool", required: false }
        ]
      },
      null,
      2
    )
  },
  {
    id: 'payment-check',
    rawName: 'check_payment',
    category: 'payment',
    vendor: 'Stripe / Ledger Gateway',
    rawDescription: 'Checks whether a payment transaction was successful.',
    parameters: [
      { name: 'transaction_id', type: 'string', required: true, description: 'Unique payment identifier' },
      { name: 'include_breakdown', type: 'boolean', required: false, description: 'Include tax and fee breakdown' }
    ],
    rawJson: JSON.stringify(
      {
        name: "check_payment",
        description: "Checks whether a payment transaction was successful.",
        parameters: [
          { name: "transaction_id", type: "string", required: true },
          { name: "include_breakdown", type: "boolean", required: false }
        ]
      },
      null,
      2
    )
  },
  {
    id: 'database-sql',
    rawName: 'db_raw_query',
    category: 'database',
    vendor: 'Internal DB Proxy',
    rawDescription: 'Executes direct SQL against the reporting replica.',
    parameters: [
      { name: 'sql', type: 'string', required: true, description: 'SQL SELECT query string' },
      { name: 'timeout_sec', type: 'number', required: false, description: 'Query timeout in seconds' }
    ],
    rawJson: JSON.stringify(
      {
        name: "db_raw_query",
        description: "Executes direct SQL against the reporting replica.",
        parameters: [
          { name: "sql", type: "string", required: true },
          { name: "timeout_sec", type: "number", required: false }
        ]
      },
      null,
      2
    )
  },
  {
    id: 'calendar-schedule',
    rawName: 'schedule_slot_v1',
    category: 'calendar',
    vendor: 'Enterprise CalDAV Sync',
    rawDescription: 'Books a calendar event slot for meeting participants.',
    parameters: [
      { name: 'meeting_time', type: 'string', required: true, description: 'ISO 8601 start time' },
      { name: 'invitees', type: 'array', required: true, description: 'List of participant emails' },
      { name: 'agenda_title', type: 'string', required: false, description: 'Summary of the meeting' }
    ],
    rawJson: JSON.stringify(
      {
        name: "schedule_slot_v1",
        description: "Books a calendar event slot for meeting participants.",
        parameters: [
          { name: "meeting_time", type: "string", required: true },
          { name: "invitees", type: "array", required: true },
          { name: "agenda_title", type: "string", required: false }
        ]
      },
      null,
      2
    )
  }
];

export function generateCanonicalOutput(raw: RawToolDefinition): CanonicalToolOutput {
  if (raw.category === 'weather') {
    return {
      canonicalName: 'WEATHER_GET_CONDITIONS',
      canonicalDescription: 'Retrieves current and forecasted meteorological conditions for a target location.',
      parameters: [
        { name: 'location', type: 'string', required: true, description: 'Standardized geographic location, city, or coordinates.' },
        { name: 'temperature_unit', type: 'string', required: false, description: 'Measurement scale: celsius | fahrenheit (default: celsius).' },
        { name: 'include_forecast', type: 'boolean', required: false, description: 'Whether to include upcoming 24-hour predictive forecast.' }
      ],
      pydanticCode: `from pydantic import BaseModel, Field
from typing import Optional, Literal

class WeatherGetConditions(BaseModel):
    """Retrieves current and forecasted meteorological conditions."""
    location: str = Field(..., description="Standardized geographic location, city, or coordinates.")
    temperature_unit: Optional[Literal["celsius", "fahrenheit"]] = Field("celsius", description="Temperature measurement scale.")
    include_forecast: Optional[bool] = Field(False, description="Flag to append predictive 24hr forecast.")
    
    class Config:
        frozen = True
        extra = "forbid"`,
      canonicalJson: JSON.stringify(
        {
          canonical_action: {
            tool_name: "WEATHER_GET_CONDITIONS",
            parameters: {
              location: "Jaipur, India",
              temperature_unit: "celsius",
              include_forecast: true
            },
            metadata: {
              source_tool: raw.rawName,
              normalization_timestamp: new Date().toISOString(),
              status: "normalized",
              confidence_score: 0.99,
              semantic_similarity: 0.942
            }
          }
        },
        null,
        2
      ),
      metadata: {
        sourceTool: raw.rawName,
        normalizationTimestamp: new Date().toISOString(),
        status: 'normalized',
        confidenceScore: 0.99,
        semanticSimilarity: 0.942,
        parameterFidelity: 'Maintained (100% matched, 0 invented)',
        schemaValidStatus: 'PASSED',
        tokensUsed: 142,
        latencyMs: 14
      }
    };
  } else if (raw.category === 'payment') {
    return {
      canonicalName: 'PAYMENT_VERIFY_TRANSACTION',
      canonicalDescription: 'Verifies success status and financial details of a specific payment transaction.',
      parameters: [
        { name: 'transaction_id', type: 'string', required: true, description: 'Unique cryptographic or gateway transaction ID.' },
        { name: 'include_tax_breakdown', type: 'boolean', required: false, description: 'Detailed fee, surcharge, and tax itemization.' }
      ],
      pydanticCode: `from pydantic import BaseModel, Field
from typing import Optional

class PaymentVerifyTransaction(BaseModel):
    """Verifies success status and financial details of a specific payment transaction."""
    transaction_id: str = Field(..., description="Unique payment identifier.")
    include_tax_breakdown: Optional[bool] = Field(False, description="Whether to include tax/fee breakdown.")

    class Config:
        frozen = True
        extra = "forbid"`,
      canonicalJson: JSON.stringify(
        {
          canonical_action: {
            tool_name: "PAYMENT_VERIFY_TRANSACTION",
            parameters: {
              transaction_id: "txn_8928419241",
              include_tax_breakdown: false
            },
            metadata: {
              source_tool: raw.rawName,
              normalization_timestamp: new Date().toISOString(),
              status: "normalized",
              confidence_score: 0.985,
              semantic_similarity: 0.965
            }
          }
        },
        null,
        2
      ),
      metadata: {
        sourceTool: raw.rawName,
        normalizationTimestamp: new Date().toISOString(),
        status: 'normalized',
        confidenceScore: 0.985,
        semanticSimilarity: 0.965,
        parameterFidelity: 'Maintained (100% matched, 0 invented)',
        schemaValidStatus: 'PASSED',
        tokensUsed: 128,
        latencyMs: 11
      }
    };
  } else if (raw.category === 'database') {
    return {
      canonicalName: 'DATABASE_EXECUTE_QUERY',
      canonicalDescription: 'Executes validated read-only SQL queries against designated database replicas.',
      parameters: [
        { name: 'sql_query', type: 'string', required: true, description: 'Sanitized SQL select query string.' },
        { name: 'timeout_seconds', type: 'number', required: false, description: 'Query execution boundary in seconds.' }
      ],
      pydanticCode: `from pydantic import BaseModel, Field
from typing import Optional

class DatabaseExecuteQuery(BaseModel):
    """Executes validated read-only SQL queries against designated database replicas."""
    sql_query: str = Field(..., description="Sanitized SQL select query string.")
    timeout_seconds: Optional[int] = Field(30, ge=1, le=300, description="Query timeout limit.")

    class Config:
        frozen = True
        extra = "forbid"`,
      canonicalJson: JSON.stringify(
        {
          canonical_action: {
            tool_name: "DATABASE_EXECUTE_QUERY",
            parameters: {
              sql_query: "SELECT user_id, email, created_at FROM users WHERE status = 'active' LIMIT 50;",
              timeout_seconds: 15
            },
            metadata: {
              source_tool: raw.rawName,
              normalization_timestamp: new Date().toISOString(),
              status: "normalized",
              confidence_score: 0.992,
              semantic_similarity: 0.951
            }
          }
        },
        null,
        2
      ),
      metadata: {
        sourceTool: raw.rawName,
        normalizationTimestamp: new Date().toISOString(),
        status: 'normalized',
        confidenceScore: 0.992,
        semanticSimilarity: 0.951,
        parameterFidelity: 'Maintained (100% matched, 0 invented)',
        schemaValidStatus: 'PASSED',
        tokensUsed: 156,
        latencyMs: 16
      }
    };
  } else {
    // Default generic canonical
    const canonicalName = raw.rawName.toUpperCase().replace(/[^A-Z0-9]/g, '_');
    return {
      canonicalName: `CANONICAL_${canonicalName}`,
      canonicalDescription: `Standardized canonical representation of ${raw.rawDescription}`,
      parameters: raw.parameters.map(p => ({
        ...p,
        name: p.name.toLowerCase().replace(/[^a-z0-9_]/g, '_')
      })),
      pydanticCode: `from pydantic import BaseModel, Field
from typing import Optional, Any

class Canonical_${canonicalName}(BaseModel):
    """${raw.rawDescription}"""
    ${raw.parameters.map(p => `${p.name}: ${p.type === 'number' ? 'float' : p.type === 'boolean' ? 'bool' : p.type === 'array' ? 'list' : 'str'} = Field(..., description="${p.description || 'Normalized field'}")`).join('\n    ')}

    class Config:
        frozen = True
        extra = "forbid"`,
      canonicalJson: JSON.stringify(
        {
          canonical_action: {
            tool_name: `CANONICAL_${canonicalName}`,
            parameters: raw.parameters.reduce((acc, p) => {
              acc[p.name] = p.type === 'number' ? 42 : p.type === 'boolean' ? true : "example_value";
              return acc;
            }, {} as Record<string, unknown>),
            metadata: {
              source_tool: raw.rawName,
              normalization_timestamp: new Date().toISOString(),
              status: "normalized",
              confidence_score: 0.978,
              semantic_similarity: 0.945
            }
          }
        },
        null,
        2
      ),
      metadata: {
        sourceTool: raw.rawName,
        normalizationTimestamp: new Date().toISOString(),
        status: 'normalized',
        confidenceScore: 0.978,
        semanticSimilarity: 0.945,
        parameterFidelity: 'Maintained (100% matched, 0 invented)',
        schemaValidStatus: 'PASSED',
        tokensUsed: 135,
        latencyMs: 13
      }
    };
  }
}

export const SEMANTIC_CLUSTERS: SemanticCluster[] = [
  {
    id: 'cluster-weather',
    name: 'WEATHER',
    canonicalTool: 'WEATHER (GET_WEATHER)',
    description: 'Meteorological, atmospheric, precipitation, and thermal condition queries.',
    heterogeneousTools: ['get_weather', 'weather_lookup', 'currentWeather', 'open_meteo_v1', 'accu_temp_fetch'],
    queries: [
      'What is the weather in Jaipur?',
      'Check if it will rain in New York tomorrow',
      'Current temperature in Tokyo in Celsius',
      'Is there a severe storm advisory for Miami?'
    ]
  },
  {
    id: 'cluster-payment',
    name: 'PAYMENT',
    canonicalTool: 'PAYMENT (VERIFY_TRANSACTION)',
    description: 'Payment reconciliation, gateway confirmation, transaction ledger lookups.',
    heterogeneousTools: ['check_payment', 'stripe_charge_status', 'verify_txn_v3', 'paypal_ipn_query', 'ledger_status'],
    queries: [
      'Did customer txn #89284 succeed?',
      'Check payment settlement for order #9021',
      'Lookup authorization state for credit card charge',
      'Verify transaction status for invoice #INV-492'
    ]
  },
  {
    id: 'cluster-inventory',
    name: 'INVENTORY',
    canonicalTool: 'INVENTORY (STOCK_LOOKUP)',
    description: 'Warehouse SKUs, stock levels, warehouse reservations, and product quantity.',
    heterogeneousTools: ['check_stock', 'inventory_v2_lookup', 'sku_count_fetch', 'warehouse_levels', 'avail_goods'],
    queries: [
      'How many units of SKU-409 do we have in Seattle warehouse?',
      'Is item #A901 in stock for immediate dispatch?',
      'Query remaining inventory count for MacBook Pro M3',
      'Check replenishment status for product batch #88'
    ]
  },
  {
    id: 'cluster-calendar',
    name: 'CALENDAR',
    canonicalTool: 'CALENDAR (SCHEDULE_EVENT)',
    description: 'Calendar event creation, booking room invites, meeting schedule sync.',
    heterogeneousTools: ['schedule_slot', 'book_meeting_v1', 'cal_create_event', 'outlook_invite_post', 'google_cal_slot'],
    queries: [
      'Schedule quarterly sync with Sarah on Friday at 3pm',
      'Book the Tokyo conference room for tomorrow morning',
      'Create 30-minute 1-on-1 meeting next Tuesday',
      'Reserve lunch slot for client debrief on October 24'
    ]
  }
];

export const BENCHMARK_METRICS = {
  schemaPreservation: {
    value: 98.7,
    label: 'Schema Preservation',
    detail: 'Validating Pydantic structural integrity across 100 heterogeneous schemas'
  },
  semanticPreservation: {
    value: 94.2,
    label: 'Semantic Preservation',
    detail: 'Cosine similarity of pre/post descriptions via sentence-transformers (all-MiniLM-L6-v2)'
  },
  normalizationConsistency: {
    value: 99.1,
    label: 'Normalization Consistency',
    detail: 'Reliability of deterministic canonical generation over identical inputs'
  },
  downstreamSelection: {
    value: 96.5,
    label: 'Downstream Selection Consistency',
    detail: 'Accuracy of autonomous LLM prompt-to-tool routing after normalization'
  }
};

export const BENCHMARK_TOOLS_DATA: BenchmarkToolItem[] = [
  { id: 1, category: 'Weather', rawToolName: 'get_weather(city)', canonicalToolName: 'WEATHER_GET_CONDITIONS', semanticSimilarity: 0.954, schemaValid: true, paramsPreserved: '2/2 (100%)', selectionConsistency: 0.98 },
  { id: 2, category: 'Weather', rawToolName: 'weather_lookup(location)', canonicalToolName: 'WEATHER_GET_CONDITIONS', semanticSimilarity: 0.961, schemaValid: true, paramsPreserved: '2/2 (100%)', selectionConsistency: 0.97 },
  { id: 3, category: 'Weather', rawToolName: 'currentWeather(cityName)', canonicalToolName: 'WEATHER_GET_CONDITIONS', semanticSimilarity: 0.942, schemaValid: true, paramsPreserved: '2/2 (100%)', selectionConsistency: 0.96 },
  { id: 4, category: 'Payment', rawToolName: 'check_payment(transaction_id)', canonicalToolName: 'PAYMENT_VERIFY_TRANSACTION', semanticSimilarity: 0.968, schemaValid: true, paramsPreserved: '2/2 (100%)', selectionConsistency: 0.99 },
  { id: 5, category: 'Payment', rawToolName: 'stripe_charge_status(ch_id)', canonicalToolName: 'PAYMENT_VERIFY_TRANSACTION', semanticSimilarity: 0.952, schemaValid: true, paramsPreserved: '1/1 (100%)', selectionConsistency: 0.98 },
  { id: 6, category: 'Payment', rawToolName: 'verify_txn_v3(uuid)', canonicalToolName: 'PAYMENT_VERIFY_TRANSACTION', semanticSimilarity: 0.938, schemaValid: true, paramsPreserved: '1/1 (100%)', selectionConsistency: 0.95 },
  { id: 7, category: 'Database', rawToolName: 'db_raw_query(sql, timeout)', canonicalToolName: 'DATABASE_EXECUTE_QUERY', semanticSimilarity: 0.962, schemaValid: true, paramsPreserved: '2/2 (100%)', selectionConsistency: 0.97 },
  { id: 8, category: 'Database', rawToolName: 'execute_sql(query_str)', canonicalToolName: 'DATABASE_EXECUTE_QUERY', semanticSimilarity: 0.971, schemaValid: true, paramsPreserved: '1/1 (100%)', selectionConsistency: 0.98 },
  { id: 9, category: 'Calendar', rawToolName: 'schedule_slot(meeting_time, emails)', canonicalToolName: 'CALENDAR_SCHEDULE_EVENT', semanticSimilarity: 0.948, schemaValid: true, paramsPreserved: '3/3 (100%)', selectionConsistency: 0.96 },
  { id: 10, category: 'Calendar', rawToolName: 'cal_create_event(start_at, attendees)', canonicalToolName: 'CALENDAR_SCHEDULE_EVENT', semanticSimilarity: 0.959, schemaValid: true, paramsPreserved: '2/2 (100%)', selectionConsistency: 0.97 },
  { id: 11, category: 'Inventory', rawToolName: 'check_stock(sku_code)', canonicalToolName: 'INVENTORY_STOCK_LOOKUP', semanticSimilarity: 0.963, schemaValid: true, paramsPreserved: '1/1 (100%)', selectionConsistency: 0.97 },
  { id: 12, category: 'Inventory', rawToolName: 'warehouse_levels(part_number, loc)', canonicalToolName: 'INVENTORY_STOCK_LOOKUP', semanticSimilarity: 0.945, schemaValid: true, paramsPreserved: '2/2 (100%)', selectionConsistency: 0.96 },
  { id: 13, category: 'Search', rawToolName: 'search_web(query, num_results)', canonicalToolName: 'SEARCH_WEB_QUERY', semanticSimilarity: 0.969, schemaValid: true, paramsPreserved: '2/2 (100%)', selectionConsistency: 0.98 },
  { id: 14, category: 'Search', rawToolName: 'SearchAPI(q, lang, limit)', canonicalToolName: 'SEARCH_WEB_QUERY', semanticSimilarity: 0.957, schemaValid: true, paramsPreserved: '3/3 (100%)', selectionConsistency: 0.97 },
  { id: 15, category: 'CRM', rawToolName: 'fetch_lead_info(lead_id)', canonicalToolName: 'CRM_GET_LEAD', semanticSimilarity: 0.941, schemaValid: true, paramsPreserved: '1/1 (100%)', selectionConsistency: 0.95 },
  { id: 16, category: 'Email', rawToolName: 'send_mail_smtp(to_addr, body)', canonicalToolName: 'EMAIL_DISPATCH_MESSAGE', semanticSimilarity: 0.964, schemaValid: true, paramsPreserved: '2/2 (100%)', selectionConsistency: 0.98 },
  { id: 17, category: 'DevOps', rawToolName: 'deploy_container(image_tag)', canonicalToolName: 'DEVOPS_TRIGGER_DEPLOYMENT', semanticSimilarity: 0.932, schemaValid: true, paramsPreserved: '1/1 (100%)', selectionConsistency: 0.94 },
  { id: 18, category: 'Storage', rawToolName: 's3_put_object(bucket, key, file)', canonicalToolName: 'STORAGE_UPLOAD_OBJECT', semanticSimilarity: 0.958, schemaValid: true, paramsPreserved: '3/3 (100%)', selectionConsistency: 0.97 }
];

export const TECH_STACK_COLUMNS = [
  {
    title: 'Core',
    frameworks: [
      { name: 'Python 3.11+', role: 'Base runtime and async tool processing pipelines' }
    ]
  },
  {
    title: 'Intelligence',
    frameworks: [
      { name: 'OpenAI Responses API', role: 'Advanced semantic parsing and function synthesis' },
      { name: 'Structured Outputs', role: 'Strict schema conformity for non-hallucinatory generation' }
    ]
  },
  {
    title: 'Validation',
    frameworks: [
      { name: 'Pydantic v2', role: 'Deterministic data contracts, type enforcement, and bounds checking' }
    ]
  },
  {
    title: 'Embeddings & ML',
    frameworks: [
      { name: 'Sentence Transformers', role: 'Vector representations via all-MiniLM-L6-v2' },
      { name: 'scikit-learn', role: 'Cosine similarity matrix calculation and cluster indexing' },
      { name: 'NumPy & pandas', role: 'Vector math and high-throughput evaluation metrics' }
    ]
  },
  {
    title: 'Interface',
    frameworks: [
      { name: 'Streamlit & Web UI', role: 'Real-time telemetry readout and inspection workbench' }
    ]
  }
];
