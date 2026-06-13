const docs: Record<string, any> = {
  'cts-with-tritoncts': {
    title: 'Clock Tree Synthesis with TritonCTS',
    breadcrumb: ['OpenROAD Flow', 'CTS with TritonCTS'],
    lastUpdated: 'Dec 12, 2024',
    readTime: '12 min read',
    toc: ['Overview', 'Prerequisites', 'Clock Definition (SDC)', 'Running CTS', 'Verifying the Clock Tree', 'Common Issues', 'Advanced Configuration'],
    content: [
      { heading: 'Overview', body: 'Clock Tree Synthesis (CTS) is the process of inserting buffers and inverters to distribute the clock signal across the entire design with minimal skew. TritonCTS is the CTS engine integrated into OpenROAD.' },
      { heading: 'Prerequisites', body: 'Before running CTS, ensure you have:\n• Completed global placement\n• Defined all clock sources in your SDC file using create_clock\n• Verified placement DRC passes with no critical violations' },
      { heading: 'Clock Definition (SDC)', body: 'The most common cause of CTS failure (CTS-0008) is a missing clock definition. Every clock in your design must be explicitly defined in the SDC file before CTS runs.', code: '# Required: define your clock\ncreate_clock -name clk -period 10.0 [get_ports clk]\nset_clock_uncertainty 0.1 [get_clocks clk]\nset_clock_transition 0.15 [get_clocks clk]', codeLanguage: 'sdc' },
      { heading: 'Running CTS', body: 'In OpenROAD, CTS is invoked via the clock_tree_synthesis command. The key parameters control buffer selection and target skew.', code: 'clock_tree_synthesis \\n+  -root_buf sky130_fd_sc_hd__clkbuf_16 \\n+  -buf_list {sky130_fd_sc_hd__clkbuf_4 sky130_fd_sc_hd__clkbuf_8} \\n+  -wire_unit 20 \\n+  -clk_nets clk', codeLanguage: 'tcl' },
      { heading: 'Verifying the Clock Tree', body: 'After CTS, run timing analysis and check clock skew, slews, and inserted buffer counts. Use report_clock_networks and report_power to validate.' },
      { heading: 'Common Issues', body: 'Missing clocks, incorrect port names, and unconstrained generated clocks are the top reasons CTS fails. See the Error Encyclopedia entry CTS-0008 for a worked example.' },
      { heading: 'Advanced Configuration', body: 'Tune buffer selection, wire_unit, and target_skew for large designs. Consider enabling hold repair or local buffering for high-fanout clock roots.' },
    ],
    related: [
      { title: 'SDC Constraint Guide', href: '/docs/understanding-sdc' },
      { title: 'OpenROAD CTS Command Reference', href: '/docs/rtl-synthesis-with-yosys' },
      { title: 'CTS Error Reference', href: '/docs/cts-errors' },
    ],
  },

  /* Getting Started */
  'introduction-to-tapeitout': {
    title: 'Introduction to TapeItOut',
    breadcrumb: ['Getting Started', 'Introduction to TapeItOut'],
    lastUpdated: 'Jan 08, 2025',
    readTime: '4 min read',
    toc: ['Overview', 'Who should use TapeItOut', 'Core Concepts', 'Next Steps'],
    content: [
      { heading: 'Overview', body: 'TapeItOut provides open, reproducible tooling and an intelligence layer (Atlas) to diagnose RTL-to-GDSII implementation failures across open-source and commercial flows.' },
      { heading: 'Who should use TapeItOut', body: 'Engineers doing RTL design, physical implementation, timing closure, and signoff can use TapeItOut to find failure patterns and proven fixes.' },
      { heading: 'Core Concepts', body: 'Atlas maps failure signatures to root causes, the Docs Hub collects implementation guidance, and the Cookbook provides recipes to fix common problems.' },
      { heading: 'Next Steps', body: 'Set up a local OpenROAD flow, read the SDC guide, and try the OpenROAD Cookbook recipes for hands-on debugging.' },
    ],
    related: [
      { title: 'OpenROAD Cookbook', href: '/docs/openroad-cookbook' },
      { title: 'Atlas Quickstart', href: '/docs/atlas-quickstart' },
    ],
  },

  'openroad-cookbook': {
    title: 'OpenROAD Cookbook',
    breadcrumb: ['Getting Started', 'OpenROAD Cookbook'],
    lastUpdated: 'Jan 22, 2025',
    readTime: '5 min read',
    toc: ['Overview', 'Common Failures', 'Recipes', 'How to Use This Guide'],
    content: [
      { heading: 'Overview', body: 'The OpenROAD Cookbook provides recipes for common implementation failures, with step-by-step checks and remediation techniques for each stage of the flow.' },
      { heading: 'Common Failures', body: 'The cookbook covers synthesis, placement, CTS, routing, and timing issues with practical fixes you can apply immediately.' },
      { heading: 'Recipes', body: 'Each recipe includes symptoms, root cause analysis, and actions to resolve the issue.' },
      { heading: 'How to Use This Guide', body: 'Use this page as a triage reference during debugging and pair it with Atlas diagnostics for faster closure.' },
    ],
    related: [
      { title: 'Setting up OpenROAD', href: '/docs/setting-up-openroad' },
      { title: 'RTL Synthesis with Yosys', href: '/docs/rtl-synthesis-with-yosys' },
    ],
  },

  'setting-up-openroad': {
    title: 'Setting up OpenROAD',
    breadcrumb: ['Getting Started', 'Setting up OpenROAD'],
    lastUpdated: 'Feb 03, 2025',
    readTime: '8 min read',
    toc: ['Overview', 'Prerequisites', 'Install OpenROAD', 'Typical Flow Script', 'Validation'],
    content: [
      { heading: 'Overview', body: 'This guide walks through obtaining OpenROAD, required PDKs, and a minimal flow script to run synthesis, placement, CTS, routing, and signoff.' },
      { heading: 'Prerequisites', body: 'A Linux environment (or WSL on Windows), Git, Docker (optional for reproducible builds), and enough RAM (16GB+) for medium designs.' },
      { heading: 'Install OpenROAD', body: 'Clone the OpenROAD repository and follow the build instructions. Use prebuilt packages where available for quick starts.', code: 'git clone https://github.com/The-OpenROAD-Project/OpenROAD.git\ncd OpenROAD\n./build.sh', codeLanguage: 'bash' },
      { heading: 'Typical Flow Script', body: 'A minimal script chains Yosys, RePlAce, TritonCTS, FastRoute and OpenSTA. Keep SDC ready before CTS.' },
      { heading: 'Validation', body: 'Run a small tutorial design and validate outputs (verilog->gds) and run the example tests included with OpenROAD.' },
    ],
    related: [
      { title: 'OpenROAD Cookbook', href: '/docs/openroad-cookbook' },
      { title: 'Sky130 Overview', href: '/docs/sky130-overview' },
    ],
  },

  /* Sky130 continued */
  'sky130-io-pads': {
    title: 'IO Pads',
    breadcrumb: ['Sky130 PDK', 'IO Pads'],
    lastUpdated: 'Mar 09, 2025',
    readTime: '6 min read',
    toc: ['Overview', 'Padframe', 'I/O Constraints', 'Signal Integrity'],
    content: [
      { heading: 'Overview', body: 'IO pads connect on-chip signals to package pins. Proper padframe planning is essential for power, pin assignment, and IO timing.' },
      { heading: 'Padframe', body: 'Design the padframe early and reserve area in the floorplan. Follow PDK guidance for ESD and IO ring placement.' },
      { heading: 'I/O Constraints', body: 'Define input/output delays and SDC constraints for IO cells when running timing analysis.' },
      { heading: 'Signal Integrity', body: 'Consider series termination, pull-ups, and shielding for high-speed IO lines.' },
    ],
    related: [
      { title: 'Sky130 Overview', href: '/docs/sky130-overview' },
    ],
  },

  'sky130-sram-macros': {
    title: 'SRAM Macros',
    breadcrumb: ['Sky130 PDK', 'SRAM Macros'],
    lastUpdated: 'Apr 20, 2025',
    readTime: '7 min read',
    toc: ['Overview', 'Integration', 'Timing & Place', 'Power Concerns'],
    content: [
      { heading: 'Overview', body: 'SRAM macros are pre-characterized memory blocks. Use PDK-provided macros for area and timing predictability.' },
      { heading: 'Integration', body: 'Place SRAM macros as hard macros in the floorplan and connect power/ground rails carefully.' },
      { heading: 'Timing & Place', body: 'SRAM timing often dominates local timing — plan local placement and clocking accordingly.' },
      { heading: 'Power Concerns', body: 'Consider decoupling and power islands for large memory arrays to reduce IR drop.' },
    ],
    related: [
      { title: 'Standard Cells', href: '/docs/sky130-standard-cells' },
    ],
  },

  'sky130-design-rules': {
    title: 'Design Rules',
    breadcrumb: ['Sky130 PDK', 'Design Rules'],
    lastUpdated: 'May 05, 2025',
    readTime: '9 min read',
    toc: ['Overview', 'DRC Basics', 'Common Violations', 'LVS Notes', 'Tools'],
    content: [
      { heading: 'Overview', body: 'Design rules (DRC) specify manufacturability constraints. Follow the PDK rule deck for layer spacing, enclosure, and via rules.' },
      { heading: 'DRC Basics', body: 'Learn the layer stack and rule categories (minimum width, spacing, overlap, via enclosure).' },
      { heading: 'Common Violations', body: 'Minimum spacing, antenna, and via enclosure issues are frequent during aggressive routing.' },
      { heading: 'LVS Notes', body: 'Run LVS to ensure layout matches schematic. Pay attention to substrate and well contacts for Sky130.' },
    ],
    related: [
      { title: 'DRC / LVS Errors', href: '/docs/drc-lvs-errors' },
    ],
  },

  /* OpenROAD Flow */
  'rtl-synthesis-with-yosys': {
    title: 'RTL Synthesis with Yosys',
    breadcrumb: ['OpenROAD Flow', 'RTL Synthesis with Yosys'],
    lastUpdated: 'Jan 20, 2025',
    readTime: '9 min read',
    toc: ['Overview', 'Prerequisites', 'Yosys Flow', 'Generating Netlist', 'Synthesis Tips', 'Troubleshooting'],
    content: [
      { heading: 'Overview', body: 'Yosys performs RTL elaboration and logic synthesis to produce a gate-level netlist suitable for place-and-route flows.' },
      { heading: 'Prerequisites', body: 'A synthesizable SystemVerilog/Verilog design and the appropriate liberty (.lib) files for your target standard-cell library.' },
      { heading: 'Yosys Flow', body: 'Use synth_* passes targeting your library, map latches and flops, and write out a Verilog netlist.', code: 'yosys -p "read_verilog top.v; synth; flatten; write_verilog synth.v"', codeLanguage: 'bash' },
      { heading: 'Generating Netlist', body: 'Produce a gate-level netlist and an SDC timing constraints file aligned to the design frequency.' },
      { heading: 'Synthesis Tips', body: 'Keep clock naming consistent with SDC. Use technology mapping for the PDK cells and review inferred latches.' },
      { heading: 'Troubleshooting', body: 'Synthesis errors often point to unsupported constructs, missing includes, or mismatched module instances.' },
    ],
    related: [
      { title: 'Setting up OpenROAD', href: '/docs/setting-up-openroad' },
    ],
  },

  'floorplanning': {
    title: 'Floorplanning',
    breadcrumb: ['OpenROAD Flow', 'Floorplanning'],
    lastUpdated: 'Feb 18, 2025',
    readTime: '10 min read',
    toc: ['Overview', 'Goals', 'Creating the Floorplan', 'Power & I/O Planning', 'Validation'],
    content: [
      { heading: 'Overview', body: 'Floorplanning defines macro placement, core/power rails, and reserve regions for timing and routing. Good floorplans reduce congestion and simplify closure.' },
      { heading: 'Goals', body: 'Minimize long nets, provide routing channels, and ensure power distribution. Reserve space for macros and large memories early.' },
      { heading: 'Creating the Floorplan', body: 'Set die area, core offsets, fences for macros, and power ring placement in your floorplan Tcl script.' },
      { heading: 'Power & I/O Planning', body: 'Plan power stripes and I/O placement to avoid IR hotspots and timing islands.' },
      { heading: 'Validation', body: 'Run early DRC and congestion estimation to validate the plan before placing standard cells.' },
    ],
    related: [
      { title: 'Placement with RePlAce', href: '/docs/placement-with-replace' },
    ],
  },

  'placement-with-replace': {
    title: 'Placement with RePlAce',
    breadcrumb: ['OpenROAD Flow', 'Placement with RePlAce'],
    lastUpdated: 'Mar 05, 2025',
    readTime: '9 min read',
    toc: ['Overview', 'Preparing for Placement', 'Running RePlAce', 'Tuning Parameters', 'Post-placement Checks'],
    content: [
      { heading: 'Overview', body: 'RePlAce performs global and detailed placement. Its objective is to minimize wirelength while honoring fixed blocks and timing constraints.' },
      { heading: 'Preparing for Placement', body: 'Ensure netlist and LEF/DEF floorplan are correct and that timing and SDC constraints are loaded.' },
      { heading: 'Running RePlAce', body: 'Call the placement engine with placement density targets and seeds for deterministic results.' },
      { heading: 'Tuning Parameters', body: 'Adjust density, target utilization, and spread parameters to trade-off timing and routability.' },
      { heading: 'Post-placement Checks', body: 'Run DRC and early congestion reports, and export placement reports for timing analysis.' },
    ],
    related: [
      { title: 'Floorplanning', href: '/docs/floorplanning' },
      { title: 'Routing with FastRoute', href: '/docs/routing-with-fastroute' },
    ],
  },

  'routing-with-fastroute': {
    title: 'Routing with FastRoute',
    breadcrumb: ['OpenROAD Flow', 'Routing with FastRoute'],
    lastUpdated: 'Apr 10, 2025',
    readTime: '11 min read',
    toc: ['Overview', 'Global Routing', 'Detailed Routing', 'Congestion Mitigation', 'Validation'],
    content: [
      { heading: 'Overview', body: 'FastRoute performs global routing to assign nets to metal layers and estimate congestion before detailed routing.' },
      { heading: 'Global Routing', body: 'Run global route to compute routing channels and identify hot spots. Adjust layer preferences and routing budgets.' },
      { heading: 'Detailed Routing', body: 'After global routing, run detailed router to produce final routed wires respecting design rules.' },
      { heading: 'Congestion Mitigation', body: 'If congestion is high, reduce placement density, add routing blockages around macros, or adjust routing layer weights.' },
      { heading: 'Validation', body: 'Run DRC and ensure no unrouted nets remain. Report congestion heatmaps for iterative fixes.' },
    ],
    related: [
      { title: 'Placement with RePlAce', href: '/docs/placement-with-replace' },
    ],
  },

  'signoff-with-opensta': {
    title: 'Signoff with OpenSTA',
    breadcrumb: ['OpenROAD Flow', 'Signoff with OpenSTA'],
    lastUpdated: 'May 02, 2025',
    readTime: '8 min read',
    toc: ['Overview', 'Setup', 'Common Reports', 'Interpreting Results', 'Best Practices'],
    content: [
      { heading: 'Overview', body: 'OpenSTA provides static timing analysis for verifying timing closure. Use it after placement, CTS, and routing to report WNS/TNS and per-path slack.' },
      { heading: 'Setup', body: 'Load the final netlist, SDC, and liberty files before running timing reports.' },
      { heading: 'Common Reports', body: 'report_tns, report_wns, report_timing -path should be used to inspect worst paths and root causes.' },
      { heading: 'Interpreting Results', body: 'Identify critical paths, latch-to-latch timing arcs, and analyze clock uncertainty impacts.' },
      { heading: 'Best Practices', body: 'Keep SDC accurate, maintain matching clock names, and correlate STA with placement and CTS outputs.' },
    ],
    related: [
      { title: 'Timing Analysis', href: '/docs/understanding-sdc' },
    ],
  },

  'understanding-sdc': {
    title: 'Understanding SDC',
    breadcrumb: ['Timing Analysis', 'Understanding SDC'],
    lastUpdated: 'Jan 30, 2025',
    readTime: '10 min read',
    toc: ['Overview', 'Clock Constraints', 'Input/Output Delays', 'Generated Clocks', 'Common Mistakes'],
    content: [
      { heading: 'Overview', body: 'SDC (Synopsys Design Constraints) communicates timing intent to synthesis, CTS, and STA tools. Correct SDC is critical for successful CTS and STA.' },
      { heading: 'Clock Constraints', body: 'Define clocks with create_clock and set_clock_uncertainty. Ensure names match ports/net names used by synthesis.' },
      { heading: 'Input/Output Delays', body: 'Specify set_input_delay and set_output_delay relative to the external clock to model pin timing.' },
      { heading: 'Generated Clocks', body: 'Use create_generated_clock for PLLs or gated clocks so CTS/STA understand derived clocks.' },
      { heading: 'Common Mistakes', body: 'Missing clocks, mis-scoped objects, and incorrect net/port patterns are frequent causes of timing mismatch.' },
    ],
    related: [
      { title: 'Clock Tree Synthesis with TritonCTS', href: '/docs/cts-with-tritoncts' },
    ],
  },

  'cts-errors': {
    title: 'CTS Errors',
    breadcrumb: ['Error Reference', 'CTS Errors'],
    lastUpdated: 'Mar 13, 2025',
    readTime: '7 min read',
    toc: ['Overview', 'Common CTS Codes', 'Debug Checklist'],
    content: [
      { heading: 'Overview', body: 'CTS errors typically stem from missing clocks, unconstrained clocks, or placement issues that prevent buffer insertion or tree balancing.' },
      { heading: 'Common CTS Codes', body: 'CTS-0008: No clock defined; CTS-0003: Skew exceeds budget; CTS-0011: Buffer insertion failure.' },
      { heading: 'Debug Checklist', body: 'Verify SDC, confirm clock nets exist, run placement DRC, and examine buffer library availability.' },
    ],
    related: [
      { title: 'Clock Tree Synthesis with TritonCTS', href: '/docs/cts-with-tritoncts' },
      { title: 'Understanding SDC', href: '/docs/understanding-sdc' },
    ],
  },

  'drc-lvs-errors': {
    title: 'DRC / LVS Errors',
    breadcrumb: ['Error Reference', 'DRC/LVS Errors'],
    lastUpdated: 'May 20, 2025',
    readTime: '9 min read',
    toc: ['Overview', 'DRC Violations', 'LVS Mismatches', 'Repair Strategies'],
    content: [
      { heading: 'Overview', body: 'DRC and LVS ensure layout meets manufacturing rules and matches schematic. These are the last gatekeepers before tapeout.' },
      { heading: 'DRC Violations', body: 'Spacing, width, and enclosure errors are typical — follow PDK guidance for fixes.' },
      { heading: 'LVS Mismatches', body: 'Missing contacts or netlist differences cause LVS failures; ensure extracted netlist maps to schematic connectivity.' },
      { heading: 'Repair Strategies', body: 'Use layout fixes, add contacts, and re-run extraction to resolve LVS mismatches.' },
    ],
    related: [
      { title: 'Sky130 Design Rules', href: '/docs/sky130-design-rules' },
      { title: 'Error Code Index', href: '/docs/error-code-index' },
    ],
  },

  /* Sky130 PDK */
  'sky130-overview': {
    title: 'Sky130 Overview',
    breadcrumb: ['Sky130 PDK', 'Sky130 Overview'],
    lastUpdated: 'Jan 15, 2025',
    readTime: '6 min read',
    toc: ['Overview', 'Technology Highlights', 'Libraries', 'Getting Started'],
    content: [
      { heading: 'Overview', body: 'SkyWater Sky130 is a mature open PDK widely used in open-source silicon projects. This page summarizes its layers, standard cells, and design considerations.' },
      { heading: 'Technology Highlights', body: '130nm node, multi-threshold cells, accessible SPICE models, and community-maintained design rules.' },
      { heading: 'Libraries', body: 'Standard cell libraries (e.g., sky130_fd_sc_hd) and IO cells are available; match your synthesis technology mapping to the correct liberty files.' },
      { heading: 'Getting Started', body: 'Download PDK artifacts and familiarize yourself with the DRC/LVS flow (Magic/KLayout).' },
    ],
    related: [
      { title: 'Standard Cells', href: '/docs/sky130-standard-cells' },
    ],
  },

  'sky130-standard-cells': {
    title: 'Standard Cells',
    breadcrumb: ['Sky130 PDK', 'Standard Cells'],
    lastUpdated: 'Feb 01, 2025',
    readTime: '7 min read',
    toc: ['Overview', 'Library Structure', 'Timing Models', 'Area & Power'],
    content: [
      { heading: 'Overview', body: 'Standard cells provide the building blocks for synthesized logic. Understand drive strengths, threshold options, and timing models.' },
      { heading: 'Library Structure', body: 'Cells are organized by height, drive strength, and function. Map the correct liberty (.lib) when synthesizing for the PDK.' },
      { heading: 'Timing Models', body: 'Use the provided liberty files for STA. Confirm the characterized corners match your signoff intent.' },
      { heading: 'Area & Power', body: 'Choose cell drive strengths to balance timing and power. Analyze leakage and switching power using power reports.' },
    ],
    related: [
      { title: 'Sky130 Overview', href: '/docs/sky130-overview' },
    ],
  },

  'your-first-design-flow': {
    title: 'Your First Design Flow',
    breadcrumb: ['Getting Started', 'Your First Design Flow'],
    lastUpdated: 'Mar 01, 2025',
    readTime: '6 min read',
    toc: ['Overview', 'Design Stages', 'Recommended Tools', 'First Run'],
    content: [
      { heading: 'Overview', body: 'This page guides you through the first complete design flow from RTL to GDS using open-source tools and the OpenROAD stack.' },
      { heading: 'Design Stages', body: 'The flow includes RTL synthesis, floorplanning, placement, CTS, routing, and timing signoff. Each stage has target checks and validation steps.' },
      { heading: 'Recommended Tools', body: 'Use Yosys for synthesis, RePlAce for placement, TritonCTS for clock tree synthesis, FastRoute for routing, and OpenSTA for timing analysis.' },
      { heading: 'First Run', body: 'Start with a small example design, verify each stage, and review reports before moving to a larger project.' },
    ],
    related: [
      { title: 'OpenROAD Cookbook', href: '/docs/openroad-cookbook' },
      { title: 'Setting up OpenROAD', href: '/docs/setting-up-openroad' },
    ],
  },

  'atlas-quickstart': {
    title: 'Atlas Quickstart',
    breadcrumb: ['Getting Started', 'Atlas Quickstart'],
    lastUpdated: 'Mar 05, 2025',
    readTime: '5 min read',
    toc: ['Overview', 'Access', 'Common Workflows', 'First Query'],
    content: [
      { heading: 'Overview', body: 'Atlas provides diagnostics and datasets to help you troubleshoot physical implementation failures faster.' },
      { heading: 'Access', body: 'Log in to Atlas, obtain an API key, and review the available error categories and reports.' },
      { heading: 'Common Workflows', body: 'Submit logs, inspect error signatures, and use Atlas recommendations to narrow failure root causes.' },
      { heading: 'First Query', body: 'Try a sample query to search for similar failures and review the documented fixes in the Atlas library.' },
    ],
    related: [
      { title: 'Atlas API Reference', href: '/docs/atlas-api-reference' },
      { title: 'Your First Design Flow', href: '/docs/your-first-design-flow' },
    ],
  },

  'gf180-overview': {
    title: 'GF180MCU Overview',
    breadcrumb: ['GF180MCU PDK', 'GF180MCU Overview'],
    lastUpdated: 'Apr 10, 2025',
    readTime: '6 min read',
    toc: ['Overview', 'Technology Highlights', 'Libraries', 'Use Cases'],
    content: [
      { heading: 'Overview', body: 'GF180MCU is a specialty PDK for mixed-signal and embedded MCU applications, featuring mature analog and digital libraries.' },
      { heading: 'Technology Highlights', body: 'The PDK includes thick metal routing, multiple threshold devices, and analog-friendly processes.' },
      { heading: 'Libraries', body: 'Use the supplied standard cell libraries and analog macro libraries provided by the foundry.' },
      { heading: 'Use Cases', body: 'GF180MCU is well-suited for sensors, power management, and hybrid analog-digital systems.' },
    ],
    related: [
      { title: 'GF180MCU Design Rules', href: '/docs/gf180-design-rules' },
    ],
  },

  'gf180-process-layers': {
    title: 'GF180MCU Process Layers',
    breadcrumb: ['GF180MCU PDK', 'Process Layers'],
    lastUpdated: 'Apr 12, 2025',
    readTime: '7 min read',
    toc: ['Overview', 'Layer Stack', 'Routing Layers', 'Device Layers'],
    content: [
      { heading: 'Overview', body: 'This page summarizes the GF180MCU process layers, including substrate, wells, metal, and via layers used for layout.' },
      { heading: 'Layer Stack', body: 'Understand the layer stack and how the PDK maps devices and interconnect to physical layers.' },
      { heading: 'Routing Layers', body: 'Use designated routing layers for signal, power, and clock nets to meet manufacturability constraints.' },
      { heading: 'Device Layers', body: 'Place transistors and contacts using the device layers defined by the GF180MCU PDK.' },
    ],
    related: [
      { title: 'GF180MCU Overview', href: '/docs/gf180-overview' },
    ],
  },

  'gf180-device-types': {
    title: 'GF180MCU Device Types',
    breadcrumb: ['GF180MCU PDK', 'Device Types'],
    lastUpdated: 'Apr 14, 2025',
    readTime: '6 min read',
    toc: ['Overview', 'Transistors', 'Passive Devices', 'Analog Macro Cells'],
    content: [
      { heading: 'Overview', body: 'GF180MCU includes multiple transistor flavors, analog devices, and passive components tailored for mixed-signal applications.' },
      { heading: 'Transistors', body: 'Use available NMOS, PMOS, and specialized high-voltage MOS devices for digital and analog circuits.' },
      { heading: 'Passive Devices', body: 'Resistors, capacitors, and inductors are available with PDK-defined matching and layout rules.' },
      { heading: 'Analog Macro Cells', body: 'Analog macros such as ADCs, op-amps, and bandgaps simplify mixed-signal design integration.' },
    ],
    related: [
      { title: 'GF180MCU Process Layers', href: '/docs/gf180-process-layers' },
    ],
  },

  'gf180-design-rules': {
    title: 'GF180MCU Design Rules',
    breadcrumb: ['GF180MCU PDK', 'Design Rules'],
    lastUpdated: 'Apr 16, 2025',
    readTime: '8 min read',
    toc: ['Overview', 'DRC Basics', 'LVS Basics', 'Special Considerations'],
    content: [
      { heading: 'Overview', body: 'GF180MCU design rules ensure manufacturability for mixed-signal and high-voltage devices. Follow the foundry rule deck carefully.' },
      { heading: 'DRC Basics', body: 'Pay attention to minimum widths, spacing, and enclosure rules for both digital and analog layers.' },
      { heading: 'LVS Basics', body: 'Verify layout connectivity against the schematic, especially for analog blocks and well contacts.' },
      { heading: 'Special Considerations', body: 'Mixed-signal designs require careful isolation, substrate ties, and guard ring placement.' },
    ],
    related: [
      { title: 'GF180MCU Overview', href: '/docs/gf180-overview' },
    ],
  },

  'setup-timing': {
    title: 'Setting up Timing Analysis',
    breadcrumb: ['Timing Analysis', 'Setting up Timing'],
    lastUpdated: 'May 05, 2025',
    readTime: '7 min read',
    toc: ['Overview', 'Why Timing Matters', 'Tools', 'Best Practices'],
    content: [
      { heading: 'Overview', body: 'Timing analysis verifies that the design meets its frequency targets across corners. Proper setup is essential for reliable signoff.' },
      { heading: 'Why Timing Matters', body: 'Incorrect timing setup can mask critical paths and produce unreliable silicon results.' },
      { heading: 'Tools', body: 'Use OpenSTA or equivalent STA tools with accurate SDC, netlist, and library models.' },
      { heading: 'Best Practices', body: 'Keep constraints up to date, use consistent clock definitions, and review slack across multiple corners.' },
    ],
    related: [
      { title: 'Understanding SDC', href: '/docs/understanding-sdc' },
      { title: 'Hold Timing', href: '/docs/hold-timing' },
    ],
  },

  'hold-timing': {
    title: 'Hold Timing',
    breadcrumb: ['Timing Analysis', 'Hold Timing'],
    lastUpdated: 'May 07, 2025',
    readTime: '6 min read',
    toc: ['Overview', 'Hold Checks', 'Common Violations', 'Fixes'],
    content: [
      { heading: 'Overview', body: 'Hold timing ensures data is stable after a clock edge. It is often the first issue uncovered after placement and clock tree synthesis.' },
      { heading: 'Hold Checks', body: 'Check the minimum delay paths and confirm hold slack is positive for all clock domains.' },
      { heading: 'Common Violations', body: 'Clock uncertainty, short paths, and clock skew can create hold violations.' },
      { heading: 'Fixes', body: 'Use buffers, add delay elements, or modify clock routing to address hold timing issues.' },
    ],
    related: [
      { title: 'Setting up Timing', href: '/docs/setup-timing' },
    ],
  },

  'clock-domain-crossing': {
    title: 'Clock Domain Crossing',
    breadcrumb: ['Timing Analysis', 'Clock Domain Crossing'],
    lastUpdated: 'May 09, 2025',
    readTime: '8 min read',
    toc: ['Overview', 'CDC Risks', 'Synchronization', 'Verification'],
    content: [
      { heading: 'Overview', body: 'Clock domain crossings require careful synchronization to avoid metastability and functional failures.' },
      { heading: 'CDC Risks', body: 'Asynchronous clock boundaries can cause data corruption if not protected by proper synchronizers.' },
      { heading: 'Synchronization', body: 'Use multi-stage synchronizers and handshake protocols for safe CDC transfers.' },
      { heading: 'Verification', body: 'Verify CDC paths with static checks, assertions, and timing analysis tools.' },
    ],
    related: [
      { title: 'Timing Errors', href: '/docs/timing-errors' },
      { title: 'Understanding SDC', href: '/docs/understanding-sdc' },
    ],
  },

  'multi-corner-analysis': {
    title: 'Multi-Corner Analysis',
    breadcrumb: ['Timing Analysis', 'Multi-Corner Analysis'],
    lastUpdated: 'May 11, 2025',
    readTime: '7 min read',
    toc: ['Overview', 'Corners', 'Signoff Flow', 'Interpreting Results'],
    content: [
      { heading: 'Overview', body: 'Multi-corner analysis checks timing across process, voltage, and temperature corners to ensure the design is robust in all operating conditions.' },
      { heading: 'Corners', body: 'Define fast, slow, and nominal corners for both timing and power analysis.' },
      { heading: 'Signoff Flow', body: 'Run timing reports for each corner and compare results to signoff thresholds.' },
      { heading: 'Interpreting Results', body: 'Focus on worst-case slack, and use the corner data to guide ECOs and buffer tuning.' },
    ],
    related: [
      { title: 'Understanding SDC', href: '/docs/understanding-sdc' },
      { title: 'Setup Timing', href: '/docs/setup-timing' },
    ],
  },

  'atlas-api-reference': {
    title: 'Atlas API Reference',
    breadcrumb: ['Atlas API', 'API Reference'],
    lastUpdated: 'May 12, 2025',
    readTime: '6 min read',
    toc: ['Overview', 'Authentication', 'Endpoints', 'Rate Limits'],
    content: [
      { heading: 'Overview', body: 'Atlas exposes a REST API for submitting logs, querying diagnoses, and retrieving community-proven fixes.' },
      { heading: 'Authentication', body: 'Use an API key in the Authorization header and keep your key secure.' },
      { heading: 'Endpoints', body: 'Key endpoints include submitting diagnostics, retrieving analysis results, and searching the error database.' },
      { heading: 'Rate Limits', body: 'Observe service quotas and back off on 429 responses to avoid throttling.' },
    ],
    related: [
      { title: 'Atlas API Authentication', href: '/docs/atlas-api-authentication' },
    ],
  },

  'atlas-api-authentication': {
    title: 'Atlas API Authentication',
    breadcrumb: ['Atlas API', 'API Authentication'],
    lastUpdated: 'May 14, 2025',
    readTime: '5 min read',
    toc: ['Overview', 'API Keys', 'OAuth', 'Security'],
    content: [
      { heading: 'Overview', body: 'Atlas supports API key authentication for service access and secure integration with external tools.' },
      { heading: 'API Keys', body: 'Generate and manage keys in the Atlas dashboard. Use keys in Authorization headers for API calls.' },
      { heading: 'OAuth', body: 'OAuth may be available for user-level access flows when integrating third-party apps.' },
      { heading: 'Security', body: 'Never commit API keys to source control and rotate them regularly.' },
    ],
    related: [
      { title: 'Atlas API Reference', href: '/docs/atlas-api-reference' },
    ],
  },

  'atlas-api-endpoints': {
    title: 'Atlas API Endpoints',
    breadcrumb: ['Atlas API', 'API Endpoints'],
    lastUpdated: 'May 16, 2025',
    readTime: '6 min read',
    toc: ['Overview', 'Submit Logs', 'Query Diagnostics', 'List Errors'],
    content: [
      { heading: 'Overview', body: 'These endpoints enable log submission, diagnostic retrieval, and searching known error signatures.' },
      { heading: 'Submit Logs', body: 'POST /api/v1/diagnose sends logs and metadata for analysis.' },
      { heading: 'Query Diagnostics', body: 'GET /api/v1/diagnoses/:id returns diagnosis details and recommended fixes.' },
      { heading: 'List Errors', body: 'GET /api/v1/errors returns error codes and descriptions for integration into dashboards.' },
    ],
    related: [
      { title: 'Atlas API Reference', href: '/docs/atlas-api-reference' },
    ],
  },

  'atlas-api-webhooks': {
    title: 'Atlas API Webhooks',
    breadcrumb: ['Atlas API', 'API Webhooks'],
    lastUpdated: 'May 18, 2025',
    readTime: '6 min read',
    toc: ['Overview', 'Webhook Setup', 'Payloads', 'Retry Policy'],
    content: [
      { heading: 'Overview', body: 'Atlas webhooks notify external systems when diagnostics complete or when new error signatures are published.' },
      { heading: 'Webhook Setup', body: 'Register a webhook URL and configure event types in the Atlas dashboard.' },
      { heading: 'Payloads', body: 'Payloads include diagnostic summaries, links to error details, and status metadata.' },
      { heading: 'Retry Policy', body: 'Atlas retries failed deliveries and logs webhook failures for troubleshooting.' },
    ],
    related: [
      { title: 'Atlas API Reference', href: '/docs/atlas-api-reference' },
    ],
  },

  'atlas-api-rate-limits': {
    title: 'Atlas API Rate Limits',
    breadcrumb: ['Atlas API', 'Rate Limits'],
    lastUpdated: 'May 20, 2025',
    readTime: '6 min read',
    toc: ['Overview', 'Quota', 'Retry After', 'Best Practices'],
    content: [
      { heading: 'Overview', body: 'Atlas enforces API rate limits to ensure stable service for all users. Respect limits and use exponential backoff for retries.' },
      { heading: 'Quota', body: 'Your API plan determines daily and per-minute request quotas. Monitor usage to avoid throttling.' },
      { heading: 'Retry After', body: 'Use the Retry-After header on 429 responses to know when it is safe to try again.' },
      { heading: 'Best Practices', body: 'Batch requests, cache results, and avoid polling when possible to stay within rate limits.' },
    ],
    related: [
      { title: 'Atlas API Reference', href: '/docs/atlas-api-reference' },
    ],
  },

  'error-code-index': {
    title: 'Error Code Index',
    breadcrumb: ['Error Reference', 'Error Code Index'],
    lastUpdated: 'Jun 01, 2025',
    readTime: '7 min read',
    toc: ['Overview', 'Error Categories', 'Searching Codes', 'Common Fixes'],
    content: [
      { heading: 'Overview', body: 'The error code index provides a directory of documented failure signatures and links into the detailed error reference pages.' },
      { heading: 'Error Categories', body: 'Errors are grouped by synthesis, timing, routing, DRC/LVS, and tool-specific failures.' },
      { heading: 'Searching Codes', body: 'Use the index to quickly find the code description and recommended diagnostic steps.' },
      { heading: 'Common Fixes', body: 'Many errors resolve with constraint correction, placement tuning, or routing adjustments.' },
    ],
    related: [
      { title: 'CTS Errors', href: '/docs/cts-errors' },
      { title: 'Timing Errors', href: '/docs/timing-errors' },
      { title: 'Routing Errors', href: '/docs/routing-errors' },
      { title: 'DRC / LVS Errors', href: '/docs/drc-lvs-errors' },
    ],
  },

  'timing-errors': {
    title: 'Timing Errors',
    breadcrumb: ['Error Reference', 'Timing Errors'],
    lastUpdated: 'Jun 03, 2025',
    readTime: '7 min read',
    toc: ['Overview', 'Setup Issues', 'Path Violations', 'Clock Problems'],
    content: [
      { heading: 'Overview', body: 'Timing errors arise when paths do not meet setup or hold requirements. This page summarizes the most frequent timing failure modes.' },
      { heading: 'Setup Issues', body: 'Negative slack on data launch and capture paths is a common indicator of setup timing failure.' },
      { heading: 'Path Violations', body: 'Review the longest paths and the nets involved to identify critical timing bottlenecks.' },
      { heading: 'Clock Problems', body: 'Clock uncertainty, skew, and missing constraints often trigger timing errors.' },
    ],
    related: [
      { title: 'Understanding SDC', href: '/docs/understanding-sdc' },
    ],
  },

  'routing-errors': {
    title: 'Routing Errors',
    breadcrumb: ['Error Reference', 'Routing Errors'],
    lastUpdated: 'Jun 05, 2025',
    readTime: '8 min read',
    toc: ['Overview', 'Congestion', 'Open Nets', 'Violations'],
    content: [
      { heading: 'Overview', body: 'Routing errors include congestion, open nets, and rule violations that prevent complete route generation.' },
      { heading: 'Congestion', body: 'Overfilled routing regions can cause failure in detailed routing and require placement or block adjustments.' },
      { heading: 'Open Nets', body: 'Unrouted nets often indicate a path through the design that cannot fit within the assigned metal layers.' },
      { heading: 'Violations', body: 'DRC routing violations occur when wires or vias violate spacing, width, or enclosure rules.' },
    ],
    related: [
      { title: 'Routing with FastRoute', href: '/docs/routing-with-fastroute' },
    ],
  },
};

export default docs;

