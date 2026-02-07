# UKSF Taskforce Alpha Hub

> [!quote] Message of the Day
> *Welcome to the UKSF Taskforce Alpha vault. All systems are operational. Operations conducted weekly.*

---

## Mission Control
*Central dashboards for managing all aspects of the Task Force.*

-   **[[Dashboards|All-Dashboards]]**: A centralized list of all dashboards.
-   **[[Operations/Operation-Dashboard|Operations-Dashboard]]**: Track and manage all ongoing and planned operations.
-   **[[Training/Training-Dashboard|Training-Dashboard]]**: Monitor the progression of all candidates and active personnel.
-   **[[Lessons-Learned/Lessons-Learned-Dashboard|Lessons-Learned-Dashboard]]**: Document and analyze insights from operations.
-   **[[Intel-Dashboard|Intel-Dashboard]]**: Centralized overview of all intelligence.

---

## Key Command Staff
*Overview of key leadership personnel.*

```dataview
TABLE
    rank,
    full_name,
    current_unit,
    rank_order
FROM "Personnel/Roster"
WHERE contains(current_unit, "HQ") OR current_unit = "Intelligence Cell" OR current_unit = "Med Det HQ"
SORT rank_order ASC
```

---

## Ongoing Operations Summary
*A summary of all currently active operations.*

```dataview
TABLE
    op_name AS "Operation Name",
    status AS "Status",
    (end_date - date("now")).days AS "Days Remaining"
FROM "Operations"
WHERE type = "CONOP" AND (status = "Executing" OR status = "In Progress")
SORT (end_date - date("now")).days ASC
```

---

## Resources & Documentation

-   **[[ORBAT|Order-of-Battle-(ORBAT)]]**: View the hierarchical structure and key personnel of the task force.
-   **[[Documentation/Operations-Dashboard-Guide|Documentation]]**: Guides and documentation for using this system.
-   **[[Templates/AAR-Template|Templates]]**: All available templates.

---

## Recent Activity
*This section can be customized with Dataview queries to show recent changes.*

```dataview
TABLE file.mtime as "Last Modified"
FROM ""
WHERE file.name != this.file.name
SORT file.mtime DESC
LIMIT 10
```