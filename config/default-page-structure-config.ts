import { RootContentStructure } from "@/app/@right/(_service)/(_types)/page-types";

/**
 * Enhanced realistic content structure template with all empty fields for system instruction completion
 * Template provides only structure while allowing system instruction to fill all content-specific fields
 * Total word count: ~1,500-5,000 words distributed across sections
 * Each element has a unique ID based on tag and hierarchical position
 */
export const DEFAULT_CONTENT_STRUCTURE: RootContentStructure[] = [
  // Introduction section
  {
    id: "h2-1",
    tag: "h2",
    classification: "semantic",
    keywords: [],
    taxonomy: "",
    attention: "",
    intent: "",
    audiences: "",
    selfPrompt: "",
    designDescription: "",
    connectedDesignSectionId: "",
    additionalData: {
      minWords: 200,
      maxWords: 350,
      actualContent: "",
    },
    realContentStructure: [
      {
        id: "p-1-1",
        tag: "p",
        additionalData: {
          minWords: 120,
          maxWords: 250,
          actualContent: "",
        },
      },
      {
        id: "p-1-2",
        tag: "p",
        additionalData: {
          minWords: 80,
          maxWords: 180,
          actualContent: "",
        },
      },
      {
        id: "img-1-3",
        tag: "img",
        additionalData: {
          minWords: 5,
          maxWords: 15,
          actualContent: "",
        },
      },
      {
        id: "blockquote-1-4",
        tag: "blockquote",
        additionalData: {
          minWords: 25,
          maxWords: 50,
          actualContent: "",
        },
      },
    ],
  },

  // Technical Foundation section
  {
    id: "h2-2",
    tag: "h2",
    classification: "semantic",
    keywords: [],
    taxonomy: "",
    attention: "",
    intent: "",
    audiences: "",
    selfPrompt: "",
    designDescription: "",
    connectedDesignSectionId: "",
    additionalData: {
      minWords: 400,
      maxWords: 600,
      actualContent: "",
    },
    realContentStructure: [
      {
        id: "p-2-1",
        tag: "p",
        additionalData: {
          minWords: 100,
          maxWords: 200,
          actualContent: "",
        },
      },
      {
        id: "h3-2-2",
        tag: "h3",
        additionalData: {
          minWords: 200,
          maxWords: 300,
          actualContent: "",
        },
        realContentStructure: [
          {
            id: "p-2-2-1",
            tag: "p",
            additionalData: {
              minWords: 70,
              maxWords: 140,
              actualContent: "",
            },
          },
          {
            id: "p-2-2-2",
            tag: "p",
            additionalData: {
              minWords: 90,
              maxWords: 180,
              actualContent: "",
            },
          },
          {
            id: "img-2-2-3",
            tag: "img",
            additionalData: {
              minWords: 5,
              maxWords: 15,
              actualContent: "",
            },
          },
          {
            id: "table-2-2-4",
            tag: "table",
            additionalData: {
              minWords: 80,
              maxWords: 160,
              actualContent: "",
            },
          },
        ],
      },
      {
        id: "h3-2-3",
        tag: "h3",
        additionalData: {
          minWords: 100,
          maxWords: 200,
          actualContent: "",
        },
        realContentStructure: [
          {
            id: "p-2-3-1",
            tag: "p",
            additionalData: {
              minWords: 80,
              maxWords: 160,
              actualContent: "",
            },
          },
          {
            id: "ul-2-3-2",
            tag: "ul",
            additionalData: {
              minWords: 40,
              maxWords: 80,
              actualContent: "",
            },
          },
          {
            id: "code-2-3-3",
            tag: "code",
            additionalData: {
              minWords: 20,
              maxWords: 50,
              actualContent: "",
            },
          },
          {
            id: "p-2-3-4",
            tag: "p",
            additionalData: {
              minWords: 60,
              maxWords: 120,
              actualContent: "",
            },
          },
        ],
      },
    ],
  },

  // Implementation Process section
  {
    id: "h2-3",
    tag: "h2",
    classification: "semantic",
    keywords: [],
    taxonomy: "",
    attention: "",
    intent: "",
    audiences: "",
    selfPrompt: "",
    designDescription: "",
    connectedDesignSectionId: "",
    additionalData: {
      minWords: 500,
      maxWords: 750,
      actualContent: "",
    },
    realContentStructure: [
      {
        id: "img-3-1",
        tag: "img",
        additionalData: {
          minWords: 5,
          maxWords: 15,
          actualContent: "",
        },
      },
      {
        id: "p-3-2",
        tag: "p",
        additionalData: {
          minWords: 110,
          maxWords: 220,
          actualContent: "",
        },
      },
      {
        id: "h3-3-3",
        tag: "h3",
        additionalData: {
          minWords: 200,
          maxWords: 350,
          actualContent: "",
        },
        realContentStructure: [
          {
            id: "p-3-3-1",
            tag: "p",
            additionalData: {
              minWords: 85,
              maxWords: 170,
              actualContent: "",
            },
          },
          {
            id: "ol-3-3-2",
            tag: "ol",
            additionalData: {
              minWords: 50,
              maxWords: 100,
              actualContent: "",
            },
          },
          {
            id: "h4-3-3-3",
            tag: "h4",
            additionalData: {
              minWords: 120,
              maxWords: 200,
              actualContent: "",
            },
            realContentStructure: [
              {
                id: "p-3-3-3-1",
                tag: "p",
                additionalData: {
                  minWords: 75,
                  maxWords: 150,
                  actualContent: "",
                },
              },
              {
                id: "code-3-3-3-2",
                tag: "code",
                additionalData: {
                  minWords: 25,
                  maxWords: 60,
                  actualContent: "",
                },
              },
              {
                id: "p-3-3-3-3",
                tag: "p",
                additionalData: {
                  minWords: 65,
                  maxWords: 130,
                  actualContent: "",
                },
              },
            ],
          },
        ],
      },
      {
        id: "h3-3-4",
        tag: "h3",
        additionalData: {
          minWords: 150,
          maxWords: 250,
          actualContent: "",
        },
        realContentStructure: [
          {
            id: "p-3-4-1",
            tag: "p",
            additionalData: {
              minWords: 95,
              maxWords: 190,
              actualContent: "",
            },
          },
          {
            id: "blockquote-3-4-2",
            tag: "blockquote",
            additionalData: {
              minWords: 20,
              maxWords: 45,
              actualContent: "",
            },
          },
          {
            id: "ol-3-4-3",
            tag: "ol",
            additionalData: {
              minWords: 60,
              maxWords: 120,
              actualContent: "",
            },
          },
        ],
      },
    ],
  },

  // Advanced Topics section
  {
    id: "h2-4",
    tag: "h2",
    classification: "semantic",
    keywords: [],
    taxonomy: "",
    attention: "",
    intent: "",
    audiences: "",
    selfPrompt: "",
    designDescription: "",
    connectedDesignSectionId: "",
    additionalData: {
      minWords: 450,
      maxWords: 650,
      actualContent: "",
    },
    realContentStructure: [
      {
        id: "p-4-1",
        tag: "p",
        additionalData: {
          minWords: 100,
          maxWords: 200,
          actualContent: "",
        },
      },
      {
        id: "h3-4-2",
        tag: "h3",
        additionalData: {
          minWords: 200,
          maxWords: 300,
          actualContent: "",
        },
        realContentStructure: [
          {
            id: "img-4-2-1",
            tag: "img",
            additionalData: {
              minWords: 5,
              maxWords: 15,
              actualContent: "",
            },
          },
          {
            id: "p-4-2-2",
            tag: "p",
            additionalData: {
              minWords: 90,
              maxWords: 180,
              actualContent: "",
            },
          },
          {
            id: "p-4-2-3",
            tag: "p",
            additionalData: {
              minWords: 85,
              maxWords: 170,
              actualContent: "",
            },
          },
          {
            id: "ul-4-2-4",
            tag: "ul",
            additionalData: {
              minWords: 45,
              maxWords: 90,
              actualContent: "",
            },
          },
        ],
      },
      {
        id: "h3-4-3",
        tag: "h3",
        additionalData: {
          minWords: 250,
          maxWords: 350,
          actualContent: "",
        },
        realContentStructure: [
          {
            id: "p-4-3-1",
            tag: "p",
            additionalData: {
              minWords: 110,
              maxWords: 220,
              actualContent: "",
            },
          },
          {
            id: "p-4-3-2",
            tag: "p",
            additionalData: {
              minWords: 80,
              maxWords: 160,
              actualContent: "",
            },
          },
          {
            id: "ol-4-3-3",
            tag: "ol",
            additionalData: {
              minWords: 55,
              maxWords: 110,
              actualContent: "",
            },
          },
          {
            id: "blockquote-4-3-4",
            tag: "blockquote",
            additionalData: {
              minWords: 18,
              maxWords: 40,
              actualContent: "",
            },
          },
        ],
      },
    ],
  },

  // Monitoring and Maintenance section
  {
    id: "h2-5",
    tag: "h2",
    classification: "semantic",
    keywords: [],
    taxonomy: "",
    attention: "",
    intent: "",
    audiences: "",
    selfPrompt: "",
    designDescription: "",
    connectedDesignSectionId: "",
    additionalData: {
      minWords: 400,
      maxWords: 550,
      actualContent: "",
    },
    realContentStructure: [
      {
        id: "p-5-1",
        tag: "p",
        additionalData: {
          minWords: 105,
          maxWords: 210,
          actualContent: "",
        },
      },
      {
        id: "img-5-2",
        tag: "img",
        additionalData: {
          minWords: 5,
          maxWords: 15,
          actualContent: "",
        },
      },
      {
        id: "h3-5-3",
        tag: "h3",
        additionalData: {
          minWords: 150,
          maxWords: 250,
          actualContent: "",
        },
        realContentStructure: [
          {
            id: "p-5-3-1",
            tag: "p",
            additionalData: {
              minWords: 80,
              maxWords: 160,
              actualContent: "",
            },
          },
          {
            id: "ul-5-3-2",
            tag: "ul",
            additionalData: {
              minWords: 40,
              maxWords: 80,
              actualContent: "",
            },
          },
          {
            id: "p-5-3-3",
            tag: "p",
            additionalData: {
              minWords: 70,
              maxWords: 140,
              actualContent: "",
            },
          },
        ],
      },
    ],
  },

  // Troubleshooting section
  {
    id: "h2-6",
    tag: "h2",
    classification: "semantic",
    keywords: [],
    taxonomy: "",
    attention: "",
    intent: "",
    audiences: "",
    selfPrompt: "",
    designDescription: "",
    connectedDesignSectionId: "",
    additionalData: {
      minWords: 350,
      maxWords: 500,
      actualContent: "",
    },
    realContentStructure: [
      {
        id: "p-6-1",
        tag: "p",
        additionalData: {
          minWords: 95,
          maxWords: 190,
          actualContent: "",
        },
      },
      {
        id: "h3-6-2",
        tag: "h3",
        additionalData: {
          minWords: 200,
          maxWords: 300,
          actualContent: "",
        },
        realContentStructure: [
          {
            id: "p-6-2-1",
            tag: "p",
            additionalData: {
              minWords: 75,
              maxWords: 150,
              actualContent: "",
            },
          },
          {
            id: "table-6-2-2",
            tag: "table",
            additionalData: {
              minWords: 100,
              maxWords: 200,
              actualContent: "",
            },
          },
          {
            id: "p-6-2-3",
            tag: "p",
            additionalData: {
              minWords: 85,
              maxWords: 170,
              actualContent: "",
            },
          },
        ],
      },
      {
        id: "h3-6-3",
        tag: "h3",
        additionalData: {
          minWords: 100,
          maxWords: 150,
          actualContent: "",
        },
        realContentStructure: [
          {
            id: "p-6-3-1",
            tag: "p",
            additionalData: {
              minWords: 90,
              maxWords: 180,
              actualContent: "",
            },
          },
          {
            id: "code-6-3-2",
            tag: "code",
            additionalData: {
              minWords: 30,
              maxWords: 70,
              actualContent: "",
            },
          },
        ],
      },
    ],
  },

  // Conclusion section
  {
    id: "h2-7",
    tag: "h2",
    classification: "semantic",
    keywords: [],
    taxonomy: "",
    attention: "",
    intent: "",
    audiences: "",
    selfPrompt: "",
    designDescription: "",
    connectedDesignSectionId: "",
    additionalData: {
      minWords: 300,
      maxWords: 450,
      actualContent: "",
    },
    realContentStructure: [
      {
        id: "p-7-1",
        tag: "p",
        additionalData: {
          minWords: 120,
          maxWords: 240,
          actualContent: "",
        },
      },
      {
        id: "p-7-2",
        tag: "p",
        additionalData: {
          minWords: 100,
          maxWords: 200,
          actualContent: "",
        },
      },
      {
        id: "ul-7-3",
        tag: "ul",
        additionalData: {
          minWords: 60,
          maxWords: 120,
          actualContent: "",
        },
      },
      {
        id: "p-7-4",
        tag: "p",
        additionalData: {
          minWords: 80,
          maxWords: 160,
          actualContent: "",
        },
      },
      {
        id: "blockquote-7-5",
        tag: "blockquote",
        additionalData: {
          minWords: 15,
          maxWords: 35,
          actualContent: "",
        },
      },
    ],
  },
];
