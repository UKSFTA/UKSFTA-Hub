# Operations Dashboard

```dataviewjs
// Dynamic Mission Status Board
let operations = dv.pages('"Operations"')
    .where(p => p.file.name.startsWith("Op-")) // Filter for operation folders/notes (CONOPs)
    .sort(p => p.op_num, "desc");

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

// You can add more advanced logic here, e.g., highlighting based on dates
// For example, to find operations with 'Executing' status that have a specific deadline soon
/*
let criticalExecution = operations
    .filter(p => getMissionPhase(p.status) === "Execution" && p.end_date)
    .filter(p => dv.date(p.end_date).diff(dv.date('now'), 'days') <= 7 && dv.date(p.end_date).diff(dv.date('now'), 'days') >= 0);

if (criticalExecution.length > 0) {
    dv.header(4, "‼️ Critical Missions (Deadline Soon)");
    dv.list(criticalExecution.map(p => p.file.link + ` (Due: ${p.end_date})`));
}
*/
```

---

## Active Operations
*List of all ongoing operations.*

```dataview
LIST
FROM "Operations"
WHERE file.folder = "Operations"
```

---

## Mission Planning (CONOPs)
*All operation plans, separated by status.*

### Drafts
```dataview
TABLE op_name, op_num, status
FROM "Operations"
WHERE type = "CONOP" AND status = "Draft"
SORT op_num ASC
```

### Approved
```dataview
TABLE op_name, op_num, status
FROM "Operations"
WHERE type = "CONOP" AND status = "Approved"
SORT op_num ASC
```

---

## After Action Reports (AARs)
*Recently completed AARs.*

```dataview
LIST
FROM "Operations"
WHERE type = "AAR"
SORT file.mtime DESC
LIMIT 10
```

---
> [!NOTE] Documentation
> For instructions on how to use this dashboard, see the [[Documentation/Operations-Dashboard-Guide|Operations Dashboard Guide]].
