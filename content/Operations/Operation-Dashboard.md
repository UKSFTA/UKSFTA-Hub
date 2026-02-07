# [RESTRICTED] TASK FORCE OPERATION DASHBOARD

This dashboard provides the command-level overview of all active, planned, and historic operations for the Task Force.

-

```dataviewjs
// Dynamic Mission Status Board
let operations = dv.pages('"Operations"')
    .where(p => p.file.name.startsWith("Op-")) // Filter for operation folders/notes (CONOPs)
    .sort(p => p.op-num, "desc");

// Define custom statuses to make it easier to group
const getMissionPhase = (status) => {
    if (status === "Draft" || status === "Planning") return "Planning";
    if (status === "Executing" || status === "In Progress") return "Execution";
    if (status === "Post-Op" || status === "Review") return "Post-Op";
    if (status === "Completed") return "Completed";
    return "Unknown";
};

// Group operations by defined phases
let phases = {};
operations.forEach(op => {
    const phase = getMissionPhase(op.status);
    if (!phases[phase]) phases[phase] = [];
    phases[phase].push(op);
});

// Prepare data for table
let tableData = [];
for (const phaseName in phases) {
    const phaseOps = phases[phaseName];
    tableData.push([
        `**${phaseName}**`,
        phaseOps.length,
        phaseOps.map(p => p.file.link)
    ]);
}

// Render the board
dv.header(3, "Mission Status Overview");

dv.table(
    ["Phase", "Count", "Missions"],
    tableData
);
```

-

## ACTIVE OPERATIONS
*Ongoing operational deployments.*

```dataview
LIST
FROM "Operations"
WHERE status = "Executing" OR status = "In Progress"
```

-

## MISSION PLANNING (CONOPs)
*All Concept of Operations documents, sorted by approval status.*

### APPROVED / READY
```dataview
TABLE op-name AS "Operation Name", op-num AS "Op No.", status AS "Status"
FROM "Operations"
WHERE type = "CONOP" AND (status = "Approved" OR status = "Planning")
SORT op-num ASC
```

### DRAFT / IN-DEVELOPMENT
```dataview
TABLE op-name AS "Operation Name", op-num AS "Op No.", status AS "Status"
FROM "Operations"
WHERE type = "CONOP" AND status = "Draft"
SORT op-num ASC
```

-

## AFTER ACTION REPORTS (AARs)
*Standardized post-operational analysis.*

```dataview
LIST
FROM "Operations"
WHERE type = "AAR"
SORT file.mtime DESC
LIMIT 10
```

-
> [!NOTE] Documentation
> For detailed instructions on the operational cycle, refer to the [[Documentation/Operations-Dashboard-Guide|Operations-Dashboard-Guide]].

**"Everywhere, Unseen"**
