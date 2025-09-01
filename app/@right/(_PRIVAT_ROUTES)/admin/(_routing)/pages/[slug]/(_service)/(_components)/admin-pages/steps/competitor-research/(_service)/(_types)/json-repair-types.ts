// @/app/@right/(_PRIVAT_ROUTES)/admin/(_routing)/pages/[slug]/(_service)/(_components)/admin-pages/steps/competitor-research/(_service)/(_types)/json-repair-types.ts
export interface JsonRepairRequest {
  invalidJsonString: string;
  competitorUrl: string;
  competitorName: string;
  originalInstruction?: string;
}

export interface JsonRepairResult {
  success: boolean;
  repairedData?: any;
  error?: string;
  repairMethod: "openai" | "manual" | "none";
  originalLength: number;
  repairedLength: number;
  confidence: number;
}

export interface JsonRepairState {
  isRepairing: boolean;
  repairResult: JsonRepairResult | null;
  showRepairTool: boolean;
  repairAttempts: number;
}

export type JsonRepairMethod =
  | "openai-generate-object"
  | "openai-chat"
  | "manual";
