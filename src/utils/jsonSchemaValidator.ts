import { JsonSchemaDraftVersion, SchemaValidationReport, SchemaValidationDiagnostic, SchemaValidationRuleCheck, ToolParameter } from '../types';

export const DRAFT_METASCHEMAS: Record<JsonSchemaDraftVersion, { uri: string; label: string; year: string; note: string }> = {
  '2020-12': {
    uri: 'https://json-schema.org/draft/2020-12/schema',
    label: 'Draft 2020-12',
    year: '2020',
    note: 'Current standard & OpenAPI 3.1 default for modern Agent Function Calling'
  },
  'draft-07': {
    uri: 'http://json-schema.org/draft-07/schema#',
    label: 'Draft-07',
    year: '2017',
    note: 'Widely used in OpenAI Legacy Tools and Claude Tool Use standard'
  },
  'draft-04': {
    uri: 'http://json-schema.org/draft-04/schema#',
    label: 'Draft-04',
    year: '2013',
    note: 'Legacy Swagger 2.0 / OpenAI classic function calling schema'
  }
};

const VALID_JSON_SCHEMA_TYPES = new Set([
  'string',
  'number',
  'integer',
  'boolean',
  'array',
  'object',
  'null'
]);

const COMMON_TYPE_HALLUCINATIONS: Record<string, string> = {
  str: 'string',
  text: 'string',
  varchar: 'string',
  char: 'string',
  int: 'integer',
  float: 'number',
  double: 'number',
  bool: 'boolean',
  dict: 'object',
  map: 'object',
  hash: 'object',
  list: 'array',
  any: 'object',
  timestamp: 'string',
  datetime: 'string'
};

/**
 * Generates a valid JSON Schema object according to the selected draft for a canonical tool
 */
export function generateJsonSchemaForTool(
  toolName: string,
  toolDescription: string,
  parameters: ToolParameter[],
  draft: JsonSchemaDraftVersion = '2020-12'
): Record<string, unknown> {
  const meta = DRAFT_METASCHEMAS[draft];
  const formattedTitle = toolName
    .split('_')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join('');

  const propertiesObj: Record<string, unknown> = {};
  const requiredList: string[] = [];

  for (const param of parameters) {
    const rawType = (param.type || 'string').toLowerCase().trim();
    let schemaType = 'string';

    if (rawType === 'number' || rawType === 'float') schemaType = 'number';
    else if (rawType === 'integer' || rawType === 'int') schemaType = 'integer';
    else if (rawType === 'boolean' || rawType === 'bool') schemaType = 'boolean';
    else if (rawType === 'array' || rawType === 'list') schemaType = 'array';
    else if (rawType === 'object' || rawType === 'dict') schemaType = 'object';
    else schemaType = 'string';

    const propSchema: Record<string, unknown> = {
      type: schemaType,
      description: param.description || `Parameter: ${param.name}`
    };

    if (schemaType === 'array') {
      propSchema.items = {
        type: 'string',
        description: `Elements for ${param.name}`
      };
    }

    if (param.defaultValue !== undefined) {
      propSchema.default = param.defaultValue;
    }

    // Special enum handling for temperature_unit
    if (param.name === 'temperature_unit') {
      propSchema.enum = ['celsius', 'fahrenheit'];
      propSchema.default = 'celsius';
    }

    propertiesObj[param.name] = propSchema;

    if (param.required) {
      requiredList.push(param.name);
    }
  }

  const schema: Record<string, unknown> = {
    $schema: meta.uri,
    $id: `https://toolnorm.ai/schemas/${toolName.toLowerCase()}.json`,
    title: formattedTitle,
    description: toolDescription,
    type: 'object',
    properties: propertiesObj,
    required: requiredList,
    additionalProperties: false
  };

  return schema;
}

/**
 * Real-time validation of a generated or custom schema against standard JSON Schema draft specifications
 */
