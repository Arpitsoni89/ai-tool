export interface CandidateTool {
  id: string;
  name: string;
  framework: string;
  parameterKey: string;
  rawSchema: string;
  semanticMatchScore: number;
}

export interface RouterSimulationResult {
  query: string;
  intent: string;
  category: 'weather' | 'payment' | 'inventory' | 'calendar' | 'custom';
  candidateTools: CandidateTool[];
  withoutToolNorm: {
    selectedToolName: string | null;
    generatedPayload: Record<string, any>;
    status: 'failed';
    failureType: 'hallucinated_param' | 'trigger_collision' | 'dropped_argument';
    failureTitle: string;
    failureDescription: string;
    errorMessage: string;
    latencyMs: number;
    trace: { step: string; detail: string; status: 'ok' | 'warning' | 'error' }[];
  };
  withToolNorm: {
    canonicalToolName: string;
    normalizedPayload: Record<string, any>;
    status: 'passed';
    pydanticModel: string;
    confidenceScore: number;
    latencyMs: number;
    ambiguityScore: number;
    trace: { step: string; detail: string; status: 'ok' | 'warning' | 'error' }[];
  };
}

export function simulateAgentRouting(query: string): RouterSimulationResult {
  const q = query.trim().toLowerCase();

  // Weather query
  if (q.includes('weather') || q.includes('temperature') || q.includes('rain') || q.includes('forecast') || q.includes('jaipur')) {
    const locMatch = query.match(/in\s+([A-Za-z\s]+)(\?|$)/i) || query.match(/for\s+([A-Za-z\s]+)(\?|$)/i);
    const location = locMatch ? locMatch[1].trim() : 'Jaipur, India';

    return {
      query,
      intent: 'Retrieve real-time meteorological conditions for geographical region',
      category: 'weather',
      candidateTools: [
        {
          id: 'tool_a',
          name: 'get_weather',
          framework: 'REST v1',
          parameterKey: 'city',
          rawSchema: '{"city": "string"}',
          semanticMatchScore: 0.88
        },
        {
          id: 'tool_b',
          name: 'weather_lookup',
          framework: 'Internal RPC',
          parameterKey: 'location',
          rawSchema: '{"location": "string"}',
          semanticMatchScore: 0.89
        },
        {
          id: 'tool_c',
          name: 'currentWeather',
          framework: 'GraphQL SDK',
          parameterKey: 'cityName',
          rawSchema: '{"cityName": "string"}',
          semanticMatchScore: 0.87
        }
      ],
      withoutToolNorm: {
        selectedToolName: 'get_weather',
        generatedPayload: { loc_target: location, units: 'standard' },
        status: 'failed',
        failureType: 'hallucinated_param',
        failureTitle: '1. Hallucination of Incorrect Parameters',
        failureDescription: `LLM hallucinated parameter key 'loc_target' instead of required 'city' due to conflicting schema definitions across candidates.`,
        errorMessage: `ValidationError: Missing mandatory field 'city'. Unexpected parameter 'loc_target'.`,
        latencyMs: 38,
        trace: [
          { step: 'Vector Retrieval', detail: 'Found 3 competing tools with overlapping scores (0.88, 0.89, 0.87)', status: 'warning' },
          { step: 'Schema Synthesis', detail: 'LLM synthesized hybrid parameter name "loc_target"', status: 'error' },
          { step: 'Invocation', detail: 'Target microservice rejected payload with HTTP 422 Unprocessable Entity', status: 'error' }
        ]
      },
      withToolNorm: {
        canonicalToolName: 'WEATHER_GET_CONDITIONS',
        normalizedPayload: { location: location, temperature_unit: 'celsius', include_forecast: false },
        status: 'passed',
        pydanticModel: 'class WeatherGetConditions(BaseModel): location: str, temperature_unit: Literal["celsius", "fahrenheit"] = "celsius"',
        confidenceScore: 0.992,
        latencyMs: 14,
        ambiguityScore: 0.00,
        trace: [
          { step: 'Vector Retrieval', detail: 'Matched orthogonal canonical cluster: WEATHER (sim: 0.96)', status: 'ok' },
          { step: 'Pydantic Refraction', detail: 'Coerced inputs into strictly typed WeatherGetConditions model', status: 'ok' },
          { step: 'Deterministic Border', detail: 'additionalProperties: false verified. Dispatched with zero errors.', status: 'ok' }
        ]
      }
    };
  }

  // Payment / Transaction query
  if (q.includes('txn') || q.includes('payment') || q.includes('charge') || q.includes('refund') || q.includes('transaction')) {
    const txnMatch = query.match(/#?(\d+)/) || query.match(/txn-?([A-Za-z0-9]+)/i);
    const txnId = txnMatch ? txnMatch[1] : '882';

    return {
      query,
      intent: 'Verify settlement status and authorization code of financial transaction',
      category: 'payment',
      candidateTools: [
        {
          id: 'pay_a',
          name: 'check_transaction_status',
          framework: 'REST API',
          parameterKey: 'txn_id',
          rawSchema: '{"txn_id": "string"}',
          semanticMatchScore: 0.91
        },
        {
          id: 'pay_b',
          name: 'get_payment',
          framework: 'Payment Gateway SDK',
          parameterKey: 'transactionNumber',
          rawSchema: '{"transactionNumber": "string"}',
          semanticMatchScore: 0.90
        },
        {
          id: 'pay_c',
          name: 'verifyCharge',
          framework: 'Stripe Microservice',
          parameterKey: 'charge_id',
          rawSchema: '{"charge_id": "string"}',
          semanticMatchScore: 0.89
        }
      ],
      withoutToolNorm: {
        selectedToolName: 'get_payment',
        generatedPayload: { payment_id: `txn_${txnId}` },
        status: 'failed',
        failureType: 'trigger_collision',
        failureTitle: '2. Failure to Trigger the Optimal Tool & Broken Key Binding',
        failureDescription: `Semantic scores collided at 0.91 vs 0.90. Agent selected 'get_payment' but emitted 'payment_id' instead of 'transactionNumber'.`,
        errorMessage: `GatewayError: 'transactionNumber' is required. Received unmapped key 'payment_id'.`,
        latencyMs: 42,
        trace: [
          { step: 'Intent Analysis', detail: 'High ambiguity between verification RPC and status API', status: 'warning' },
          { step: 'Parameter Binding', detail: 'Failed to bind transaction identifier to target schema', status: 'error' },
          { step: 'Dispatch', detail: 'Payment gateway rejected ambiguous request structure', status: 'error' }
        ]
      },
      withToolNorm: {
        canonicalToolName: 'PAYMENT_VERIFY_TRANSACTION',
        normalizedPayload: { transaction_id: `TXN-${txnId}`, return_receipt: true },
        status: 'passed',
        pydanticModel: 'class PaymentVerifyTransaction(BaseModel): transaction_id: str, return_receipt: bool = True',
        confidenceScore: 0.988,
        latencyMs: 12,
        ambiguityScore: 0.00,
        trace: [
          { step: 'Canonical Clustering', detail: 'Mapped to PAYMENT_VERIFY_TRANSACTION canonical interface', status: 'ok' },
          { step: 'Schema Normalization', detail: 'Normalized transaction reference to standardized string', status: 'ok' },
          { step: 'Border Check', detail: 'All required parameters validated against Draft 2020-12', status: 'ok' }
        ]
      }
    };
  }

  // Inventory / Warehouse query
  if (q.includes('stock') || q.includes('sku') || q.includes('inventory') || q.includes('units') || q.includes('item')) {
    const skuMatch = query.match(/sku-?([A-Za-z0-9]+)/i) || query.match(/item-?([A-Za-z0-9]+)/i);
    const sku = skuMatch ? `SKU-${skuMatch[1].toUpperCase()}` : 'SKU-409';

    return {
      query,
      intent: 'Query live multi-warehouse inventory levels and replenishment threshold',
      category: 'inventory',
      candidateTools: [
        {
          id: 'inv_a',
          name: 'query_inventory',
          framework: 'ERP OData',
          parameterKey: 'sku_code',
          rawSchema: '{"sku_code": "string", "warehouse_id": "string"}',
          semanticMatchScore: 0.92
        },
        {
          id: 'inv_b',
          name: 'stock_level',
          framework: 'Warehouse gRPC',
          parameterKey: 'item_id',
          rawSchema: '{"item_id": "string"}',
          semanticMatchScore: 0.91
        },
        {
          id: 'inv_c',
          name: 'getWarehouseCount',
          framework: 'Inventory REST',
          parameterKey: 'partNumber',
          rawSchema: '{"partNumber": "string"}',
          semanticMatchScore: 0.89
        }
      ],
      withoutToolNorm: {
        selectedToolName: 'query_inventory',
        generatedPayload: { sku_code: sku },
        status: 'failed',
        failureType: 'dropped_argument',
        failureTitle: '3. Dropping Required Arguments Due to Schema Confusion',
        failureDescription: `Sister tool 'stock_level' required only item_id, so the LLM assumed warehouse_id was optional and dropped it.`,
        errorMessage: `ERPException: Missing mandatory parameter 'warehouse_id' for multi-tenant stock query.`,
        latencyMs: 45,
        trace: [
          { step: 'Candidate Filtering', detail: 'Found 3 competing inventory APIs with inconsistent optionality', status: 'warning' },
          { step: 'Parameter Extraction', detail: 'Omitted "warehouse_id" due to cross-schema interference', status: 'error' },
          { step: 'Execution Rejection', detail: 'Target ERP API dropped request with 400 Bad Request', status: 'error' }
        ]
      },
      withToolNorm: {
        canonicalToolName: 'INVENTORY_CHECK_STOCK',
        normalizedPayload: { sku: sku, warehouse_id: 'ALL_FACILITIES', include_reserved: false },
        status: 'passed',
        pydanticModel: 'class InventoryCheckStock(BaseModel): sku: str, warehouse_id: str = "ALL_FACILITIES", include_reserved: bool = False',
        confidenceScore: 0.995,
        latencyMs: 16,
        ambiguityScore: 0.00,
        trace: [
          { step: 'Canonical Resolution', detail: 'Routed to INVENTORY_CHECK_STOCK canonical registry definition', status: 'ok' },
          { step: 'Default Value Injection', detail: 'Supplied safe default warehouse_id="ALL_FACILITIES"', status: 'ok' },
          { step: 'Deterministic Verification', detail: 'Zero argument drops, schema passed Pydantic validation', status: 'ok' }
        ]
      }
    };
  }

  // Calendar / Scheduling query
  if (q.includes('schedule') || q.includes('meeting') || q.includes('calendar') || q.includes('sync') || q.includes('book')) {
    return {
      query,
      intent: 'Create collaborative calendar event with attendees and agenda notification',
      category: 'calendar',
      candidateTools: [
        {
          id: 'cal_a',
          name: 'create_event',
          framework: 'Google Cal v3',
          parameterKey: 'start_time',
          rawSchema: '{"start_time": "ISO8601", "summary": "string"}',
          semanticMatchScore: 0.93
        },
        {
          id: 'cal_b',
          name: 'schedule_meeting',
          framework: 'MS Graph API',
          parameterKey: 'eventTimestamp',
          rawSchema: '{"eventTimestamp": "epoch_ms", "title": "string"}',
          semanticMatchScore: 0.92
        },
        {
          id: 'cal_c',
          name: 'book_slot',
          framework: 'Internal Cal',
          parameterKey: 'date_string',
          rawSchema: '{"date_string": "YYYY-MM-DD", "desc": "string"}',
          semanticMatchScore: 0.88
        }
      ],
      withoutToolNorm: {
        selectedToolName: 'create_event',
        generatedPayload: { summary: 'Sync with product lead', start_time: 'tomorrow 3pm' },
        status: 'failed',
        failureType: 'hallucinated_param',
        failureTitle: '1. Hallucination of Malformed Date Format & Key Confusion',
        failureDescription: `Agent emitted relative natural language string "tomorrow 3pm" instead of required ISO8601 string.`,
        errorMessage: `SchemaValidationError: 'start_time' must match regex format ^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}Z$.`,
        latencyMs: 51,
        trace: [
          { step: 'Date Parsing', detail: 'Failed to reconcile conflicting timestamp schemas (epoch vs ISO)', status: 'warning' },
          { step: 'Serialization', detail: 'Passed raw unparsed colloquial string to strict RFC-3339 endpoint', status: 'error' },
          { step: 'Endpoint Crash', detail: 'Client SDK threw DateTimeParseException', status: 'error' }
        ]
      },
      withToolNorm: {
        canonicalToolName: 'CALENDAR_CREATE_EVENT',
        normalizedPayload: {
          title: 'Sync with Product Lead',
          start_datetime_iso: new Date(Date.now() + 86400000).toISOString().split('T')[0] + 'T15:00:00Z',
          duration_minutes: 30,
          attendees: ['lead@product.org']
        },
        status: 'passed',
        pydanticModel: 'class CalendarCreateEvent(BaseModel): title: str, start_datetime_iso: str, duration_minutes: int = 30',
        confidenceScore: 0.991,
        latencyMs: 15,
        ambiguityScore: 0.00,
        trace: [
          { step: 'Canonical Resolution', detail: 'Normalized to CALENDAR_CREATE_EVENT schema definition', status: 'ok' },
          { step: 'Datetime Coercion', detail: 'Parsed relative time string into standard UTC ISO-8601 format', status: 'ok' },
          { step: 'Deterministic Border', detail: 'Pydantic validation completed with 0 errors in 15ms', status: 'ok' }
        ]
      }
    };
  }

  // Custom / Fallback query
  const words = query.split(/\s+/).filter(w => w.length > 2);
  const derivedName = words.slice(0, 2).join('_').toLowerCase();

  return {
    query,
    intent: `Execute autonomous function based on prompt: "${query}"`,
    category: 'custom',
    candidateTools: [
      {
        id: 'cust_a',
        name: `execute_${derivedName}`,
        framework: 'Legacy Service',
        parameterKey: 'data_in',
        rawSchema: '{"data_in": "string"}',
        semanticMatchScore: 0.84
      },
      {
        id: 'cust_b',
        name: `${derivedName}_handler`,
        framework: 'Modern REST',
        parameterKey: 'input_query',
        rawSchema: '{"input_query": "string"}',
        semanticMatchScore: 0.83
      }
    ],
    withoutToolNorm: {
      selectedToolName: `execute_${derivedName}`,
      generatedPayload: { query_text: query, unvalidated_token: '0x39f' },
      status: 'failed',
      failureType: 'hallucinated_param',
      failureTitle: '1. Semantic Drift and Parameter Hallucination',
      failureDescription: `LLM could not resolve ambiguous signatures between competing APIs and invented parameter 'query_text'.`,
      errorMessage: `400 Bad Request: Unknown field 'query_text'. Expected 'data_in'.`,
      latencyMs: 44,
      trace: [
        { step: 'Catalog Lookup', detail: 'Found multiple unstandardized tool definitions', status: 'warning' },
        { step: 'Parameter Guessing', detail: 'Generated arbitrary keys due to lack of canonical contract', status: 'error' },
        { step: 'Execution Failure', detail: 'Target API failed with schema violation', status: 'error' }
      ]
    },
    withToolNorm: {
      canonicalToolName: `CANONICAL_${derivedName.toUpperCase()}`,
      normalizedPayload: { query: query, target_environment: 'production', validate_payload: true },
      status: 'passed',
      pydanticModel: `class Canonical${derivedName}(BaseModel): query: str, target_environment: str = "production"`,
      confidenceScore: 0.978,
      latencyMs: 14,
      ambiguityScore: 0.00,
      trace: [
        { step: 'Refraction Pipeline', detail: 'Normalized prompt intent into canonical action interface', status: 'ok' },
        { step: 'Deterministic Border', detail: 'Enforced additionalProperties: false boundary', status: 'ok' },
        { step: 'Safe Dispatch', detail: 'Guaranteed deterministic execution contract', status: 'ok' }
      ]
    }
  };
}
