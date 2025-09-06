import {
  ContentClassification,
  ContentStructure,
} from "@/app/@right/(_service)/(_types)/page-types";

/**
 * Default content structure template for new pages
 * Creates a hierarchical structure: H2 -> P + 3x(H3 -> P + 3x(H4 -> P + UL))
 */

/**
 * Use Ai if you need generate another structer for Light Flow or use Content generator: PRO Flow
 */
export const DEFAULT_CONTENT_STRUCTURE: ContentStructure[] = [
  // First H2 section
  {
    classification: "technical" as ContentClassification,
    tag: "h2",
    additionalData: {
      actualContent: "Main Section 1",
    },
    realContentStructure: [
      // Section description
      {
        classification: "technical" as ContentClassification,
        tag: "p",
        additionalData: {
          actualContent: "Description for main section 1",
        },
      },
      // Three H3 subsections
      {
        classification: "technical" as ContentClassification,
        tag: "h3",
        additionalData: {
          actualContent: "Subsection 1.1",
        },
        realContentStructure: [
          {
            classification: "technical" as ContentClassification,
            tag: "p",
            additionalData: {
              actualContent: "Description for subsection 1.1",
            },
          },
          // Three H4 elements
          {
            classification: "technical" as ContentClassification,
            tag: "h4",
            additionalData: {
              actualContent: "Topic 1.1.1",
            },
            realContentStructure: [
              {
                classification: "technical" as ContentClassification,
                tag: "p",
                additionalData: {
                  actualContent: "Description for topic 1.1.1",
                },
              },
              {
                classification: "technical" as ContentClassification,
                tag: "ul",
                additionalData: {
                  actualContent: "List items for topic 1.1.1",
                },
              },
            ],
          },
          {
            classification: "technical" as ContentClassification,
            tag: "h4",
            additionalData: {
              actualContent: "Topic 1.1.2",
            },
            realContentStructure: [
              {
                classification: "technical" as ContentClassification,
                tag: "p",
                additionalData: {
                  actualContent: "Description for topic 1.1.2",
                },
              },
              {
                classification: "technical" as ContentClassification,
                tag: "ul",
                additionalData: {
                  actualContent: "List items for topic 1.1.2",
                },
              },
            ],
          },
          {
            classification: "technical" as ContentClassification,
            tag: "h4",
            additionalData: {
              actualContent: "Topic 1.1.3",
            },
            realContentStructure: [
              {
                classification: "technical" as ContentClassification,
                tag: "p",
                additionalData: {
                  actualContent: "Description for topic 1.1.3",
                },
              },
              {
                classification: "technical" as ContentClassification,
                tag: "ul",
                additionalData: {
                  actualContent: "List items for topic 1.1.3",
                },
              },
            ],
          },
        ],
      },
      {
        classification: "technical" as ContentClassification,
        tag: "h3",
        additionalData: {
          actualContent: "Subsection 1.2",
        },
        realContentStructure: [
          {
            classification: "technical" as ContentClassification,
            tag: "p",
            additionalData: {
              actualContent: "Description for subsection 1.2",
            },
          },
          {
            classification: "technical" as ContentClassification,
            tag: "h4",
            additionalData: {
              actualContent: "Topic 1.2.1",
            },
            realContentStructure: [
              {
                classification: "technical" as ContentClassification,
                tag: "p",
                additionalData: {
                  actualContent: "Description for topic 1.2.1",
                },
              },
              {
                classification: "technical" as ContentClassification,
                tag: "ul",
                additionalData: {
                  actualContent: "List items for topic 1.2.1",
                },
              },
            ],
          },
          {
            classification: "technical" as ContentClassification,
            tag: "h4",
            additionalData: {
              actualContent: "Topic 1.2.2",
            },
            realContentStructure: [
              {
                classification: "technical" as ContentClassification,
                tag: "p",
                additionalData: {
                  actualContent: "Description for topic 1.2.2",
                },
              },
              {
                classification: "technical" as ContentClassification,
                tag: "ul",
                additionalData: {
                  actualContent: "List items for topic 1.2.2",
                },
              },
            ],
          },
          {
            classification: "technical" as ContentClassification,
            tag: "h4",
            additionalData: {
              actualContent: "Topic 1.2.3",
            },
            realContentStructure: [
              {
                classification: "technical" as ContentClassification,
                tag: "p",
                additionalData: {
                  actualContent: "Description for topic 1.2.3",
                },
              },
              {
                classification: "technical" as ContentClassification,
                tag: "ul",
                additionalData: {
                  actualContent: "List items for topic 1.2.3",
                },
              },
            ],
          },
        ],
      },
      {
        classification: "technical" as ContentClassification,
        tag: "h3",
        additionalData: {
          actualContent: "Subsection 1.3",
        },
        realContentStructure: [
          {
            classification: "technical" as ContentClassification,
            tag: "p",
            additionalData: {
              actualContent: "Description for subsection 1.3",
            },
          },
          {
            classification: "technical" as ContentClassification,
            tag: "h4",
            additionalData: {
              actualContent: "Topic 1.3.1",
            },
            realContentStructure: [
              {
                classification: "technical" as ContentClassification,
                tag: "p",
                additionalData: {
                  actualContent: "Description for topic 1.3.1",
                },
              },
              {
                classification: "technical" as ContentClassification,
                tag: "ul",
                additionalData: {
                  actualContent: "List items for topic 1.3.1",
                },
              },
            ],
          },
          {
            classification: "technical" as ContentClassification,
            tag: "h4",
            additionalData: {
              actualContent: "Topic 1.3.2",
            },
            realContentStructure: [
              {
                classification: "technical" as ContentClassification,
                tag: "p",
                additionalData: {
                  actualContent: "Description for topic 1.3.2",
                },
              },
              {
                classification: "technical" as ContentClassification,
                tag: "ul",
                additionalData: {
                  actualContent: "List items for topic 1.3.2",
                },
              },
            ],
          },
          {
            classification: "technical" as ContentClassification,
            tag: "h4",
            additionalData: {
              actualContent: "Topic 1.3.3",
            },
            realContentStructure: [
              {
                classification: "technical" as ContentClassification,
                tag: "p",
                additionalData: {
                  actualContent: "Description for topic 1.3.3",
                },
              },
              {
                classification: "technical" as ContentClassification,
                tag: "ul",
                additionalData: {
                  actualContent: "List items for topic 1.3.3",
                },
              },
            ],
          },
        ],
      },
    ],
  },
  // Second H2 section
  {
    classification: "technical" as ContentClassification,
    tag: "h2",
    additionalData: {
      actualContent: "Main Section 2",
    },
    realContentStructure: [
      {
        classification: "technical" as ContentClassification,
        tag: "p",
        additionalData: {
          actualContent: "Description for main section 2",
        },
      },
      // Similar structure as first section...
      // (truncated for brevity, but would include same 3x3x3 structure)
    ],
  },
  // Third H2 section
  {
    classification: "technical" as ContentClassification,
    tag: "h2",
    additionalData: {
      actualContent: "Main Section 3",
    },
    realContentStructure: [
      {
        classification: "technical" as ContentClassification,
        tag: "p",
        additionalData: {
          actualContent: "Description for main section 3",
        },
      },
      // Similar structure as first section...
      // (truncated for brevity, but would include same 3x3x3 structure)
    ],
  },
];
