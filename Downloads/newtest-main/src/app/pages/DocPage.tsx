import { MouseEvent, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useParams } from 'react-router';
import { ChevronRight } from 'lucide-react';
import docs, { type DocLink, type DocPageData, type DocSection } from './docs/content';

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

function countWords(text: string) {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function generateAdditionalSections(doc: DocPageData, slug: string) {
  const title = doc.title || 'Documentation';
  const topic = title.replace(/\s+with\s+|\s+and\s+/gi, ' ').toLowerCase();

  const common = {
    architecture: `The ${title} workflow is organized around a layered architecture that separates logical intent from physical implementation. It explains how the source netlist, timing constraints, and placement information are combined into a coherent flow. This page shows how the different stages of the pipeline exchange design intent, implementability, and signoff quality. Each stage must preserve the target timing, routability, and manufacturability constraints while preparing the design for the next tool in the chain.`,
    concepts: `Key concepts for ${title} include clear separation of intent, consistent naming, and the importance of constraint-driven implementation. A strong conceptual model helps teams understand why each stage of the flow exists and how it affects the final result. This page uses examples to connect abstract ideas such as clock domains, physical hierarchy, and constraint propagation with practical actions you can take during implementation. Thinking in terms of interfaces, dependencies, and verification checkpoints makes the topic easier to apply to real hardware projects.`,
    setup: `Before using the material in this page, set up a reproducible environment with the correct tool versions, PDK data, and library files. Install the required standard cell libraries, SDC constraint files, and support scripts so that the examples can be executed without additional rework. Confirm that your working directory is clean, your source files are well organized, and your build scripts have the expected environment variables. A consistent setup reduces the likelihood of tool-chain surprises and makes debugging much faster when problems occur.`,
    examples: `Examples are provided to illustrate practical execution steps and configuration choices. They show how to apply the concepts in a real design flow, including command syntax, constraint snippets, and validation checks that are important for ${topic}. Review them carefully and adapt the input parameters to match your target library and timing objectives. Practical examples are the fastest way to see how the theory maps onto actual tool behavior and results.`,
    bestPractices: `Best practices for ${title} emphasize consistency, tool transparency, and incremental validation. Retain clean version control for scripts and constraints, verify each stage with the appropriate reports, and document any custom overrides or ECO steps. Share the reasoning behind your implementation choices with your team so the next iteration is easier to maintain. These practices reduce risk and improve the chances of meeting timing, manufacturability, and functional goals.`,
    troubleshooting: `Troubleshooting guidance helps you identify the root cause of common failures and avoid unnecessary rework. For ${topic}, the most frequent issues come from missing constraints, mismatched names, insufficient tool setup, or incorrect assumptions about the target library. This page highlights diagnostic checks and remediation techniques that experienced teams use to recover quickly. A systematic approach to troubleshooting is more effective than changing one thing at random.`,
    references: `References on this page point to the most relevant companion documentation and command references. Use the links to navigate between related topics, review error code descriptions, and consult deeper design guides when the primary workflow requires more context. Reference material can also help you identify the right place to make a fix when a problem crosses multiple stages of the flow.`,
    relatedTopics: `Related topics include adjacent stages of the flow, other PDK-specific best practices, and tooling references that help you understand the broader context of ${title}. Use these topics to expand your knowledge and avoid isolated fixes that do not hold up during signoff. A broader view helps you identify the dependencies that matter most in complex implementations.`,
  };

  const details: Record<string, string> = {};

  if (slug.includes('cts')) {
    details.architecture = `Clock tree synthesis lives at the boundary between placement and timing. The ${title} stage installs buffers and structures the clock network to meet skew and latency targets while preserving the placement of standard cells and macro blocks. It consumes a placed netlist, SDC constraints, and a library of clock buffers, then produces a routed clock tree with timing metadata that downstream timing analysis relies on. This section explains why the clock tree matters for both performance and stability.`;
    details.concepts = `The main concept in ${title} is the clock network itself. Each clock root must be defined and each generated clock must be tracked through the flow. The tool must balance insertion delay, skew, and power while preserving functional correctness. Understanding how TritonCTS models clock paths and reports skew is essential for using this page successfully. This section also describes how clock tree structure affects hold timing and closure risk.`;
    details.setup = `Set up the flow by ensuring your SDC file has clean clock definitions, by loading the correct PDK library, and by verifying that the placed design is free of critical DRC issues. The CTS stage is particularly sensitive to netlist cleanliness, so pre-checks such as clock connectivity and hold slack estimates are valuable. Prepare the placement context with accurate blockages, power nets, and fixed clock root locations when required by your design.`;
    details.examples = `A practical example of ${title} includes commands that specify the root buffer, buffer library, and timing targets. For example, you may execute clock_tree_synthesis with specific buffer families and wire unit settings, then follow with report_clock_networks to validate the inserted clock tree. Use the tool's reporting features to confirm buffer count, clock skew, and the presence of all clock nets in the final network.`;
    details.bestPractices = `To succeed with ${title}, keep clock naming consistent, maintain a small number of root clocks, and avoid mixing generated clocks without explicit create_generated_clock directives. Tune the buffer selection and skew objectives in small increments rather than making large changes at once. Preserve margin for hold timing and validate changes with a full STA pass after every major CTS iteration.`;
    details.troubleshooting = `Common troubleshooting steps include checking for unrecognized clock nets, verifying that all clocks are defined in the SDC, and inspecting the CTS report for excessive inserted buffers. If the tool fails, examine the clock tree connectivity and confirm that the buffer library is available. It is also important to check that the placement has not created illegal blockages or excessive congestion around the clock network.`;
  } else if (slug.includes('rtl-synthesis')) {
    details.architecture = `RTL synthesis transforms Verilog or SystemVerilog into a gate-level netlist that is consumable by placement and routing tools. The ${title} stage is the first major translation step, and it must preserve the designer's intent while mapping logic to the target standard cell library. This section describes how the synthesis stage bridges RTL structure, clock definitions, and physical implementation requirements.`;
    details.concepts = `Important concepts include logical equivalence, technology mapping, register inference, and clock domain management. ${title} introduces the idea of keeping the netlist clean, avoiding unintentionally inferred latches, and ensuring that the synthesized names match the expected SDC constraints. It also explains how cell library selection impacts timing, power, and area tradeoffs.`,
    details.setup = `Prepare ${title} by loading the correct library files, defining the top-level module, and providing constraints that include clock, false paths, and input/output delays when available. A well-prepared synthesis run produces a netlist that is easier to place and analyze downstream. Make sure the synthesis script uses the proper hierarchy and module names so the resulting netlist can be directly consumed by physical tools.`;
    details.examples = `Example Yosys commands include reading source files, elaborating the design, selecting the target cell library, and writing out a synthesized netlist. The sample command sequence shown here demonstrates the minimal steps while leaving room for library-specific options. Add explicit checks for inferred latches, unsupported language constructs, and flattened hierarchies when necessary.`;
    details.bestPractices = `Best practices for ${title} are to preserve clock names, avoid complex generate constructs when possible, and verify the synthesized netlist with formal or lint checks. Keep the SDC and design hierarchy aligned so downstream tools do not suffer from mismatched names. Document any synthesis constraints and maintain a traceable mapping between RTL modules and synthesized netlist segments.`;
    details.troubleshooting = `When ${title} produces unexpected results, look for unsupported language constructs, missing library cells, or mismatched module instances. Review Yosys logs for warnings about inferred latches or unsupported expressions, and correct the RTL or synthesis script accordingly. Verify that the output netlist includes all expected ports and that the timing constraints are attached to the right clock domains.`;
  } else if (slug.includes('floorplanning')) {
    details.architecture = `Floorplanning establishes the physical layout intent early in the implementation flow. The ${title} stage defines the die area, power and ground ring, macro placements, and channel space, creating the spatial constraints that placement and routing depend on. This section explains how floorplan structure guides later routing decisions and timing closure.`;
    details.concepts = `Core concepts in ${title} include hierarchy partitioning, aspect ratio control, power mesh planning, and IO pad placement. Floorplanning also defines keepout regions for macros, power switch cells, and analog blocks, which are critical for successful downstream placement. It emphasizes the impact of macro placement and channel planning on congestion and routing feasibility.`;
    details.setup = `Set up ${title} by describing the die outline, setting core offsets, and reserving the necessary routing channels. Make sure the load of macros, memories, and I/O cells is balanced for the target performance and manufacturability goals. Include power/ground planning early to avoid expensive changes after placement.`;
    details.examples = `Examples for ${title} include scripts that create the die area, assign fixed placements for memory macros, and define the power rails. These examples help clarify how to express floorplan constraints in the Tcl scripts used by OpenROAD. Use them to capture the design intent for both timing and manufacturing.`;
    details.bestPractices = `In ${title}, preserve channel width, avoid overly aggressive density, and place clock roots near the center of the core where possible. A good floorplan allows routing to complete efficiently and reduces the risk of congestion closures later in the flow. Document the floorplan assumptions clearly so follow-on teams can maintain the intent.`;
    details.troubleshooting = `Troubleshoot ${title} by validating the floorplan with early DRC checks, checking for invalid macro overlaps, and ensuring that power and ground rings are continuous. If placement fails, review the reserved channels and adjust block spacing as needed. Verify that the floorplan still supports the expected routing resources after macro placement.`;
  } else if (slug.includes('placement-with-replace')) {
    details.architecture = `Placement with RePlAce solves a global and detailed placement problem by optimizing cell locations under density and timing constraints. The ${title} stage takes a synthesized netlist, LEF/DEF floorplan, and timing constraints to produce a physically legal placement. This section explains the relationship between global placement metrics and local optimization quality.`;
    details.concepts = `Key concepts include cell density, net wirelength, macro interference, and timing-driven placement. ${title} balances placement quality with routability by adjusting the tradeoff between optimal timing and congestion avoidance. It also describes how fixity, blockages, and power structure influence the placement solution.`;
    details.setup = `Prepare ${title} by providing a consistent netlist, correct library LEF models, placed macro definitions, and the necessary constraint files. Confirm that the design hierarchy and file formats are compatible with the placement toolchain. Add path-based timing constraints and local pin assignments as needed for the most critical regions.`;
    details.examples = `Example ${title} invocations show how to set placement density, fix macros, and generate placement reports. The sample commands illustrate how to influence the optimizer without over-constraining the solution. They also explain which placement statistics to track as the tool runs.`;
    details.bestPractices = `Best practices for ${title} include keeping placement density moderate, using power-aware placement settings, and avoiding extreme optimization goals on the first pass. Check the initial routeability estimates before committing to detailed placement. Use incremental flow iterations to improve results without destabilizing timing.`;
    details.troubleshooting = `To troubleshoot ${title}, examine early congestion and DRC reports, verify power supply connectivity, and ensure macros have enough legal placement region. If the placement is unstable, simplify the constraints and iterate incrementally. Look for local hotspots and adjust placement or cell spreading accordingly.`;
  } else if (slug.includes('routing-with-fastroute')) {
    details.architecture = `Routing with FastRoute is the stage where the physical netlist is assigned to metal layers and wiring resources. The ${title} phase produces a global routing solution that guides the detailed router and ensures that congestion budgets are respected. This section also explains how global routing output is consumed by downstream routers.`;
    details.concepts = `Important concepts in ${title} include layer assignment, congestion analysis, routing budgets, and channel usage. By understanding how FastRoute allocates wires across multiple metal layers, designers can avoid hot spots and reduce the risk of unrouted nets. It also describes the relationship between global route density and final routing success.`;
    details.setup = `Set up ${title} by loading the placed design, the routing layer stack, and any user-defined blockages or routing constraints. Make sure the router is aware of the available vias and layer capacities for the chosen PDK. Include any preferred routing directives or forbidden zones required by the physical layout.`;
    details.examples = `Sample ${title} commands demonstrate how to run the global router, inspect congestion maps, and adjust routing parameters. These examples provide a practical starting point for using FastRoute effectively in an OpenROAD flow. They emphasize how to navigate layer assignments and congestion reports to guide the tool.`;
    details.bestPractices = `Best practices for ${title} include reviewing congestion reports early, preserving routing channels around macros, and using layer weight adjustments to shift traffic away from overloaded layers. Keep the physical design balanced to support clean detailed routing. Preserve a margin for the detailed router by avoiding overly tight channel assignments.`;
    details.troubleshooting = `If ${title} fails, start by checking the congestion report and verifying that all nets are routable within the available layers. Use blockages to guide the router away from critical regions and simplify the design to recover from heavy congestion. Confirm that the routing resource budget matches the expected net demand.`;
  } else if (slug.includes('signoff-with-opensta')) {
    details.architecture = `Signoff with OpenSTA validates the final timing of the design after placement, CTS, and routing. The ${title} stage analyzes path delays, summarizes slack, and confirms that the design meets the timing constraints required for production. It connects the implemented netlist with the timing intent expressed in the constraints.`;
    details.concepts = `Core concepts include worst-case and best-case corners, multi-mode/multi-corner analysis, clock uncertainty, and the distinction between setup and hold slack. ${title} helps engineers understand how the final design behaves across the full operating envelope. This section also covers the role of generated clocks and false paths in signoff analysis.`;
    details.setup = `Configure ${title} by loading the netlist, the final SDC, and the appropriate liberty files before running timing reports. Establish the correct operating corners and specify the clock libraries so that OpenSTA can compute accurate path delays. Validate that the netlist hierarchy and view selection match the physical implementation.`;
    details.examples = `Example ${title} workflows show timing report commands, path tracing, and slack summaries. They also demonstrate how to compare results across corners and how to interpret the most critical timing paths. Use these examples to identify the specific timing arcs that need ECO attention.`;
    details.bestPractices = `Best practices for ${title} include using the same SDC for signoff as was used during placement and CTS, keeping clock definitions consistent, and inspecting the worst paths for both launch and capture timing. Build a repeatable signoff checklist and verify that all corners are comparable before locking the design.`;
    details.troubleshooting = `Troubleshooting ${title} often involves examining common path endpoints, checking that generated clocks are defined correctly, and validating that the final netlist matches the physical design. Small constraint mismatches are the most common source of signoff failure. Use the STA report to trace back from the worst slack path to the underlying net and constraint definitions.`;
  } else if (slug.includes('sky130')) {
    details.architecture = `Sky130 is structured around a mature 130nm process, a clear layer stack, and a community-supported technology kit. The ${title} topic explains how the PDK layers, standard cell libraries, and design rules work together for predictable manufacturing. It also outlines the design flow expectations for this technology.`;
    details.concepts = `For ${title}, the core concepts include PDK compatibility, library selection, and layout practices. Sky130 provides standard cells, IO pads, SRAM macros, and DRC rules, which need to be treated as a coherent family throughout the flow. This section explains how the Sky130 process choices affect timing, power, and rule compliance.`;
    details.setup = `Set up ${title} by obtaining the SkyWater Sky130 PDK, making sure the environment variables point to the correct PDK root, and verifying that the library files are available to the synthesis and layout tools. Confirm that the expected magic, klayout, and LVS scripts are configured for the correct layer stack.`;
    details.examples = `Examples for ${title} describe how to reference the correct cells, include the right library files, and follow the PDK's recommended naming conventions for LEF, LIB, and SPICE models. They also demonstrate the typical file organization for a Sky130-based project.`;
    details.bestPractices = `Best practices for ${title} include using the official standard cell libraries, validating the PDK setup with small test designs, and applying the PDK's documented floorplan and IO placement guidance before moving to full-chip implementation. Keep PDK-related configuration and toolchain versions synchronized across the team.`;
    details.troubleshooting = `If ${title} causes issues, verify that the PDK files are loaded correctly, that the design uses supported devices, and that DRC/LVS conditions are satisfied. Incorrect layer assignments and unmet PDK requirements are common sources of failure. Check the PDK release notes for any known issues or recommended workaround scripts.`;
  } else if (slug.includes('gf180')) {
    details.architecture = `GF180MCU is a mixed-signal PDK with analog-friendly devices, multiple threshold options, and a process layer stack optimized for MCU and power-management designs. The ${title} page explains the structure and tool expectations for GF180. It highlights why the process is suited for embedded analog-digital systems.`;
    details.concepts = `The ${title} category emphasizes analog/digital integration, special device rules, and the careful use of well ties and guard rings. It is important to understand how the PDK organizes the process layers and device types. This page also explains how analog layout differs from digital placement in the same design.`;
    details.setup = `Prepare ${title} by installing the GF180MCU PDK, verifying the process layer definitions, and ensuring the analog library files are available to the layout and verification tools. Confirm that your environment supports the mixed-signal routing and well-tie rules required by analog blocks.`;
    details.examples = `Example ${title} usage includes referencing the correct analog macro cells, applying device-specific design rules, and organizing the layout for mixed-signal floorplanning. Use the examples to see how the PDK demands change when analog and digital blocks are placed near one another.`;
    details.bestPractices = `Best practices for ${title} include isolating analog blocks, providing well ties, and using PDK-approved devices for ESD and IO support. Document the analog design constraints clearly for the verification flow. Coordinate analog and digital teams on common power and substrate planning.`;
    details.troubleshooting = `When ${title} is problematic, validate the device layer usage, check for incorrect analog device biasing, and review the layout for guard ring integrity. The PDK's special considerations are often the key to resolving mixed-signal issues. Review mixed-signal DRC/LVS reports for the first sign of integration problems.`;
  } else if (slug.includes('timing-errors') || slug.includes('setup-timing') || slug.includes('hold-timing') || slug.includes('clock-domain-crossing') || slug.includes('multi-corner-analysis')) {
    details.architecture = `Timing analysis is built on a clear separation between the RTL/netlist, constraints, and library models. The ${title} topic describes how those elements are combined to produce reliable timing reports and how each phase contributes to the final timing signoff. It also shows why consistent clock and constraint definitions are the foundation of meaningful timing results.`;
    details.concepts = `For ${title}, the core concepts include slack, path analysis, multi-corner evaluation, and the definition of clock domains. These ideas are central to understanding why timing failures occur and how to fix them with minimal risk. The page also explains how clock uncertainty and false paths influence the reported slack values.`;
    details.setup = `The ${title} setup includes loading the final netlist, setting the timing library corners, and defining the correct SDC constraints. Consistent clock and delay definitions are essential for accurate timing results. Good setup means the analysis model accurately reflects the implemented design and the expected operating conditions.`;
    details.examples = `Examples in ${title} show how to run timing reports, how to parse the results, and how to use the output to identify the most critical paths. They also demonstrate the tools and commands that support timing debugging. Use the examples to build a repeatable timing closure workflow for your design.`;
    details.bestPractices = `Best practices for ${title} include cross-checking constraints against the design, using conservative uncertainty values, and monitoring both setup and hold slack. Keeping the timing environment stable across iterations reduces false negatives. Document the verification strategy and review it with the design team.`;
    details.troubleshooting = `Troubleshooting ${title} often begins with the worst slack paths, generated clock definitions, and clock domain crossings. Focus on the most violated paths and verify that the associated constraints are scoped correctly and match the implemented netlist. A structured debug checklist is especially useful for timing-related problems.`;
  } else if (slug.includes('atlas-api')) {
    details.architecture = `The Atlas API architecture is designed to expose diagnostics and analysis through a secure, RESTful interface. This page explains the API layers, authentication mechanisms, and the typical request/response flow used by integrations. It also covers the contracts expected by automation scripts and dashboards.`;
    details.concepts = `Key concepts for ${title} include API keys, rate limiting, endpoint structure, and event-driven notifications. The Atlas API is intended to be consumed by automation scripts, dashboards, and continuous integration workflows. Understanding authentication and resource boundaries is critical for safe integration.`;
    details.setup = `Set up ${title} by obtaining an Atlas API key, configuring the base URL, and establishing the required headers. Make sure the API key is stored securely and only used from trusted automation environments. Test your integration on a staging API endpoint before using production data.`;
    details.examples = `Example ${title} requests show how to submit diagnostics, retrieve analysis results, and register webhook endpoints. These examples illustrate common integration patterns for Atlas-based tooling. They also demonstrate how to interpret response payloads and error codes.`;
    details.bestPractices = `Best practices for ${title} include caching results locally when possible, handling 429 responses gracefully, and using incremental polling strategies rather than aggressive request loops. Keep your API usage within defined quotas. Use retries with backoff and preserve idempotency for repeated calls.`;
    details.troubleshooting = `Troubleshooting ${title} typically involves checking authorization headers, confirming the API base URL, and validating that the request payload matches the expected schema. API errors often indicate missing parameters or invalid keys. Audit your client and server logs if requests fail unexpectedly.`;
  } else if (slug.includes('error-code-index') || slug.includes('cts-errors') || slug.includes('timing-errors') || slug.includes('routing-errors') || slug.includes('drc-lvs-errors')) {
    details.architecture = `Error reference pages are organized by failure category, diagnostic steps, and recommended remedies. The ${title} page describes how the reference information is structured and how to use it effectively when investigating a problem. It also clarifies how to move from symptom to root cause.`;
    details.concepts = `Core concepts in ${title} include categorizing failures, tracing symptoms to root causes, and using the reference as a decision support tool. A well-designed error reference reduces time spent guessing and helps you follow a systematic debugging path. It emphasizes the difference between transient symptoms and recurring failure modes.`;
    details.setup = `Prepare ${title} by enabling detailed logs, collecting the error messages and tool outputs, and identifying the relevant error code or signature. This foundation makes the reference far more useful than a generic search. Record the context around the failure so you can compare it to documented cases accurately.`;
    details.examples = `Examples in ${title} show how to map an observed error message to the documented failure mode and which follow-on checks to perform. They also show how to correlate error codes with the relevant tool stage. Use these examples to build a diagnostic path from failure to repair.`;
    details.bestPractices = `Best practices for ${title} include using the reference in conjunction with the current tool flow, verifying the conditions that triggered the error, and applying the recommended fix in a controlled way. Never assume that one error always means the same underlying cause. Maintain a history of repairs to identify persistent or high-risk issues.`;
    details.troubleshooting = `Troubleshooting ${title} is about narrowing the scope of the failure and validating the fix. Use the error reference to compare your current symptom against documented cases and then verify that the applied solution resolves the failure without introducing new issues. Document the resolution path so the team can learn from it.`;
  }

  return [
    {
      heading: 'Architecture',
      body: details.architecture || common.architecture,
    },
    {
      heading: 'Concepts',
      body: details.concepts || common.concepts,
    },
    {
      heading: 'Setup',
      body: details.setup || common.setup,
    },
    {
      heading: 'Examples',
      body: details.examples || common.examples,
    },
    {
      heading: 'Best Practices',
      body: details.bestPractices || common.bestPractices,
    },
    {
      heading: 'Troubleshooting',
      body: details.troubleshooting || common.troubleshooting,
    },
    {
      heading: 'References',
      body: common.references,
    },
    {
      heading: 'Related Topics',
      body: common.relatedTopics,
    },
  ];
}

function buildSections(doc: DocPageData, slug: string) {
  const existing = (doc.content || []).map((section: DocSection) => ({
    ...section,
    id: slugify(section.heading),
  }));

  const currentWordCount = existing.reduce((count, section) => count + countWords(section.body || ''), 0);
  const additional = currentWordCount < 900 ? generateAdditionalSections(doc, slug) : [];
  const additionalWordCount = additional.reduce((count, section) => count + countWords(section.body || ''), 0);

  // Do not auto-inject an "Additional Guidance" section; preserve original content only.

  return [...existing, ...additional].map((section: DocSection) => ({
    ...section,
    id: slugify(section.heading),
  }));
}

export function DocPage() {
  const { slug } = useParams();
  const doc: DocPageData | null = slug ? docs[slug] : null;
  const [activeSection, setActiveSection] = useState('');
  const contentRef = useRef<HTMLDivElement | null>(null);

  const sections: Array<DocSection & { id: string }> = useMemo(() => (doc && slug ? buildSections(doc, slug) : []), [doc, slug]);

  const breadcrumbMap = useMemo(() => {
    const map: Record<string, string> = {};
    Object.entries(docs).forEach(([pageSlug, pageData]) => {
      const title = pageData.title;
      if (title) map[title] = `/docs/${pageSlug}`;
      const sectionName = pageData.breadcrumb?.[0];
      if (sectionName && !map[sectionName]) map[sectionName] = `/docs/${pageSlug}`;
    });
    return map;
  }, []);

  const breadcrumbItems = useMemo(() => {
    if (!doc) return [];
    return doc.breadcrumb.map((crumb: string) => {
      if (typeof crumb === 'object') {
        return {
          title: crumb.title,
          href: crumb.href || breadcrumbMap[crumb.title] || '/docs',
        };
      }
      return {
        title: crumb,
        href: breadcrumbMap[crumb] || '/docs',
      };
    });
  }, [doc, breadcrumbMap]);

  const validRelated = useMemo(() => {
    if (!doc?.related) return [];
    return doc.related.filter((page: DocLink) => {
      if (!page.href || !page.href.startsWith('/docs/')) return true;
      const relatedSlug = page.href.replace('/docs/', '');
      return Boolean(docs[relatedSlug]);
    });
  }, [doc]);

  const navSlugs = useMemo(() => Object.keys(docs), []);
  const currentIndex = slug ? navSlugs.indexOf(slug) : -1;
  const prevSlug = currentIndex > 0 ? navSlugs[currentIndex - 1] : null;
  const nextSlug = currentIndex >= 0 && currentIndex < navSlugs.length - 1 ? navSlugs[currentIndex + 1] : null;

  useEffect(() => {
    if (sections.length > 0) {
      setActiveSection(sections[0].id);
    }
  }, [sections]);

  useEffect(() => {
    if (!contentRef.current) return;
    const observer = new IntersectionObserver(
      entries => {
        const visibleSections = entries
          .filter(entry => entry.isIntersecting)
          .sort((a, b) => (a.target as HTMLElement).offsetTop - (b.target as HTMLElement).offsetTop);
        if (visibleSections.length > 0) {
          setActiveSection((visibleSections[0].target as HTMLElement).id);
        }
      },
      {
        rootMargin: '-120px 0px -65% 0px',
        threshold: 0.1,
      }
    );

    const sectionElements = Array.from(contentRef.current.querySelectorAll<HTMLElement>('[data-doc-section]'));
    sectionElements.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, [sections]);

  const scrollToSection = (event: MouseEvent<HTMLAnchorElement>, id: string) => {
    event.preventDefault();
    const target = document.getElementById(id);
    if (target) {
      const offset = 100;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
      setActiveSection(id);
    }
  };

  if (!doc) {
    return (
      <div style={{ background: 'transparent', minHeight: '100vh', fontFamily: 'var(--font-ui)' }} className="flex items-center justify-center p-12">
        <div className="max-w-2xl text-center">
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 700, color: 'var(--abyss-ink)' }}>Documentation page not found</h2>
          <p style={{ color: '#64748B' }} className="mt-4">The doc you requested doesn't exist yet. Browse the docs hub to find available guides.</p>
          <div className="mt-6">
            <Link to="/docs" className="px-4 py-2 rounded-lg" style={{ background: 'var(--meridian-gold)', color: 'var(--abyss-ink)' }}>Back to Docs</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: 'transparent', minHeight: '100vh', fontFamily: 'var(--font-ui)' }}>
      {/* Doc Header */}
      <div className="border-b" style={{ background: '#FFFFFF', borderColor: 'var(--stone-ridge)' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded flex items-center justify-center" style={{ background: 'var(--abyss-ink)' }}>
                  <span style={{ fontSize: '0.6rem', fontWeight: 700, color: 'var(--meridian-gold)', fontFamily: 'var(--font-mono)' }}>T</span>
                </div>
                <span className="font-semibold" style={{ color: 'var(--abyss-ink)' }}>TapeItOut Docs</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link to="/docs" className="text-sm" style={{ color: '#64748B' }}>Docs Hub</Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-0 flex" style={{ minHeight: 'calc(100vh - 120px)' }}>
        <main className="flex-1 min-w-0 px-10 py-10" ref={contentRef}>
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs mb-6" style={{ color: '#94A3B8' }}>
            {breadcrumbItems.map((crumb, i) => (
              <span key={`${crumb.title}-${i}`} className="flex items-center gap-2">
                {i > 0 && <ChevronRight className="w-3 h-3" />}
                <Link to={crumb.href} className="hover:underline" style={{ color: '#64748B' }}>
                  {crumb.title}
                </Link>
              </span>
            ))}
          </div>

          <div className="flex items-start gap-4 mb-2">
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 700, color: 'var(--abyss-ink)' }}>
              {doc.title}
            </h1>
          </div>

          <div className="flex items-center gap-4 mb-8 text-xs" style={{ color: '#94A3B8' }}>
            <span>Updated {doc.lastUpdated}</span>
            <span>·</span>
            <span>{doc.readTime}</span>
          </div>

          <div className="space-y-8 max-w-2xl">
            {sections.map((section) => (
              <div key={section.id} id={section.id} data-doc-section className="scroll-mt-24">
                <h2 className="mb-3" style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 600, color: 'var(--abyss-ink)' }}>
                  {section.heading}
                </h2>
                <div className="prose text-sm leading-relaxed mb-4" style={{ color: '#475569', fontFamily: 'var(--font-editorial)', whiteSpace: 'pre-wrap' }}>
                  {section.body}
                </div>
                {section.code && (
                  <div className="rounded-lg overflow-hidden" style={{ background: '#0D1117', border: '1px solid rgba(255,255,255,0.1)' }}>
                    <div className="flex items-center justify-between px-4 py-2.5 border-b" style={{ borderColor: 'rgba(255,255,255,0.08)', background: '#161B22' }}>
                      <span className="text-xs" style={{ color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-mono)' }}>{section.codeLanguage || 'bash'}</span>
                    </div>
                    <pre className="p-4 text-sm overflow-x-auto" style={{ fontFamily: 'var(--font-mono)', color: '#E6EDF3', fontSize: '0.8125rem', lineHeight: 1.6 }}>
                      {section.code}
                    </pre>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between mt-16 pt-8 border-t max-w-2xl" style={{ borderColor: 'var(--stone-ridge)' }}>
            <Link to={prevSlug ? `/docs/${prevSlug}` : '/docs'} className="flex items-center gap-2 text-sm" style={{ color: '#64748B' }}>
              ← {prevSlug ? docs[prevSlug].title : 'Docs Hub'}
            </Link>
            <Link to={nextSlug ? `/docs/${nextSlug}` : '/docs'} className="flex items-center gap-2 text-sm" style={{ color: '#64748B' }}>
              {nextSlug ? docs[nextSlug].title : 'Docs Hub'} →
            </Link>
          </div>
        </main>

        {/* Right - TOC */}
        <aside className="w-52 shrink-0 border-l hidden lg:block sticky top-16 self-start" style={{ borderColor: 'var(--stone-ridge)', height: 'calc(100vh - 120px)', paddingTop: '1.5rem', paddingLeft: '1.25rem', paddingRight: '1.25rem' }}>
          <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: '#94A3B8' }}>On This Page</p>
          <div className="space-y-1">
            {sections.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                onClick={event => scrollToSection(event, section.id)}
                className="block text-xs py-1.5 px-2 rounded transition-colors"
                style={{
                  color: activeSection === section.id ? 'var(--abyss-ink)' : '#64748B',
                  background: activeSection === section.id ? 'rgba(15,23,42,0.05)' : 'transparent',
                }}
              >
                {section.heading}
              </a>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t" style={{ borderColor: 'var(--stone-ridge)' }}>
            <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#94A3B8' }}>Related</p>
            {validRelated.map((page: any) => (
              <Link key={page.title} to={page.href} className="block text-xs py-1.5 hover:underline" style={{ color: '#64748B' }}>
                {page.title}
              </Link>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}

export default DocPage;
