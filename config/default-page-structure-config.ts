import { RootContentStructure } from "@/app/@right/(_service)/(_types)/page-types";

/**
 * Enhanced realistic content structure template
 * More human-like patterns with variable element placement
 * Total word count increased by 30%: ~1,500-5,000 words
 */
export const DEFAULT_CONTENT_STRUCTURE: RootContentStructure[] = [
  // Introduction section (added for realism)
  {
    tag: "h2",
    additionalData: {
      minWords: 3,
      maxWords: 8,
      actualContent: "Introduction and Overview",
    },
    realContentStructure: [
      // Opening paragraph without immediate image (more natural)
      {
        tag: "p",
        additionalData: {
          minWords: 120,
          maxWords: 250,
          actualContent:
            "This comprehensive guide provides detailed information about system implementation, covering essential concepts, practical examples, and best practices for optimal performance across various deployment scenarios.",
        },
      },
      // Second paragraph for context (human writers often use multiple paragraphs)
      {
        tag: "p",
        additionalData: {
          minWords: 80,
          maxWords: 180,
          actualContent:
            "Whether you're a beginner looking to understand the fundamentals or an experienced developer seeking advanced techniques, this documentation will guide you through every step of the process.",
        },
      },
      // Image after context is established
      {
        tag: "img",
        additionalData: {
          minWords: 5,
          maxWords: 15,
          actualContent:
            "System architecture overview diagram showing main components",
        },
      },
      // Key benefits as blockquote
      {
        tag: "blockquote",
        additionalData: {
          minWords: 25,
          maxWords: 50,
          actualContent:
            "Success in implementation requires careful planning, systematic approach, and continuous monitoring to achieve sustainable results that meet business objectives.",
        },
      },
    ],
  },

  // First main section - Technical Foundation
  {
    tag: "h2",
    additionalData: {
      minWords: 3,
      maxWords: 8,
      actualContent: "System Requirements and Setup",
    },
    realContentStructure: [
      {
        tag: "p",
        additionalData: {
          minWords: 100,
          maxWords: 200,
          actualContent:
            "Understanding system requirements is crucial for successful deployment and optimal performance. This section covers hardware specifications, software dependencies, and environmental considerations.",
        },
      },
      // Requirements subsection
      {
        tag: "h3",
        additionalData: {
          minWords: 2,
          maxWords: 6,
          actualContent: "Hardware Requirements",
        },
        realContentStructure: [
          {
            tag: "p",
            additionalData: {
              minWords: 70,
              maxWords: 140,
              actualContent:
                "Proper hardware configuration ensures smooth operation and prevents performance bottlenecks during peak usage periods.",
            },
          },
          // Multiple paragraphs for detailed explanation (realistic pattern)
          {
            tag: "p",
            additionalData: {
              minWords: 90,
              maxWords: 180,
              actualContent:
                "CPU requirements vary depending on your expected workload and concurrent user count. Memory allocation should account for both application needs and operating system overhead.",
            },
          },
          {
            tag: "img",
            additionalData: {
              minWords: 5,
              maxWords: 15,
              actualContent:
                "Hardware requirements comparison chart for different deployment sizes",
            },
          },
          // Requirements table
          {
            tag: "table",
            additionalData: {
              minWords: 80,
              maxWords: 160,
              actualContent:
                "Detailed hardware specifications table with minimum and recommended configurations for different deployment scenarios including CPU, RAM, storage, and network requirements",
            },
          },
        ],
      },
      // Software dependencies without immediate image (variation)
      {
        tag: "h3",
        additionalData: {
          minWords: 2,
          maxWords: 6,
          actualContent: "Software Dependencies",
        },
        realContentStructure: [
          {
            tag: "p",
            additionalData: {
              minWords: 80,
              maxWords: 160,
              actualContent:
                "Required software components must be installed and properly configured before system deployment can begin successfully.",
            },
          },
          {
            tag: "ul",
            additionalData: {
              minWords: 40,
              maxWords: 80,
              actualContent:
                "Essential software packages including runtime environments, database systems, web servers, and security tools with specific version requirements",
            },
          },
          // Code example without separate subsection
          {
            tag: "code",
            additionalData: {
              minWords: 20,
              maxWords: 50,
              actualContent:
                "Installation script example with package manager commands and configuration options for automated deployment",
            },
          },
          {
            tag: "p",
            additionalData: {
              minWords: 60,
              maxWords: 120,
              actualContent:
                "Version compatibility is critical for system stability. Always verify that all components work together seamlessly.",
            },
          },
        ],
      },
    ],
  },

  // Second main section - Implementation Process
  {
    tag: "h2",
    additionalData: {
      minWords: 3,
      maxWords: 8,
      actualContent: "Step-by-Step Implementation",
    },
    realContentStructure: [
      {
        tag: "img",
        additionalData: {
          minWords: 5,
          maxWords: 15,
          actualContent:
            "Implementation workflow diagram showing the complete process from setup to deployment",
        },
      },
      {
        tag: "p",
        additionalData: {
          minWords: 110,
          maxWords: 220,
          actualContent:
            "This implementation guide provides step-by-step instructions, practical examples, and troubleshooting tips to ensure successful deployment and configuration of the system in various environments.",
        },
      },
      // Initial setup
      {
        tag: "h3",
        additionalData: {
          minWords: 2,
          maxWords: 5,
          actualContent: "Initial Configuration",
        },
        realContentStructure: [
          {
            tag: "p",
            additionalData: {
              minWords: 85,
              maxWords: 170,
              actualContent:
                "Beginning your implementation journey requires proper preparation and understanding of core configuration concepts and best practices.",
            },
          },
          {
            tag: "ol",
            additionalData: {
              minWords: 50,
              maxWords: 100,
              actualContent:
                "Step-by-step configuration process including environment setup, parameter configuration, security settings, and initial testing procedures",
            },
          },
          // Advanced configuration as nested section
          {
            tag: "h4",
            additionalData: {
              minWords: 2,
              maxWords: 5,
              actualContent: "Advanced Settings",
            },
            realContentStructure: [
              {
                tag: "p",
                additionalData: {
                  minWords: 75,
                  maxWords: 150,
                  actualContent:
                    "Advanced configuration options provide additional flexibility and customization possibilities for experienced users and complex scenarios.",
                },
              },
              {
                tag: "code",
                additionalData: {
                  minWords: 25,
                  maxWords: 60,
                  actualContent:
                    "Advanced configuration file example with custom parameters, optimization settings, and environment-specific variables",
                },
              },
              // Additional explanation paragraph
              {
                tag: "p",
                additionalData: {
                  minWords: 65,
                  maxWords: 130,
                  actualContent:
                    "These settings should only be modified by experienced administrators who understand their impact on system performance.",
                },
              },
            ],
          },
        ],
      },
      // Deployment process
      {
        tag: "h3",
        additionalData: {
          minWords: 1,
          maxWords: 4,
          actualContent: "Deployment",
        },
        realContentStructure: [
          {
            tag: "p",
            additionalData: {
              minWords: 95,
              maxWords: 190,
              actualContent:
                "Deployment process involves several critical steps that must be executed in the correct order to ensure system stability and security.",
            },
          },
          // No image here - variation in pattern
          {
            tag: "blockquote",
            additionalData: {
              minWords: 20,
              maxWords: 45,
              actualContent:
                "A successful deployment is not just about getting the system running, but ensuring it runs reliably under all expected conditions.",
            },
          },
          {
            tag: "ol",
            additionalData: {
              minWords: 60,
              maxWords: 120,
              actualContent:
                "Comprehensive deployment checklist including pre-deployment validation, system backup, deployment execution, post-deployment testing, and rollback procedures",
            },
          },
        ],
      },
    ],
  },

  // Third main section - Advanced Topics
  {
    tag: "h2",
    additionalData: {
      minWords: 2,
      maxWords: 6,
      actualContent: "Advanced Configuration",
    },
    realContentStructure: [
      {
        tag: "p",
        additionalData: {
          minWords: 100,
          maxWords: 200,
          actualContent:
            "Advanced configuration techniques enable you to optimize system performance, implement custom workflows, and integrate with existing infrastructure components.",
        },
      },
      // Performance optimization
      {
        tag: "h3",
        additionalData: {
          minWords: 2,
          maxWords: 5,
          actualContent: "Performance Optimization",
        },
        realContentStructure: [
          {
            tag: "img",
            additionalData: {
              minWords: 5,
              maxWords: 15,
              actualContent:
                "Performance metrics dashboard showing key optimization indicators",
            },
          },
          {
            tag: "p",
            additionalData: {
              minWords: 90,
              maxWords: 180,
              actualContent:
                "System performance can be significantly improved through proper configuration of caching mechanisms, database optimization, and resource allocation strategies.",
            },
          },
          // Multiple techniques paragraphs
          {
            tag: "p",
            additionalData: {
              minWords: 85,
              maxWords: 170,
              actualContent:
                "Caching strategies play a crucial role in reducing response times and server load. Implementation should consider cache invalidation patterns and memory usage.",
            },
          },
          {
            tag: "ul",
            additionalData: {
              minWords: 45,
              maxWords: 90,
              actualContent:
                "Key performance optimization techniques including memory management, connection pooling, query optimization, and load balancing strategies",
            },
          },
        ],
      },
      // Security considerations
      {
        tag: "h3",
        additionalData: {
          minWords: 2,
          maxWords: 5,
          actualContent: "Security Best Practices",
        },
        realContentStructure: [
          {
            tag: "p",
            additionalData: {
              minWords: 110,
              maxWords: 220,
              actualContent:
                "Security implementation requires a comprehensive approach including authentication mechanisms, authorization frameworks, data encryption, network security, and regular security auditing procedures.",
            },
          },
          {
            tag: "p",
            additionalData: {
              minWords: 80,
              maxWords: 160,
              actualContent:
                "Multi-layered security approach ensures protection against various types of attacks and vulnerabilities while maintaining system usability and performance.",
            },
          },
          // Security checklist
          {
            tag: "ol",
            additionalData: {
              minWords: 55,
              maxWords: 110,
              actualContent:
                "Security implementation checklist covering user authentication, data encryption, network security, access controls, audit logging, and vulnerability assessment procedures",
            },
          },
          // Security quote
          {
            tag: "blockquote",
            additionalData: {
              minWords: 18,
              maxWords: 40,
              actualContent:
                "Security is not a feature to be added later, it's a foundation that must be built into every aspect of the system architecture.",
            },
          },
        ],
      },
    ],
  },

  // Additional section - Monitoring and Maintenance (added for completeness)
  {
    tag: "h2",
    additionalData: {
      minWords: 3,
      maxWords: 7,
      actualContent: "Monitoring and Maintenance",
    },
    realContentStructure: [
      {
        tag: "p",
        additionalData: {
          minWords: 105,
          maxWords: 210,
          actualContent:
            "Ongoing monitoring and regular maintenance are essential for ensuring long-term system reliability, performance, and security in production environments.",
        },
      },
      {
        tag: "img",
        additionalData: {
          minWords: 5,
          maxWords: 15,
          actualContent:
            "System monitoring dashboard with real-time metrics and alerts",
        },
      },
      // Monitoring setup
      {
        tag: "h3",
        additionalData: {
          minWords: 2,
          maxWords: 4,
          actualContent: "Monitoring Setup",
        },
        realContentStructure: [
          {
            tag: "p",
            additionalData: {
              minWords: 80,
              maxWords: 160,
              actualContent:
                "Effective monitoring requires careful selection of key performance indicators and appropriate alerting thresholds to avoid false positives.",
            },
          },
          {
            tag: "ul",
            additionalData: {
              minWords: 40,
              maxWords: 80,
              actualContent:
                "Essential monitoring metrics including system resources, application performance, user activity, error rates, and security events",
            },
          },
          {
            tag: "p",
            additionalData: {
              minWords: 70,
              maxWords: 140,
              actualContent:
                "Automated alerting systems should be configured to notify administrators of critical issues while filtering out routine operational events.",
            },
          },
        ],
      },
    ],
  },

  // Troubleshooting section (commonly found in technical docs)
  {
    tag: "h2",
    additionalData: {
      minWords: 1,
      maxWords: 4,
      actualContent: "Troubleshooting",
    },
    realContentStructure: [
      {
        tag: "p",
        additionalData: {
          minWords: 95,
          maxWords: 190,
          actualContent:
            "Common issues and their solutions are documented here to help you quickly resolve problems and maintain system stability during operation.",
        },
      },
      // Common issues
      {
        tag: "h3",
        additionalData: {
          minWords: 2,
          maxWords: 4,
          actualContent: "Common Issues",
        },
        realContentStructure: [
          {
            tag: "p",
            additionalData: {
              minWords: 75,
              maxWords: 150,
              actualContent:
                "Most operational issues fall into predictable categories and can be resolved using systematic troubleshooting approaches.",
            },
          },
          {
            tag: "table",
            additionalData: {
              minWords: 100,
              maxWords: 200,
              actualContent:
                "Comprehensive troubleshooting reference table listing common problems, their typical causes, diagnostic steps, and detailed solution procedures with examples",
            },
          },
          // Additional troubleshooting paragraph
          {
            tag: "p",
            additionalData: {
              minWords: 85,
              maxWords: 170,
              actualContent:
                "When troubleshooting complex issues, systematic documentation of symptoms, attempted solutions, and outcomes helps identify patterns and prevent recurrence.",
            },
          },
        ],
      },
      // Diagnostic tools
      {
        tag: "h3",
        additionalData: {
          minWords: 2,
          maxWords: 4,
          actualContent: "Diagnostic Tools",
        },
        realContentStructure: [
          {
            tag: "p",
            additionalData: {
              minWords: 90,
              maxWords: 180,
              actualContent:
                "Built-in diagnostic tools and external utilities can help identify root causes of system issues and performance problems quickly and accurately.",
            },
          },
          {
            tag: "code",
            additionalData: {
              minWords: 30,
              maxWords: 70,
              actualContent:
                "Diagnostic command examples including system health checks, log analysis tools, performance profiling utilities, and network connectivity tests",
            },
          },
        ],
      },
    ],
  },

  // Conclusion section (added as requested)
  {
    tag: "h2",
    additionalData: {
      minWords: 1,
      maxWords: 3,
      actualContent: "Conclusion",
    },
    realContentStructure: [
      {
        tag: "p",
        additionalData: {
          minWords: 120,
          maxWords: 240,
          actualContent:
            "This comprehensive guide has covered all essential aspects of system implementation, from initial setup and configuration through advanced optimization and ongoing maintenance procedures.",
        },
      },
      {
        tag: "p",
        additionalData: {
          minWords: 100,
          maxWords: 200,
          actualContent:
            "Successful implementation requires attention to detail, systematic approach, and ongoing commitment to monitoring and maintenance. Following these guidelines will ensure reliable system operation.",
        },
      },
      // Key takeaways
      {
        tag: "ul",
        additionalData: {
          minWords: 60,
          maxWords: 120,
          actualContent:
            "Key takeaways including importance of proper planning, systematic implementation approach, security considerations, performance monitoring, and continuous improvement practices",
        },
      },
      // Final thoughts
      {
        tag: "p",
        additionalData: {
          minWords: 80,
          maxWords: 160,
          actualContent:
            "Remember that implementation is just the beginning. Continuous monitoring, regular updates, and proactive maintenance are essential for long-term success.",
        },
      },
      // Closing quote
      {
        tag: "blockquote",
        additionalData: {
          minWords: 15,
          maxWords: 35,
          actualContent:
            "The best systems are not just well-built, but well-maintained and continuously improved based on real-world usage patterns.",
        },
      },
    ],
  },
];
