import { AdminPageTab } from "../(_context)/admin-pages-nav-context";

export type IndicatorStatus = "gray" | "orange" | "green";
export type StepType = "required" | "optional";

export interface AdminPageTabConfig {
  key: AdminPageTab;
  label: string;
  title: string;
  description: string;
  hasIndicator: boolean;
  defaultIndicatorStatus?: IndicatorStatus;
  etapNumber?: number;
  stepType: StepType;
  dependencies?: AdminPageTab[];
  titleForRequired?: string; // Новое поле для отображения в режиме Required Only
}

export const ADMIN_PAGES_TABS: AdminPageTabConfig[] = [
  {
    key: "info",
    label: "Info",
    title: "Page Basics & Production Metadata ",
    description:
      "Page’s core details and final-state SEO metadata ready for live deployment.",
    hasIndicator: false,
    stepType: "optional",
  },
  {
    key: "step1",
    label: "Step 1",
    title: "Competitor Analysis",
    description:
      "Systematic research of competitors with meta-properties and content structure extraction",
    hasIndicator: true,
    defaultIndicatorStatus: "orange",
    etapNumber: 1,
    stepType: "optional",
    dependencies: [],
  },
  {
    key: "step2",
    label: "Step 2",
    title: "Load Analysis Results",
    description: "Integration and structuring of Perplexity research results",
    hasIndicator: true,
    defaultIndicatorStatus: "gray",
    etapNumber: 2,
    stepType: "optional",
    dependencies: ["step1"],
  },
  {
    key: "step3",
    label: "Step 3",
    title: "Structure Design",
    description:
      "Creating optimal project structure based on competitor analysis",
    hasIndicator: true,
    defaultIndicatorStatus: "orange",
    etapNumber: 3,
    stepType: "optional",
    dependencies: [],
  },
  {
    key: "step4",
    label: "Step 4",
    title: "Business Information Mixer",
    description:
      "Integration of proprietary expert information for unique content creation",
    hasIndicator: true,
    defaultIndicatorStatus: "orange",
    etapNumber: 4,
    stepType: "optional",
    dependencies: [],
  },
  {
    key: "step5",
    label: "Step 5",
    title: "Generator Configuration",
    description:
      "Creating customized system instructions for section generation",
    hasIndicator: true,
    defaultIndicatorStatus: "orange",
    etapNumber: 5,
    stepType: "required",
    dependencies: [],
    titleForRequired: "Step 1", // В режиме Required Only показывается как Step 1
  },
  {
    key: "step6",
    label: "Step 6",
    title: "Load Project Schema",
    description:
      "Integration of detailed technical specifications into working schema",
    hasIndicator: true,
    defaultIndicatorStatus: "gray",
    etapNumber: 6,
    stepType: "required",
    dependencies: ["step5"],
    titleForRequired: "Step 2", // В режиме Required Only показывается как Step 2
  },
  {
    key: "step7",
    label: "Step 7",
    title: "Section Design & Setup",
    description:
      "Creating interactive cards with individual design customization",
    hasIndicator: true,
    defaultIndicatorStatus: "gray",
    etapNumber: 7,
    stepType: "required",
    dependencies: ["step6"],
    titleForRequired: "Step 3",
  },
  {
    key: "step8",
    label: "Step 8",
    title: "Automatic Generation",
    description: "Sequential generation of all sections with cumulative logic",
    hasIndicator: true,
    defaultIndicatorStatus: "gray",
    etapNumber: 8,
    stepType: "required",
    dependencies: ["step7"],
    titleForRequired: "Step 4",
  },
  {
    key: "step9",
    label: "Step 9",
    title: "Control & Proofreading",
    description:
      "Comprehensive document analysis for SEO compliance and quality",
    hasIndicator: true,
    defaultIndicatorStatus: "gray",
    etapNumber: 9,
    stepType: "optional",
    dependencies: ["step8"],
  },
  {
    key: "step10",
    label: "Step 10",
    title: "Final Optimization",
    description:
      "Iterative content optimization focused on quality improvement",
    hasIndicator: true,
    defaultIndicatorStatus: "gray",
    etapNumber: 10,
    stepType: "optional",
    dependencies: ["step9"],
  },
  {
    key: "step11",
    label: "Step 11",
    title: "Results & Analytics",
    description: "Providing final analytics with detailed project statistics",
    hasIndicator: true,
    defaultIndicatorStatus: "gray",
    etapNumber: 11,
    stepType: "optional",
    dependencies: ["step10"],
  },
  {
    key: "preview",
    label: "Preview",
    title: "Preview Results",
    description: "View final results before deploying to Vercel hosting",
    hasIndicator: true,
    defaultIndicatorStatus: "gray",
    stepType: "required",
    dependencies: ["step8"],
  },
  {
    key: "deploy",
    label: "Deploy",
    title: "Deploy Project",
    description:
      "Automatic deployment to Vercel using specialized integration technology",
    hasIndicator: true,
    defaultIndicatorStatus: "gray",
    stepType: "required",
    dependencies: [],
    titleForRequired: "Deploy", // Остается Deploy в обоих режимах
  },
];

export const ADMIN_PAGES_CONFIG = {
  defaultTab: "info" as AdminPageTab,
  fallbackTitle: "ContentCombine Pro - Long-form Content Generator",
  projectName: "ContentCombine Pro",
  version: "1.0.0",
  requiredSteps: ADMIN_PAGES_TABS.filter(
    (step) => step.stepType === "required"
  ),
  optionalSteps: ADMIN_PAGES_TABS.filter(
    (step) => step.stepType === "optional"
  ),
} as const;

export const canActivateStep = (
  stepKey: AdminPageTab,
  completedSteps: AdminPageTab[]
): boolean => {
  const step = ADMIN_PAGES_TABS.find((s) => s.key === stepKey);
  if (!step || !step.dependencies) return true;

  return step.dependencies.every((dep) => completedSteps.includes(dep));
};

export const getAvailableNextSteps = (
  completedSteps: AdminPageTab[]
): AdminPageTab[] => {
  return ADMIN_PAGES_TABS.filter(
    (step) =>
      !completedSteps.includes(step.key) &&
      canActivateStep(step.key, completedSteps)
  ).map((step) => step.key);
};