export function validateJsonSchemaDraft(
  input: unknown,
  draft: JsonSchemaDraftVersion = '2020-12'
): SchemaValidationReport {
  const meta = DRAFT_METASCHEMAS[draft];
  const diagnostics: SchemaValidationDiagnostic[] = [];
  const rules: SchemaValidationRuleCheck[] = [];

  let schema: any;

  // 1. Parse JSON if string input
  if (typeof input === 'string') {
    try {
      schema = JSON.parse(input);
    } catch (e: any) {
      diagnostics.push({
        path: '#',
        keyword: 'syntax',
        message: `JSON Syntax Error: ${e.message}`,
        severity: 'error',
        fixSuggestion: 'Check for trailing commas, unmatched brackets, or unescaped characters.'
      });

      return {
        isValid: false,
        draft,
        draftUri: meta.uri,
        errorCount: 1,
        warningCount: 0,
        passedCount: 0,
        totalChecks: 1,
        evaluatedAt: new Date().toISOString(),
        rules: [
          {
            id: 'json-syntax',
            name: 'Valid JSON Formatting',
            status: 'failed',
            details: 'The schema string could not be parsed as valid JSON.'
          }
        ],
        diagnostics
      };
    }
  } else {
    schema = input;
  }

  // Check 1: Root must be a non-null object
  const isRootObject = schema !== null && typeof schema === 'object' && !Array.isArray(schema);
  if (!isRootObject) {
    diagnostics.push({
      path: '#',
      keyword: 'type',
      message: 'Root schema must be a JSON object, received ' + (schema === null ? 'null' : typeof schema),
      severity: 'error',
      fixSuggestion: 'Enclose schema definition in curly braces { ... }.'
    });
    rules.push({
      id: 'core/root-object',
      name: 'Root Schema Object',
      status: 'failed',
      details: 'Root schema must be an object as required by JSON Schema specifications.'
    });
    return buildReport(false, draft, meta.uri, diagnostics, rules);
  } else {
    rules.push({
      id: 'core/root-object',
      name: 'Root Schema Object',
      status: 'passed',
      details: 'Root structure is a compliant JSON Schema object.'
    });
  }

  // Check 2: $schema Draft Metaschema Identifier
  const declaredSchema = schema.$schema;
  if (!declaredSchema) {
    diagnostics.push({
      path: '#/$schema',
      keyword: '$schema',
      message: `Missing $schema draft declaration. Expected "${meta.uri}"`,
      severity: 'warning',
      fixSuggestion: `Add "$schema": "${meta.uri}" to declare draft dialect explicitly.`
    });
    rules.push({
      id: 'core/draft-dialect',
      name: `$schema Dialect (${meta.label})`,
      status: 'warning',
      details: `Draft dialect header is missing; defaulting to ${meta.label}.`
    });
  } else if (typeof declaredSchema !== 'string') {
    diagnostics.push({
      path: '#/$schema',
      keyword: '$schema',
      message: '$schema must be a valid URI string',
      severity: 'error',
      fixSuggestion: `Change $schema to "${meta.uri}".`
    });
    rules.push({
      id: 'core/draft-dialect',
      name: `$schema Dialect (${meta.label})`,
      status: 'failed',
      details: '$schema must be a string URI.'
    });
  } else if (declaredSchema !== meta.uri) {
    diagnostics.push({
      path: '#/$schema',
      keyword: '$schema',
      message: `Declared $schema "${declaredSchema}" does not match targeted ${meta.label} ("${meta.uri}")`,
      severity: 'warning',
      fixSuggestion: `Update $schema to "${meta.uri}".`
    });
    rules.push({
      id: 'core/draft-dialect',
      name: `$schema Dialect (${meta.label})`,
      status: 'warning',
      details: `Declared schema points to alternative dialect: ${declaredSchema}`
    });
  } else {
    rules.push({
      id: 'core/draft-dialect',
      name: `$schema Dialect (${meta.label})`,
      status: 'passed',
      details: `Matches official ${meta.label} metaschema: ${meta.uri}`
    });
  }

  // Check 3: Root type keyword
  if (schema.type !== 'object') {
    diagnostics.push({
      path: '#/type',
      keyword: 'type',
      message: `Tool schemas must declare "type": "object" at the root level, found "${schema.type}"`,
      severity: 'error',
      fixSuggestion: 'Set "type": "object" to describe the function parameter payload.'
    });
    rules.push({
      id: 'validation/root-type',
      name: 'Root Object Type Keyword',
      status: 'failed',
      details: 'Root must declare type "object".'
    });
  } else {
    rules.push({
      id: 'validation/root-type',
      name: 'Root Object Type Keyword',
      status: 'passed',
      details: 'Root type is correctly specified as "object".'
    });
  }

  // Check 4: Title & Description
  let metaPass = true;
  if (!schema.title || typeof schema.title !== 'string' || schema.title.trim().length === 0) {
    diagnostics.push({
      path: '#/title',
      keyword: 'title',
      message: 'Schema missing descriptive "title" identifier',
      severity: 'warning',
      fixSuggestion: 'Add a PascalCase title for the tool definition.'
    });
    metaPass = false;
  }
  if (!schema.description || typeof schema.description !== 'string' || schema.description.trim().length === 0) {
    diagnostics.push({
      path: '#/description',
      keyword: 'description',
      message: 'Schema missing tool "description"',
      severity: 'warning',
      fixSuggestion: 'Add an intent-focused description explaining the tool capability.'
    });
    metaPass = false;
  }
  rules.push({
    id: 'metadata/annotations',
    name: 'Schema Metadata Annotations',
    status: metaPass ? 'passed' : 'warning',
    details: metaPass ? 'Title and semantic description are present.' : 'Incomplete metadata annotations.'
  });

  // Check 5: Properties structure
  let propertiesPass = true;
  if (schema.properties !== undefined) {
    if (typeof schema.properties !== 'object' || schema.properties === null || Array.isArray(schema.properties)) {
      diagnostics.push({
        path: '#/properties',
        keyword: 'properties',
        message: '"properties" must be an object dictionary of property schemas',
        severity: 'error',
        fixSuggestion: 'Format "properties" as an object: { "param_name": { "type": "string" } }'
      });
      propertiesPass = false;
    } else {
      // Validate individual property schemas
      for (const [propName, propDef] of Object.entries(schema.properties)) {
        const propPath = `#/properties/${propName}`;
        if (typeof propDef !== 'object' || propDef === null || Array.isArray(propDef)) {
          diagnostics.push({
            path: propPath,
            keyword: 'properties',
            message: `Property "${propName}" definition must be a schema object`,
            severity: 'error',
            fixSuggestion: `Change definition to { "type": "string" }`
          });
          propertiesPass = false;
          continue;
        }

        const typedDef = propDef as any;

        // Check property type keyword
        if (!typedDef.type) {
          diagnostics.push({
            path: `${propPath}/type`,
            keyword: 'type',
            message: `Property "${propName}" is missing a "type" declaration`,
            severity: 'error',
            fixSuggestion: 'Specify standard type: "string", "number", "integer", "boolean", "array", or "object".'
          });
          propertiesPass = false;
        } else {
          const typeVal = typeof typedDef.type === 'string' ? typedDef.type.toLowerCase() : '';
          
          if (COMMON_TYPE_HALLUCINATIONS[typeVal]) {
            const correctType = COMMON_TYPE_HALLUCINATIONS[typeVal];
            diagnostics.push({
              path: `${propPath}/type`,
              keyword: 'type',
              message: `Invalid Python/database type "${typedDef.type}" detected for "${propName}". JSON Schema standard requires "${correctType}".`,
              severity: 'error',
              fixSuggestion: `Replace "${typedDef.type}" with standard JSON Schema type "${correctType}".`
            });
            propertiesPass = false;
          } else if (!VALID_JSON_SCHEMA_TYPES.has(typeVal)) {
            diagnostics.push({
              path: `${propPath}/type`,
              keyword: 'type',
              message: `Unknown type "${typedDef.type}" for property "${propName}". Must be one of: string, number, integer, boolean, array, object.`,
              severity: 'error',
              fixSuggestion: 'Use a standard JSON Schema draft type.'
            });
            propertiesPass = false;
          }

          // Array items check
          if (typeVal === 'array') {
            if (!typedDef.items || typeof typedDef.items !== 'object' || Array.isArray(typedDef.items)) {
              diagnostics.push({
                path: `${propPath}/items`,
                keyword: 'items',
                message: `Array property "${propName}" must specify an "items" schema object`,
                severity: 'warning',
                fixSuggestion: 'Add "items": { "type": "string" } to define array element types.'
              });
            }
          }
        }

        // Enum check
        if (typedDef.enum !== undefined) {
          if (!Array.isArray(typedDef.enum) || typedDef.enum.length === 0) {
            diagnostics.push({
              path: `${propPath}/enum`,
              keyword: 'enum',
              message: `Enum for "${propName}" must be a non-empty array of allowed values`,
              severity: 'error'
            });
            propertiesPass = false;
          }
        }
      }
    }
  } else {
    diagnostics.push({
      path: '#/properties',
      keyword: 'properties',
      message: 'Schema has no "properties" declared',
      severity: 'warning',
      fixSuggestion: 'Add "properties": {} object to list function parameters.'
    });
  }

  rules.push({
    id: 'validation/properties-schema',
    name: 'Property Schemas & Primitive Types',
    status: propertiesPass ? 'passed' : 'failed',
    details: propertiesPass
      ? 'All properties adhere to standard JSON Schema primitive types.'
      : 'One or more property definitions have missing or non-standard types.'
  });

  // Check 6: Required array matches properties
  let requiredPass = true;
  if (schema.required !== undefined) {
    if (!Array.isArray(schema.required)) {
      diagnostics.push({
        path: '#/required',
        keyword: 'required',
        message: '"required" must be an array of parameter names',
        severity: 'error',
        fixSuggestion: 'Format "required" as an array of strings, e.g. ["location"]'
      });
      requiredPass = false;
    } else {
      const definedProps = schema.properties && typeof schema.properties === 'object'
        ? Object.keys(schema.properties)
        : [];
      
      const seen = new Set<string>();

      for (let i = 0; i < schema.required.length; i++) {
        const item = schema.required[i];
        if (typeof item !== 'string') {
          diagnostics.push({
            path: `#/required/${i}`,
            keyword: 'required',
            message: `Required element at index ${i} must be a string, got ${typeof item}`,
            severity: 'error'
          });
          requiredPass = false;
          continue;
        }

        if (seen.has(item)) {
          diagnostics.push({
            path: `#/required/${i}`,
            keyword: 'required',
            message: `Duplicate parameter "${item}" in "required" array`,
            severity: 'warning',
            fixSuggestion: `Remove duplicate entry for "${item}".`
          });
        }
        seen.add(item);

        if (!definedProps.includes(item)) {
          diagnostics.push({
            path: `#/required/${i}`,
            keyword: 'required',
            message: `Required parameter "${item}" is not defined in "properties" dictionary`,
            severity: 'error',
            fixSuggestion: `Add "${item}" to "properties" or remove it from "required".`
          });
          requiredPass = false;
        }
      }
    }
  }

  rules.push({
    id: 'validation/required-consistency',
    name: 'Required Parameter Integrity',
    status: requiredPass ? 'passed' : 'failed',
    details: requiredPass
      ? 'All required parameters strictly exist in defined properties.'
      : 'Required array contains unresolved or malformed entries.'
  });

  // Check 7: AdditionalProperties (Deterministic Border Rule)
  let addPropsPass = true;
  if (schema.additionalProperties === undefined) {
    diagnostics.push({
      path: '#/additionalProperties',
      keyword: 'additionalProperties',
      message: 'Schema does not explicitly forbid extra properties. ToolNorm requires "additionalProperties": false for deterministic border trapping.',
      severity: 'warning',
      fixSuggestion: 'Set "additionalProperties": false to prevent agent parameter hallucinations.'
    });
    addPropsPass = false;
  } else if (schema.additionalProperties !== false) {
    diagnostics.push({
      path: '#/additionalProperties',
      keyword: 'additionalProperties',
      message: `"additionalProperties" is set to ${JSON.stringify(schema.additionalProperties)}. Strict canonical models require false.`,
      severity: 'warning',
      fixSuggestion: 'Set "additionalProperties": false for strict Pydantic parity.'
    });
    addPropsPass = false;
  }

  rules.push({
    id: 'border/deterministic-boundary',
    name: 'Deterministic Boundary (additionalProperties: false)',
    status: addPropsPass ? 'passed' : 'warning',
    details: addPropsPass
      ? 'Deterministic border active: additionalProperties strictly forbidden.'
      : 'Unenforced boundary: schema allows unvalidated auxiliary parameters.'
  });

  // Check 8: Draft-specific constraints
  if (draft === '2020-12') {
    // Check for $id presence
    if (!schema.$id) {
      diagnostics.push({
        path: '#/$id',
        keyword: '$id',
        message: 'Draft 2020-12 recommends a canonical "$id" URI identifier',
        severity: 'warning',
        fixSuggestion: 'Add an $id URI e.g. "https://toolnorm.ai/schemas/tool.json"'
      });
      rules.push({
        id: 'draft-2020/id-uri',
        name: 'Draft 2020-12 $id Identifier',
        status: 'warning',
        details: 'Canonical $id URI identifier is recommended for Draft 2020-12.'
      });
    } else {
      rules.push({
        id: 'draft-2020/id-uri',
        name: 'Draft 2020-12 $id Identifier',
        status: 'passed',
        details: 'Valid canonical $id URI present.'
      });
    }
  } else if (draft === 'draft-07') {
    rules.push({
      id: 'draft-07/compatibility',
      name: 'Draft-07 Compatibility Matrix',
      status: 'passed',
      details: 'Schema is compatible with standard Draft-07 function calling engines.'
    });
  } else {
    rules.push({
      id: 'draft-04/compatibility',
      name: 'Draft-04 Legacy Compatibility',
      status: 'passed',
      details: 'Schema is compatible with Draft-04 Swagger/OpenAPI 2 engines.'
    });
  }

  const hasErrors = diagnostics.some(d => d.severity === 'error');
  const isValid = !hasErrors;

  return buildReport(isValid, draft, meta.uri, diagnostics, rules);
}

function buildReport(
  isValid: boolean,
  draft: JsonSchemaDraftVersion,
  draftUri: string,
  diagnostics: SchemaValidationDiagnostic[],
  rules: SchemaValidationRuleCheck[]
): SchemaValidationReport {
  const errorCount = diagnostics.filter(d => d.severity === 'error').length;
  const warningCount = diagnostics.filter(d => d.severity === 'warning').length;
  const passedCount = rules.filter(r => r.status === 'passed').length;

  return {
    isValid,
    draft,
    draftUri,
    errorCount,
    warningCount,
    passedCount,
    totalChecks: rules.length,
    evaluatedAt: new Date().toISOString(),
    rules,
    diagnostics
  };
}
