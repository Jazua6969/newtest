export interface LearningSection {
  heading: string;
  body: string;
  code?: string;
  codeLanguage?: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  answerIndex: number;
  explanation: string;
}

export interface LearningModule {
  slug: string;
  title: string;
  description: string;
  duration: string;
  minutes: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  objectives: string[];
  prerequisites: string[];
  sections: LearningSection[];
  summary: string;
  quiz: QuizQuestion[];
}

export interface LearningPath {
  slug: string;
  title: string;
  description: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  modules: LearningModule[];
  duration: string;
  recommended?: boolean;
}

export interface LearningProgressState {
  activeLearningPath: string;
  lastVisitedModule: string;
  completedModules: string[];
  totalLearningTimeMinutes: number;
  lastViewedSectionByModule: Record<string, string>;
}

export const progressStorageKey = 'learningProgress';

export const learningPaths: LearningPath[] = [
  {
    slug: 'openroad-complete-flow',
    title: 'OpenROAD Complete Flow',
    description: 'Master the full RTL-to-GDSII flow using the OpenROAD open-source EDA toolchain.',
    level: 'Intermediate',
    duration: '12h',
    recommended: true,
    modules: [
      {
        slug: 'rtl-design-fundamentals',
        title: 'RTL Design Fundamentals',
        description: 'Build a stable RTL foundation with a focus on synthesizable design and timing-aware structure.',
        duration: '75 min',
        minutes: 75,
        difficulty: 'Intermediate',
        objectives: [
          'Identify RTL coding patterns that map well to synthesis.',
          'Write clocked registers and synchronous state machines.',
          'Avoid common synthesis traps such as latches and inferrable RAM.',
        ],
        prerequisites: ['Basic Verilog or SystemVerilog knowledge', 'Familiarity with digital logic'],
        sections: [
          {
            heading: 'Introduction',
            body: 'RTL design is the first step in the physical implementation flow. In this module, you learn how to structure registers, modules, and interfaces so your design can be synthesized cleanly by tools like Yosys.',
          },
          {
            heading: 'Core Concepts',
            body: 'Synthesis-ready RTL emphasizes synchronous logic, explicit resets, and clear timing domains. Understand how clock edges, reset polarity, and state machine encoding affect downstream tools.',
          },
          {
            heading: 'Practical Examples',
            body: 'Review a register bank example, a simple FSM, and a clocked pipeline stage. These examples show how to write code that preserves intent and avoids unexpected optimization behavior.',
            code: `module counter(clk, rst, enable, count);
  input clk, rst, enable;
  output reg [7:0] count;

  always @(posedge clk or posedge rst) begin
    if (rst)
      count <= 0;
    else if (enable)
      count <= count + 1;
  end
endmodule`,
            codeLanguage: 'verilog',
          },
          {
            heading: 'Common Mistakes',
            body: 'Avoid inferred latches, incomplete sensitivity lists, and combinational feedback loops. These issues often lead to synthesis mismatches or unstable timing when the design moves into place and route.',
          },
          {
            heading: 'Best Practices',
            body: 'Keep reset paths simple, use explicit state encodings, and verify your RTL with linting and simulation before synthesis. Well-structured RTL reduces the need for manual ECOs later in the flow.',
          },
        ],
        summary: 'You now understand how to write synthesizable RTL that behaves predictably through synthesis and physical implementation.',
        quiz: [
          {
            question: 'Which RTL pattern is most likely to infer a latch during synthesis?',
            options: [
              'A register with an if-else statement driven by a clock edge.',
              'A combinational block without assignments for all output signals.',
              'A synchronous reset path with explicit assignments.',
            ],
            answerIndex: 1,
            explanation: 'When not all outputs are assigned in a combinational block, synthesis may infer a latch to preserve the previous value.',
          },
        ],
      },
      {
        slug: 'synthesis-with-yosys',
        title: 'Synthesis with Yosys',
        description: 'Learn how to run Yosys for RTL synthesis, technology mapping, and netlist generation for OpenROAD flows.',
        duration: '90 min',
        minutes: 90,
        difficulty: 'Intermediate',
        objectives: [
          'Set up Yosys scripts for the target standard-cell library.',
          'Map RTL to a gate-level netlist and generate SDC constraints.',
          'Interpret synthesis warnings and fix common problems.',
        ],
        prerequisites: ['RTL Design Fundamentals', 'Command-line tool experience'],
        sections: [
          {
            heading: 'Introduction',
            body: 'Yosys is the synthesis engine that converts RTL into netlists usable by placement and routing tools. This module walks through the synthesis flow and how it integrates with OpenROAD.',
          },
          {
            heading: 'Core Concepts',
            body: 'Understand technology mapping, black-box inference, and the role of synthesis constraints. Learn how to preserve hierarchical structure and handle library cells correctly.',
          },
          {
            heading: 'Practical Examples',
            body: 'Build a synthesis script that reads Verilog, runs synth_xilinx or generic synthesis, and writes a gate-level netlist. See how to import liberty models and generate an SDC file for timing.',
            code: 'yosys -p "read_verilog rtl/top.v; synth -top top; write_verilog synth/top_netlist.v"',
            codeLanguage: 'bash',
          },
          {
            heading: 'Common Mistakes',
            body: 'Be careful with missing library cells, unsupported constructs, and wires left unconnected. Yosys warnings about undefined cells or combinational loops should be addressed before proceeding.',
          },
          {
            heading: 'Best Practices',
            body: 'Keep your synthesis script stable, lock down cell library versions, and save intermediate reports for debugging. Always check the generated netlist for the expected cell names and signal connectivity.',
          },
        ],
        summary: 'After this module, you can run Yosys synthesis reliably and prepare netlists for the OpenROAD physical implementation flow.',
        quiz: [
          {
            question: 'What is the primary purpose of technology mapping during synthesis?',
            options: [
              'To produce a timing report for the RTL.',
              'To map RTL operators onto standard cells from the target library.',
              'To generate an SDC file for the floorplanner.',
            ],
            answerIndex: 1,
            explanation: 'Technology mapping translates RTL structures to cells available in the target standard-cell library.',
          },
        ],
      },
      {
        slug: 'floorplanning-basics',
        title: 'Floorplanning Basics',
        description: 'Learn how to define die area, place macros, and reserve routing channels before placement.',
        duration: '70 min',
        minutes: 70,
        difficulty: 'Intermediate',
        objectives: [
          'Establish core area and I/O placement strategy.',
          'Reserve channel space and macro placements for timing.',
          'Validate floorplan topology before placement.',
        ],
        prerequisites: ['Synthesis with Yosys', 'Basic chip architecture knowledge'],
        sections: [
          {
            heading: 'Introduction',
            body: 'Floorplanning sets the physical constraints used by placement and routing. A good floorplan minimizes congestion and preserves timing-critical connectivity between macros and standard-cell regions.',
          },
          {
            heading: 'Core Concepts',
            body: 'Learn about core offsets, power rings, fences, and the tradeoff between area utilization and routeability. Floorplan quality directly affects the ease of later stages.',
          },
          {
            heading: 'Practical Examples',
            body: 'Use an example Tcl script to define die size, place fixed memory macros, and create routing blockages. These steps show how to guide the place-and-route engine efficiently.',
            code: `floorplan -die_area 0 0 1000 1000
place_macro ram0 -x 100 -y 100
create_fence -rect 300 300 700 700`,
            codeLanguage: 'tcl',
          },
          {
            heading: 'Common Mistakes',
            body: 'Avoid over-constraining the floorplan, placing macros too tightly together, or leaving insufficient channels for critical nets. These errors often lead to placement failure or excessive congestion.',
          },
          {
            heading: 'Best Practices',
            body: 'Review power and clock root placement early, keep key nets short, and validate that reserved channel space is sufficient for expected routing demand.',
          },
        ],
        summary: 'You now know how to create a robust floorplan that supports successful placement and routing.',
        quiz: [
          {
            question: 'Why is it important to reserve routing channels during floorplanning?',
            options: [
              'To reduce the number of standard cells used.',
              'To ensure space is available for critical nets and avoid congestion.',
              'To increase the design clock frequency automatically.',
            ],
            answerIndex: 1,
            explanation: 'Reserved routing channels provide the physical space needed for nets to connect without excessive congestion.',
          },
        ],
      },
      {
        slug: 'placement-and-cts',
        title: 'Placement and CTS',
        description: 'Understand how to place cells and synthesize the clock tree together to meet timing and routability goals.',
        duration: '85 min',
        minutes: 85,
        difficulty: 'Intermediate',
        objectives: [
          'Run placement and clock tree synthesis in the OpenROAD flow.',
          'Coordinate CTS with clock definitions and placement constraints.',
          'Inspect placement quality, wirelength, and clock skew.'
        ],
        prerequisites: ['Floorplanning Basics', 'Understanding SDC'],
        sections: [
          {
            heading: 'Introduction',
            body: 'Placement and clock tree synthesis are linked because placement affects clock latency and CTS affects hold/setup timing. This module covers how to integrate both stages effectively.',
          },
          {
            heading: 'Core Concepts',
            body: 'Review how placement density, cell distribution, and clock root location influence CTS. Learn about clock net definition, root buffer selection, and timing budget tradeoffs.',
          },
          {
            heading: 'Practical Examples',
            body: 'Follow a sample OpenROAD script that runs placement followed by TritonCTS. Observe the reports produced for clock skew, buffer count, and placement legality.',
          },
          {
            heading: 'Common Mistakes',
            body: 'The most frequent issues are mismatched clock names in SDC, insufficient hold margin, and placement hotspots that cause CTS to fail or insert too many buffers.',
          },
          {
            heading: 'Best Practices',
            body: 'Use a clean SDC, keep clock trees simple, and verify placement before CTS. Analyze CTS reports and update placement or constraints iteratively when necessary.',
          },
        ],
        summary: 'After this lesson, you understand how placement and CTS work together and how to verify their outputs.',
        quiz: [
          {
            question: 'What is a common cause of CTS failure after placement?',
            options: [
              'Insufficient power rails.',
              'Incorrect or missing clock definitions in the SDC.',
              'Excessive use of combinational logic.',
            ],
            answerIndex: 1,
            explanation: 'CTS requires accurate clock definitions in the SDC; missing or wrong clocks often cause the stage to fail.',
          },
        ],
      },
      {
        slug: 'routing-and-signoff',
        title: 'Routing and Signoff',
        description: 'Complete the flow by routing the design, checking DRC, and validating timing for signoff.',
        duration: '100 min',
        minutes: 100,
        difficulty: 'Intermediate',
        objectives: [
          'Run routing and perform final DRC checks.',
          'Execute static timing analysis to confirm closure.',
          'Understand the handoff criteria for signoff quality.',
        ],
        prerequisites: ['Placement and CTS', 'OpenROAD basics'],
        sections: [
          {
            heading: 'Introduction',
            body: 'Routing connects the placed cells and completes the physical implementation. This module teaches how to inspect routing results and validate the final design before tapeout.',
          },
          {
            heading: 'Core Concepts',
            body: 'Learn the difference between global and detailed routing, the importance of congestion avoidance, and DRC adherence for manufacturability.',
          },
          {
            heading: 'Practical Examples',
            body: 'Walk through a routing session and analyze the resulting DRC report. Use STA to identify critical paths and confirm that the routed design meets timing targets.',
          },
          {
            heading: 'Common Mistakes',
            body: 'Routing failures are often caused by over-constrained placement, insufficient track reservation, or unaddressed DRC violations from earlier stages.',
          },
          {
            heading: 'Best Practices',
            body: 'Validate the design at every stage, keep routing margins, and retime or buffer networks only after routing is stable and timing analyses agree.',
          },
        ],
        summary: 'You now know how to complete routing and signoff, including the key checks that ensure physical design correctness.',
        quiz: [
          {
            question: 'Why is it important to run DRC after routing?',
            options: [
              'To verify the design meets manufacturability rules for the target process.',
              'To calculate the final power consumption of the chip.',
              'To generate the synthesis netlist for verification.',
            ],
            answerIndex: 0,
            explanation: 'DRC ensures the routed layout follows the process rules required for manufacturing.',
          },
        ],
      },
    ],
  },
  {
    slug: 'timing-closure-mastery',
    title: 'Timing Closure Mastery',
    description: 'Systematic approach to identifying and fixing setup, hold, and clock timing violations.',
    level: 'Advanced',
    duration: '9h',
    recommended: false,
    modules: [
      {
        slug: 'timing-analysis-fundamentals',
        title: 'Timing Analysis Fundamentals',
        description: 'Learn the core principles of static timing analysis and the metrics used to evaluate design timing.',
        duration: '80 min',
        minutes: 80,
        difficulty: 'Advanced',
        objectives: [
          'Understand setup, hold, and path delay terminology.',
          'Identify common timing analysis reports and their meaning.',
          'Map timing constraints to design behavior.',
        ],
        prerequisites: ['Synthesis fundamentals', 'Basic digital timing knowledge'],
        sections: [
          {
            heading: 'Introduction',
            body: 'Static timing analysis is the primary method for verifying that a design meets its frequency targets. This module introduces timing terminology and how STA models design constraints.',
          },
          {
            heading: 'Core Concepts',
            body: 'Explore setup and hold slack, worst negative slack, path groups, and why generated clocks require explicit constraints. Learn how STA evaluates every path in the design.',
          },
          {
            heading: 'Practical Examples',
            body: 'Review sample timing reports and see how to interpret worst paths, launch/capture pairs, and multi-cycle paths in a typical STA tool output.',
          },
          {
            heading: 'Common Mistakes',
            body: 'A common timing error is using incomplete or inaccurate SDC constraints, which can create false slack numbers and hidden hold failures.',
          },
          {
            heading: 'Best Practices',
            body: 'Keep your timing environment consistent, define all clocks clearly, and use clear path groups to separate different functional domains.',
          },
        ],
        summary: 'You now have a solid foundation in timing analysis and the ability to interpret STA results for design closure.',
        quiz: [
          {
            question: 'What does negative slack indicate in STA?',
            options: [
              'A path is faster than required.',
              'A path fails to meet the timing requirement.',
              'The path is not analyzed because of missing constraints.',
            ],
            answerIndex: 1,
            explanation: 'Negative slack means the path is slower than the constraint target and therefore fails timing.',
          },
        ],
      },
      {
        slug: 'reading-sta-reports',
        title: 'Reading STA Reports',
        description: 'Learn to decode STA report outputs and identify the most critical paths in your design.',
        duration: '65 min',
        minutes: 65,
        difficulty: 'Advanced',
        objectives: [
          'Read timing report summaries and path details.',
          'Locate setup and hold violations in the design.',
          'Correlate timing paths with RTL and physical implementation.',
        ],
        prerequisites: ['Timing Analysis Fundamentals', 'OpenSTA or equivalent background'],
        sections: [
          {
            heading: 'Introduction',
            body: 'Timing reports provide the visibility needed to find closure issues. This module focuses on interpreting the key sections of STA output and translating them into actionable fixes.',
          },
          {
            heading: 'Core Concepts',
            body: 'Understand report metrics like WNS, TNS, path slack, and the importance of path endpoints. Learn how hold report structure differs from setup report structure.',
          },
          {
            heading: 'Practical Examples',
            body: 'Walk through a sample report and highlight the worst path, the startpoint and endpoint, the logic elements involved, and how to identify the root cause.',
          },
          {
            heading: 'Common Mistakes',
            body: 'Avoid assuming the worst path is always the same as the critical path in the design. Missing clock definitions or false paths can produce misleading results.',
          },
          {
            heading: 'Best Practices',
            body: 'Use incremental report filtering, preserve path consistency across runs, and compare path data before and after changes to confirm improvements.',
          },
        ],
        summary: 'You can now interpret STA reports with confidence and find the most important paths to address in timing closure.',
        quiz: [
          {
            question: 'What information does a timing report path endpoint provide?',
            options: [
              'The logic name for the entire design.',
              'The startpoint and endpoint cells or pins used in the path analysis.',
              'The power consumption of the path.',
            ],
            answerIndex: 1,
            explanation: 'Endpoint information shows the start and end points of the analyzed path in the timing report.',
          },
        ],
      },
      {
        slug: 'setup-violation-debugging',
        title: 'Setup Violation Debugging',
        description: 'Diagnose and fix setup timing violations using STA reports and design modifications.',
        duration: '75 min',
        minutes: 75,
        difficulty: 'Advanced',
        objectives: [
          'Identify the most common setup timing root causes.',
          'Apply constraint and implementation fixes to recover setup slack.',
          'Validate fixes with subsequent STA runs.',
        ],
        prerequisites: ['Reading STA Reports', 'Placement and CTS'],
        sections: [
          {
            heading: 'Introduction',
            body: 'Setup violations occur when data arrives too late at the capture register. This module teaches how to find the source of setup failures and how to apply effective corrections.',
          },
          {
            heading: 'Core Concepts',
            body: 'Learn about path delay components, clock latency, and why launch/capture timing relationships matter. Setup debugging often requires examining both logic and clock network behavior.',
          },
          {
            heading: 'Practical Examples',
            body: 'Review a failing setup path and apply fixes such as buffer insertion, retiming, or constraint refinement to improve slack.',
          },
          {
            heading: 'Common Mistakes',
            body: 'Do not assume the worst path can be fixed by a single buffer. Often the correct solution is a combination of placement, buffering, or adjusting clock definitions.',
          },
          {
            heading: 'Best Practices',
            body: 'Use margin-aware changes, keep constraint intent clear, and verify that fixes do not create new hold problems.',
          },
        ],
        summary: 'You can now debug setup issues systematically and validate timing improvements with STA.',
        quiz: [
          {
            question: 'Which of these is a common setup timing fix?',
            options: [
              'Adding a clock gating cell to slow the clock.',
              'Reducing path delay by optimizing logic or relocating cells.',
              'Introducing an asynchronous reset into the path.',
            ],
            answerIndex: 1,
            explanation: 'Reducing path delay or improving placement are common methods for fixing setup timing failures.',
          },
        ],
      },
      {
        slug: 'hold-violation-repair',
        title: 'Hold Violation Repair',
        description: 'Fix hold timing violations by controlling early arrival and balancing clock skew.',
        duration: '70 min',
        minutes: 70,
        difficulty: 'Advanced',
        objectives: [
          'Identify hold problems and their causes.',
          'Apply buffering and delay to increase hold slack.',
          'Avoid introducing setup problems while repairing hold slack.',
        ],
        prerequisites: ['Timing Analysis Fundamentals', 'Placement and CTS'],
        sections: [
          {
            heading: 'Introduction',
            body: 'Hold violations occur when data arrives too early at the capture register. This module explains the root causes and how to repair hold slack without sacrificing setup performance.',
          },
          {
            heading: 'Core Concepts',
            body: 'Understand the role of clock skew, combinational path delay, and transition timing in hold analysis. Hold repairs often involve adding delay or adjusting the clock network.',
          },
          {
            heading: 'Practical Examples',
            body: 'See sample fixes such as adding small buffers in data paths, adjusting clock tree buffers, and using hold-specific delay elements.',
          },
          {
            heading: 'Common Mistakes',
            body: 'Avoid making large buffering changes without verifying setup margin. A successful hold fix should preserve the timing integrity of adjacent paths.',
          },
          {
            heading: 'Best Practices',
            body: 'Use minimal delay adjustments, validate both hold and setup after each change, and keep a repeatable record of fixes.',
          },
        ],
        summary: 'You can now diagnose hold violations and apply targeted repairs that keep the design timing-balanced.',
        quiz: [
          {
            question: 'What is the main risk when fixing a hold violation?',
            options: [
              'Introducing extra power consumption.',
              'Creating a new setup violation by adding delay.',
              'Changing the functional behavior of the design.',
            ],
            answerIndex: 1,
            explanation: 'Adding delay to fix hold violations can create setup timing issues if not done carefully.',
          },
        ],
      },
      {
        slug: 'advanced-timing-optimization',
        title: 'Advanced Timing Optimization',
        description: 'Explore techniques for optimizing critical paths, managing corners, and improving timing margin for signoff.',
        duration: '85 min',
        minutes: 85,
        difficulty: 'Advanced',
        objectives: [
          'Use multi-corner analysis to validate timing.',
          'Apply advanced optimization techniques like buffer insertion and multi-cycle paths.',
          'Balance performance goals with design complexity.',
        ],
        prerequisites: ['Hold Violation Repair', 'Setup Violation Debugging'],
        sections: [
          {
            heading: 'Introduction',
            body: 'Advanced timing optimization is about finding the right combination of changes to keep the design fast across all operating conditions. This module covers multi-corner analysis and optimization strategies.',
          },
          {
            heading: 'Core Concepts',
            body: 'Learn how to evaluate slow and fast corners, use conservative timing margins, and prioritize the most critical paths for optimization.',
          },
          {
            heading: 'Practical Examples',
            body: 'Apply optimization to a hot path, review how changes affect both setup and hold, and compare timing results across multiple corners.',
          },
          {
            heading: 'Common Mistakes',
            body: 'Over-optimizing one path at the expense of the broader design or ignoring corner-specific behavior are common errors.',
          },
          {
            heading: 'Best Practices',
            body: 'Use timing budgets, preserve robust clock definitions, and validate across all signoff corners before locking the design.',
          },
        ],
        summary: 'You are equipped to optimize timing in a realistic flow and understand when to apply advanced fixes safely.',
        quiz: [
          {
            question: 'Why is multi-corner analysis important for timing signoff?',
            options: [
              'It reduces the number of timing reports you need to read.',
              'It verifies timing across different process, voltage, and temperature conditions.',
              'It automatically fixes hold violations.',
            ],
            answerIndex: 1,
            explanation: 'Multi-corner analysis checks timing across the full operating envelope, which is essential for signoff.',
          },
        ],
      },
    ],
  },
  {
    slug: 'sky130-design-fundamentals',
    title: 'Sky130 Design Fundamentals',
    description: 'Complete guide to designing for the SkyWater 130nm process using open-source tools.',
    level: 'Beginner',
    duration: '7h 30m',
    recommended: false,
    modules: [
      {
        slug: 'sky130-pdk-overview',
        title: 'Sky130 PDK Overview',
        description: 'Understand the SkyWater Sky130 process, available libraries, and the design flow expectations for open-source silicon.',
        duration: '60 min',
        minutes: 60,
        difficulty: 'Beginner',
        objectives: [
          'Learn the Sky130 process capabilities and PDK structure.',
          'Know the available standard-cell and IO libraries.',
          'Understand the typical design flow for Sky130 projects.',
        ],
        prerequisites: ['Basic semiconductor concepts'],
        sections: [
          {
            heading: 'Introduction',
            body: 'Sky130 is a widely used open PDK for academic and open-source silicon projects. This module introduces the process, its libraries, and typical design applications.',
          },
          {
            heading: 'Core Concepts',
            body: 'Explore the key features of Sky130, including its layer stack, standard cell families, IO pad structures, and the open-source tooling ecosystem.',
          },
          {
            heading: 'Practical Examples',
            body: 'Review how to access the PDK, inspect standard cells, and identify the correct library files for synthesis and routing.',
          },
          {
            heading: 'Common Mistakes',
            body: 'Avoid using the wrong library models, misinterpreting PDK naming conventions, or skipping the PDK setup validation steps.',
          },
          {
            heading: 'Best Practices',
            body: 'Confirm PDK environment variables, use the correct cell naming, and keep your design files aligned with the Sky130 documentation.',
          },
        ],
        summary: 'You now understand the Sky130 PDK and the design ecosystem required for open-source physical design.',
        quiz: [
          {
            question: 'What is one primary advantage of using the Sky130 PDK?',
            options: [
              'It provides proprietary analog blocks only.',
              'It is an open process design kit available for community silicon projects.',
              'It eliminates the need for timing analysis.',
            ],
            answerIndex: 1,
            explanation: 'Sky130 is an open PDK that enables community-driven design and learning.',
          },
        ],
      },
      {
        slug: 'standard-cell-libraries',
        title: 'Standard Cell Libraries',
        description: 'Learn how standard cells are organized and how to select the correct libraries for synthesis and timing.',
        duration: '70 min',
        minutes: 70,
        difficulty: 'Beginner',
        objectives: [
          'Understand the structure of standard cell libraries.',
          'Select the correct cells for drive strength and timing.',
          'Use library files in synthesis and STA.',
        ],
        prerequisites: ['Sky130 PDK Overview'],
        sections: [
          {
            heading: 'Introduction',
            body: 'Standard cell libraries are the building blocks of synthesized logic. This module explains how library cells are characterized and used by tools throughout the flow.',
          },
          {
            heading: 'Core Concepts',
            body: 'Learn about cell drive strength, pin naming conventions, liberty timing models, and why matching library views is important.',
          },
          {
            heading: 'Practical Examples',
            body: 'Inspect a liberty file, compare cell delays, and choose cells for a simple combinational function based on timing needs.',
          },
          {
            heading: 'Common Mistakes',
            body: 'Using mismatched library corners, incorrect pin names, or the wrong cell height can cause synthesis and STA mismatches.',
          },
          {
            heading: 'Best Practices',
            body: 'Keep library versions consistent, verify pin mapping, and document the cell families used in your flow.',
          },
        ],
        summary: 'You now know how standard cell libraries work and how to use them safely in the Sky130 flow.',
        quiz: [
          {
            question: 'Why is matching the liberty file corner important?',
            options: [
              'It ensures the design uses the correct color scheme.',
              'It provides accurate timing models for the target operating conditions.',
              'It speeds up synthesis by reducing file size.',
            ],
            answerIndex: 1,
            explanation: 'Liberty corners provide timing data for the intended operating conditions, which is essential for accurate STA.',
          },
        ],
      },
      {
        slug: 'design-rules-and-constraints',
        title: 'Design Rules and Constraints',
        description: 'Understand the Sky130 design rules and how constraints interact with the physical implementation flow.',
        duration: '80 min',
        minutes: 80,
        difficulty: 'Beginner',
        objectives: [
          'Learn the key Sky130 DRC and LVS requirements.',
          'Write compatible constraints for physical design tools.',
          'Avoid common rule violations in Sky130 layouts.',
        ],
        prerequisites: ['Sky130 PDK Overview', 'Standard Cell Libraries'],
        sections: [
          {
            heading: 'Introduction',
            body: 'Sky130 design rules ensure manufacturability and correct layout behavior. This module introduces the most important DRC and LVS concepts for open-source design.',
          },
          {
            heading: 'Core Concepts',
            body: 'Explore minimum width, spacing, enclosure, and via rules. Learn how design constraints such as keepouts and layer restrictions affect the layout.',
          },
          {
            heading: 'Practical Examples',
            body: 'Review a Sky130 DRC report, identify a spacing violation, and correlate it with the layout geometry that caused it.',
          },
          {
            heading: 'Common Mistakes',
            body: 'Using incorrect metal layers, missing contact rules, or ignoring well ties are frequent sources of Sky130 violations.',
          },
          {
            heading: 'Best Practices',
            body: 'Follow the official PDK rule deck, validate designs early, and keep your layout floorplan compliant with process restrictions.',
          },
        ],
        summary: 'You can now interpret Sky130 design rules and avoid the most common constraint-related problems.',
        quiz: [
          {
            question: 'What does LVS check in the Sky130 flow?',
            options: [
              'Whether the layout matches the schematic connectivity.',
              'Whether the routing meets timing targets.',
              'Whether the standard cell library is installed.',
            ],
            answerIndex: 0,
            explanation: 'LVS verifies that the physical layout matches the schematic and connectivity.',
          },
        ],
      },
      {
        slug: 'physical-design-flow',
        title: 'Physical Design Flow',
        description: 'Walk through the full physical design flow for Sky130, from synthesis to verification.',
        duration: '90 min',
        minutes: 90,
        difficulty: 'Intermediate',
        objectives: [
          'Understand each physical design stage and its deliverables.',
          'Connect synthesis output to placement, routing, and verification.',
          'Prepare handoffs between tools in the Sky130 flow.',
        ],
        prerequisites: ['Design Rules and Constraints', 'Standard Cell Libraries'],
        sections: [
          {
            heading: 'Introduction',
            body: 'The Sky130 physical design flow connects RTL synthesis, placement, routing, and verification in a reproducible pipeline. This module outlines the stages and what each stage produces.',
          },
          {
            heading: 'Core Concepts',
            body: 'Learn how the netlist, LEF/DEF, SDC, and library views move through the flow and why consistent data is critical.',
          },
          {
            heading: 'Practical Examples',
            body: 'Review the input and output files for a simple Sky130 design and learn how to validate each stage before moving forward.',
          },
          {
            heading: 'Common Mistakes',
            body: 'A common error is using mismatched cell libraries or forgetting to update constraint files between stages.',
          },
          {
            heading: 'Best Practices',
            body: 'Keep the design data organized, version the flow scripts, and validate each handoff with smoke checks.',
          },
        ],
        summary: 'You understand the Sky130 physical design flow and how each stage contributes to a successful tapeout.',
        quiz: [
          {
            question: 'Which file type typically carries placement information between tools?',
            options: [
              '.lib',
              '.sdc',
              '.def',
            ],
            answerIndex: 2,
            explanation: '.def files capture placement and routing blockages for physical tools.',
          },
        ],
      },
      {
        slug: 'tapeout-preparation',
        title: 'Tapeout Preparation',
        description: 'Prepare your Sky130 design for tapeout with final verification, documentation, and quality checks.',
        duration: '80 min',
        minutes: 80,
        difficulty: 'Intermediate',
        objectives: [
          'Perform final DRC/LVS and timing signoff checks.',
          'Prepare manufacturing deliverables for Sky130.',
          'Understand handoff expectations for tapeout submission.',
        ],
        prerequisites: ['Physical Design Flow', 'DRC and LVS knowledge'],
        sections: [
          {
            heading: 'Introduction',
            body: 'Tapeout preparation is the final stage before manufacturing. This module teaches the checks and deliverables required for a Sky130 submission.',
          },
          {
            heading: 'Core Concepts',
            body: 'Review final verification requirements, documentation needs, and the importance of signoff-quality layout.',
          },
          {
            heading: 'Practical Examples',
            body: 'Examine a checklist for final files, including GDS, LVS decks, DRC reports, and timing signoff summaries.',
          },
          {
            heading: 'Common Mistakes',
            body: 'Submitting incomplete verification reports or missing library references can delay tapeout approval.',
          },
          {
            heading: 'Best Practices',
            body: 'Keep an audit trail of final checks, document any design compromises, and verify that all handoff files match the intended process version.',
          },
        ],
        summary: 'You are ready to prepare a Sky130 design for tapeout with the proper verification and documentation workflow.',
        quiz: [
          {
            question: 'Which deliverable is critical for a Sky130 tapeout submission?',
            options: [
              'A handwritten timing review.',
              'A complete GDSII layout and DRC/LVS reports.',
              'A schematic only.',
            ],
            answerIndex: 1,
            explanation: 'Tapeout submission requires the final layout and verification reports, including DRC and LVS.',
          },
        ],
      },
    ],
  },
  {
    slug: 'physical-design-troubleshooting',
    title: 'Physical Design Troubleshooting',
    description: 'Learn to diagnose and fix the most common RTL-to-GDSII implementation failures.',
    level: 'Intermediate',
    duration: '10h',
    recommended: true,
    modules: [
      {
        slug: 'drc-error-analysis',
        title: 'DRC Error Analysis',
        description: 'Diagnose and resolve design rule check failures using Sky130 and OpenROAD outputs.',
        duration: '75 min',
        minutes: 75,
        difficulty: 'Intermediate',
        objectives: [
          'Interpret DRC reports and code descriptions.',
          'Locate physical rule violations in layout.',
          'Apply corrective layout changes efficiently.',
        ],
        prerequisites: ['Sky130 PDK Overview', 'Physical Design Flow'],
        sections: [
          {
            heading: 'Introduction',
            body: 'DRC analysis is essential when the routed design fails manufacturing rules. This module shows how to read DRC outputs and map violations back to layout geometry.',
          },
          {
            heading: 'Core Concepts',
            body: 'Understand the difference between spacing, enclosure, and via rules, and how they appear in DRC reports.',
          },
          {
            heading: 'Practical Examples',
            body: 'Review a sample DRC report and walk through the steps to fix an edge spacing violation and a metal enclosure issue.',
          },
          {
            heading: 'Common Mistakes',
            body: 'Rushing through DRC fixes without retesting or applying broad layout changes can create new violations elsewhere.',
          },
          {
            heading: 'Best Practices',
            body: 'Fix one violation at a time, re-run DRC after each change, and keep a log of the violations you corrected.',
          },
        ],
        summary: 'You can now analyze DRC reports and apply targeted fixes to keep the design manufacturable.',
        quiz: [
          {
            question: 'What type of issue does DRC check?',
            options: [
              'Timing closure at all corners.',
              'Layout rule compliance and manufacturability.',
              'RTL functional correctness.',
            ],
            answerIndex: 1,
            explanation: 'DRC verifies layout rule compliance, not timing or RTL correctness.',
          },
        ],
      },
      {
        slug: 'lvs-debugging',
        title: 'LVS Debugging',
        description: 'Use LVS tools to confirm the layout matches the schematic and fix mismatches effectively.',
        duration: '70 min',
        minutes: 70,
        difficulty: 'Intermediate',
        objectives: [
          'Understand LVS report structure and common failure modes.',
          'Map netlist mismatches to physical layout issues.',
          'Resolve LVS issues without compromising the design.',
        ],
        prerequisites: ['DRC Error Analysis', 'Sky130 Design Fundamentals'],
        sections: [
          {
            heading: 'Introduction',
            body: 'LVS ensures that the physical layout corresponds to the intended circuit. This module shows how to read LVS output and address the most common mismatches.',
          },
          {
            heading: 'Core Concepts',
            body: 'Learn how netlist extraction, device naming, and connectivity checks are used to validate the layout against the schematic.',
          },
          {
            heading: 'Practical Examples',
            body: 'Examine an LVS failure report and trace the mismatch to missing contacts or incorrect routing in the physical design.',
          },
          {
            heading: 'Common Mistakes',
            body: 'Incorrect pin labeling and missing substrate connections are typical LVS issues that can be hard to find without careful report analysis.',
          },
          {
            heading: 'Best Practices',
            body: 'Keep schematic and layout naming consistent, verify extracted netlists early, and fix LVS issues iteratively.',
          },
        ],
        summary: 'You can now debug LVS failures and correct layout-schematic mismatches for a successful verification signoff.',
        quiz: [
          {
            question: 'What does LVS verify?',
            options: [
              'The layout obeys DRC rules.',
              'The layout matches the schematic connectivity.',
              'The design meets target frequency.',
            ],
            answerIndex: 1,
            explanation: 'LVS checks that the layout connectivity matches the schematic.',
          },
        ],
      },
      {
        slug: 'congestion-analysis',
        title: 'Congestion Analysis',
        description: 'Identify and mitigate routing congestion before it causes routing failure or timing degradation.',
        duration: '80 min',
        minutes: 80,
        difficulty: 'Intermediate',
        objectives: [
          'Interpret congestion maps and hot spots.',
          'Apply placement and routing fixes to reduce congestion.',
          'Balance congestion mitigation with timing requirements.',
        ],
        prerequisites: ['Floorplanning Basics', 'Routing and Signoff'],
        sections: [
          {
            heading: 'Introduction',
            body: 'Congestion is a major cause of routing failure. This module teaches how to read congestion metrics and apply practical fixes in the physical design flow.',
          },
          {
            heading: 'Core Concepts',
            body: 'Learn about routing demand, capacity, and how channel load affects the probability of unrouted nets or timing issues.',
          },
          {
            heading: 'Practical Examples',
            body: 'Analyze a congestion map and identify candidate regions for placement spreading, routing blockages, or layer reassignment.',
          },
          {
            heading: 'Common Mistakes',
            body: 'A frequent mistake is treating congestion as a routing-only issue when placement or macro clustering is the underlying cause.',
          },
          {
            heading: 'Best Practices',
            body: 'Use congestion analysis early, preserve routing channels, and tune placement to reduce hotspot demand before routing begins.',
          },
        ],
        summary: 'You can now analyze congestion and apply targeted fixes to keep the design routable.',
        quiz: [
          {
            question: 'What is the best first step when a congestion hotspot is identified?',
            options: [
              'Increase the clock frequency.',
              'Review placement and channel utilization in the hotspot area.',
              'Add more standard cells to the region.',
            ],
            answerIndex: 1,
            explanation: 'Congestion hotspots are best addressed by examining placement and region routing demand.',
          },
        ],
      },
      {
        slug: 'cts-debugging',
        title: 'CTS Debugging',
        description: 'Troubleshoot clock tree synthesis issues and ensure clock networks are balanced and reliable.',
        duration: '75 min',
        minutes: 75,
        difficulty: 'Intermediate',
        objectives: [
          'Identify CTS failure symptoms and root causes.',
          'Use CTS reports to inspect clock tree structure.',
          'Fix clock skew, insertion delay, and connectivity issues.',
        ],
        prerequisites: ['Placement and CTS', 'Timing Analysis Fundamentals'],
        sections: [
          {
            heading: 'Introduction',
            body: 'Clock tree synthesis is critical for reliable timing. This module covers how to debug CTS reports, fix common root cause issues, and preserve clock integrity through the flow.',
          },
          {
            heading: 'Core Concepts',
            body: 'Learn how buffer selection, clock root placement, and net connectivity affect skew and hold performance.',
          },
          {
            heading: 'Practical Examples',
            body: 'Inspect a CTS report, evaluate skew and latency metrics, and apply fixes such as root relocation or buffer library changes.',
          },
          {
            heading: 'Common Mistakes',
            body: 'Common CTS problems include unrecognized clock nets, incorrect buffer libraries, and insufficient hold margin after tree insertion.',
          },
          {
            heading: 'Best Practices',
            body: 'Keep the clock tree simple, verify all clock definitions, and check clock network reports before moving to timing signoff.',
          },
        ],
        summary: 'You can now debug CTS issues and make data-driven adjustments to the clock network.',
        quiz: [
          {
            question: 'Which issue is most likely to appear in a CTS report?',
            options: [
              'Missing standard cell libraries.',
              'Clock skew or buffer insertion failures.',
              'LVS connectivity mismatches.',
            ],
            answerIndex: 1,
            explanation: 'CTS reports commonly show clock skew, latency, or buffer insertion problems.',
          },
        ],
      },
      {
        slug: 'routing-failure-resolution',
        title: 'Routing Failure Resolution',
        description: 'Resolve routing failures with targeted layout and placement changes while preserving timing.',
        duration: '90 min',
        minutes: 90,
        difficulty: 'Intermediate',
        objectives: [
          'Diagnose the root cause of routing failure.',
          'Apply routing and placement solutions to complete the design.',
          'Verify the final routed design with DRC and timing.',
        ],
        prerequisites: ['Congestion Analysis', 'CTS Debugging'],
        sections: [
          {
            heading: 'Introduction',
            body: 'Routing failure can halt the physical flow. This module teaches you how to diagnose the cause and make effective changes so the design can be routed successfully.',
          },
          {
            heading: 'Core Concepts',
            body: 'Understand the relationship between placement density, routing resources, and track availability in the routing engine.',
          },
          {
            heading: 'Practical Examples',
            body: 'Analyze a routing failure report and apply fixes such as spreading cells, adjusting blockages, or changing layer assignments.',
          },
          {
            heading: 'Common Mistakes',
            body: 'Avoid simply lowering density without addressing the actual congestion region; this can lead to new problems in adjacent areas.',
          },
          {
            heading: 'Best Practices',
            body: 'Use targeted fixes, re-run routing after each change, and verify that the final design meets both DRC and timing requirements.',
          },
        ],
        summary: 'You now know how to resolve routing failures while preserving design intent and timing goals.',
        quiz: [
          {
            question: 'What is a common fix for routing failure caused by congestion?',
            options: [
              'Remove all clock constraints.',
              'Spread placement and add routing blockages where needed.',
              'Increase the design operating frequency.',
            ],
            answerIndex: 1,
            explanation: 'Spreading placement and adjusting routing resources helps relieve congestion.',
          },
        ],
      },
    ],
  },
];

