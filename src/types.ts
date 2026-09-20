export type JsonSchemaDraftVersion = '2020-12' | 'draft-07' | 'draft-04';

export interface SchemaValidationDiagnostic {
  path: string;
  keyword: string;
  message: string;
  severity: 'error' | 'warning';
  fixSuggestion?: string;
}

export interface SchemaValidationRuleCheck {
  id: string;
  name: string;
  status: 'passed' | 'failed' | 'warning';
  details: string;
}

export interface SchemaValidationReport {
  isValid: boolean;
  draft: JsonSchemaDraftVersion;
  draftUri: string;
  errorCount: number;
  warningCount: number;
  passedCount: number;
  totalChecks: number;
  evaluatedAt: string;
  rules: SchemaValidationRuleCheck[];
  diagnostics: SchemaValidationDiagnostic[];
}

export interface ToolParameter {
  name: string;
  type: string;
  description?: string;
  required: boolean;
  defaultValue?: string | number | boolean;
}

export interface RawToolDefinition {
  id: string;
  rawName: string;
  category: 'weather' | 'payment' | 'database' | 'calendar' | 'search' | 'inventory';
  vendor: string;
  rawDescription: string;
  rawJson: string;
  parameters: ToolParameter[];
}

export interface CanonicalToolOutput {
  canonicalName: string;
  canonicalDescription: string;
  parameters: ToolParameter[];
  pydanticCode: string;
  canonicalJson: string;
  metadata: {
    sourceTool: string;
    normalizationTimestamp: string;
    status: 'normalized' | 'validated';
    confidenceScore: number;
    semanticSimilarity: number;
    parameterFidelity: string;
    schemaValidStatus: 'PASSED' | 'FAILED';
    tokensUsed: number;
    latencyMs: number;
  };
}

export interface BenchmarkToolItem {
  id: number;
  category: string;
  rawToolName: string;
  canonicalToolName: string;
  semanticSimilarity: number;
  schemaValid: boolean;
  paramsPreserved: string;
  selectionConsistency: number;
}

export interface PipelineStage {
  id: string;
  title: string;
  phase: 'stochastic' | 'bridge' | 'deterministic';
  description: string;
  badge: string;
  outputSample: string;
}

export interface SemanticCluster {
  id: string;
  name: string;
  canonicalTool: string;
  description: string;
  heterogeneousTools: string[];
  queries: string[];
}
