import { RootContentStructure } from "@/app/@right/(_service)/(_types)/page-types";

/**
 * Enhanced realistic content structure template with all empty fields for system instruction completion
 * Template provides only structure while allowing system instruction to fill all content-specific fields
 * Total word count: ~1,500-5,000 words distributed across sections
 */
export const DEFAULT_CONTENT_STRUCTURE: RootContentStructure[] = [
  // Introduction section
  {
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
        tag: "p",
        additionalData: {
          minWords: 120,
          maxWords: 250,
          actualContent: "",
        },
      },
      {
        tag: "p",
        additionalData: {
          minWords: 80,
          maxWords: 180,
          actualContent: "",
        },
      },
      {
        tag: "img",
        additionalData: {
          minWords: 5,
          maxWords: 15,
          actualContent: "",
        },
      },
      {
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
        tag: "p",
        additionalData: {
          minWords: 100,
          maxWords: 200,
          actualContent: "",
        },
      },
      {
        tag: "h3",
        additionalData: {
          minWords: 200,
          maxWords: 300,
          actualContent: "",
        },
        realContentStructure: [
          {
            tag: "p",
            additionalData: {
              minWords: 70,
              maxWords: 140,
              actualContent: "",
            },
          },
          {
            tag: "p",
            additionalData: {
              minWords: 90,
              maxWords: 180,
              actualContent: "",
            },
          },
          {
            tag: "img",
            additionalData: {
              minWords: 5,
              maxWords: 15,
              actualContent: "",
            },
          },
          {
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
        tag: "h3",
        additionalData: {
          minWords: 100,
          maxWords: 200,
          actualContent: "",
        },
        realContentStructure: [
          {
            tag: "p",
            additionalData: {
              minWords: 80,
              maxWords: 160,
              actualContent: "",
            },
          },
          {
            tag: "ul",
            additionalData: {
              minWords: 40,
              maxWords: 80,
              actualContent: "",
            },
          },
          {
            tag: "code",
            additionalData: {
              minWords: 20,
              maxWords: 50,
              actualContent: "",
            },
          },
          {
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
        tag: "img",
        additionalData: {
          minWords: 5,
          maxWords: 15,
          actualContent: "",
        },
      },
      {
        tag: "p",
        additionalData: {
          minWords: 110,
          maxWords: 220,
          actualContent: "",
        },
      },
      {
        tag: "h3",
        additionalData: {
          minWords: 200,
          maxWords: 350,
          actualContent: "",
        },
        realContentStructure: [
          {
            tag: "p",
            additionalData: {
              minWords: 85,
              maxWords: 170,
              actualContent: "",
            },
          },
          {
            tag: "ol",
            additionalData: {
              minWords: 50,
              maxWords: 100,
              actualContent: "",
            },
          },
          {
            tag: "h4",
            additionalData: {
              minWords: 120,
              maxWords: 200,
              actualContent: "",
            },
            realContentStructure: [
              {
                tag: "p",
                additionalData: {
                  minWords: 75,
                  maxWords: 150,
                  actualContent: "",
                },
              },
              {
                tag: "code",
                additionalData: {
                  minWords: 25,
                  maxWords: 60,
                  actualContent: "",
                },
              },
              {
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
        tag: "h3",
        additionalData: {
          minWords: 150,
          maxWords: 250,
          actualContent: "",
        },
        realContentStructure: [
          {
            tag: "p",
            additionalData: {
              minWords: 95,
              maxWords: 190,
              actualContent: "",
            },
          },
          {
            tag: "blockquote",
            additionalData: {
              minWords: 20,
              maxWords: 45,
              actualContent: "",
            },
          },
          {
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
        tag: "p",
        additionalData: {
          minWords: 100,
          maxWords: 200,
          actualContent: "",
        },
      },
      {
        tag: "h3",
        additionalData: {
          minWords: 200,
          maxWords: 300,
          actualContent: "",
        },
        realContentStructure: [
          {
            tag: "img",
            additionalData: {
              minWords: 5,
              maxWords: 15,
              actualContent: "",
            },
          },
          {
            tag: "p",
            additionalData: {
              minWords: 90,
              maxWords: 180,
              actualContent: "",
            },
          },
          {
            tag: "p",
            additionalData: {
              minWords: 85,
              maxWords: 170,
              actualContent: "",
            },
          },
          {
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
        tag: "h3",
        additionalData: {
          minWords: 250,
          maxWords: 350,
          actualContent: "",
        },
        realContentStructure: [
          {
            tag: "p",
            additionalData: {
              minWords: 110,
              maxWords: 220,
              actualContent: "",
            },
          },
          {
            tag: "p",
            additionalData: {
              minWords: 80,
              maxWords: 160,
              actualContent: "",
            },
          },
          {
            tag: "ol",
            additionalData: {
              minWords: 55,
              maxWords: 110,
              actualContent: "",
            },
          },
          {
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
        tag: "p",
        additionalData: {
          minWords: 105,
          maxWords: 210,
          actualContent: "",
        },
      },
      {
        tag: "img",
        additionalData: {
          minWords: 5,
          maxWords: 15,
          actualContent: "",
        },
      },
      {
        tag: "h3",
        additionalData: {
          minWords: 150,
          maxWords: 250,
          actualContent: "",
        },
        realContentStructure: [
          {
            tag: "p",
            additionalData: {
              minWords: 80,
              maxWords: 160,
              actualContent: "",
            },
          },
          {
            tag: "ul",
            additionalData: {
              minWords: 40,
              maxWords: 80,
              actualContent: "",
            },
          },
          {
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
        tag: "p",
        additionalData: {
          minWords: 95,
          maxWords: 190,
          actualContent: "",
        },
      },
      {
        tag: "h3",
        additionalData: {
          minWords: 200,
          maxWords: 300,
          actualContent: "",
        },
        realContentStructure: [
          {
            tag: "p",
            additionalData: {
              minWords: 75,
              maxWords: 150,
              actualContent: "",
            },
          },
          {
            tag: "table",
            additionalData: {
              minWords: 100,
              maxWords: 200,
              actualContent: "",
            },
          },
          {
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
        tag: "h3",
        additionalData: {
          minWords: 100,
          maxWords: 150,
          actualContent: "",
        },
        realContentStructure: [
          {
            tag: "p",
            additionalData: {
              minWords: 90,
              maxWords: 180,
              actualContent: "",
            },
          },
          {
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
        tag: "p",
        additionalData: {
          minWords: 120,
          maxWords: 240,
          actualContent: "",
        },
      },
      {
        tag: "p",
        additionalData: {
          minWords: 100,
          maxWords: 200,
          actualContent: "",
        },
      },
      {
        tag: "ul",
        additionalData: {
          minWords: 60,
          maxWords: 120,
          actualContent: "",
        },
      },
      {
        tag: "p",
        additionalData: {
          minWords: 80,
          maxWords: 160,
          actualContent: "",
        },
      },
      {
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