function isProgressState(value: unknown): value is LearningProgressState {
  return (
    typeof value === 'object' && value !== null &&
    'activeLearningPath' in value &&
    'lastVisitedModule' in value &&
    'completedModules' in value &&
    'totalLearningTimeMinutes' in value &&
    'lastViewedSectionByModule' in value
  );
}

export function makeModuleKey(pathSlug: string, moduleSlug: string) {
  return `${pathSlug}/${moduleSlug}`;
}

export function getPathBySlug(pathSlug: string) {
  return learningPaths.find(path => path.slug === pathSlug);
}

export function getModuleBySlug(pathSlug: string, moduleSlug: string) {
  const path = getPathBySlug(pathSlug);
  return path?.modules.find(module => module.slug === moduleSlug);
}

export function loadLearningProgress(): LearningProgressState {
  if (typeof window === 'undefined') {
    return {
      activeLearningPath: learningPaths[0].slug,
      lastVisitedModule: `${learningPaths[0].slug}/${learningPaths[0].modules[0].slug}`,
      completedModules: [],
      totalLearningTimeMinutes: 0,
      lastViewedSectionByModule: {},
    };
  }

  try {
    const raw = window.localStorage.getItem(progressStorageKey);
    if (!raw) throw new Error('no progress');
    const parsed = JSON.parse(raw);
    if (!isProgressState(parsed)) throw new Error('invalid progress');
    return parsed;
  } catch {
    const defaultPath = learningPaths[0];
    return {
      activeLearningPath: defaultPath.slug,
      lastVisitedModule: `${defaultPath.slug}/${defaultPath.modules[0].slug}`,
      completedModules: [],
      totalLearningTimeMinutes: 0,
      lastViewedSectionByModule: {},
    };
  }
}

export function saveLearningProgress(progress: LearningProgressState) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(progressStorageKey, JSON.stringify(progress));
}

export function getNextUnfinishedModule(path: LearningPath, progress: LearningProgressState) {
  return path.modules.find((module, index) => {
    const key = makeModuleKey(path.slug, module.slug);
    if (progress.completedModules.includes(key)) return false;
    if (index === 0) return true;
    const previousKey = makeModuleKey(path.slug, path.modules[index - 1].slug);
    return progress.completedModules.includes(previousKey);
  });
}

export function getPathProgress(path: LearningPath, progress: LearningProgressState) {
  const completed = path.modules.filter(module => progress.completedModules.includes(makeModuleKey(path.slug, module.slug))).length;
  return path.modules.length === 0 ? 0 : Math.round((completed / path.modules.length) * 100);
}

export function getModuleStatus(path: LearningPath, moduleSlug: string, progress: LearningProgressState) {
  const moduleIndex = path.modules.findIndex(module => module.slug === moduleSlug);
  if (moduleIndex === -1) return 'Locked';
  const key = makeModuleKey(path.slug, moduleSlug);
  if (progress.completedModules.includes(key)) return 'Completed';
  if (moduleIndex === 0) return 'In Progress';
  const previousKey = makeModuleKey(path.slug, path.modules[moduleIndex - 1].slug);
  return progress.completedModules.includes(previousKey) ? 'In Progress' : 'Locked';
}
