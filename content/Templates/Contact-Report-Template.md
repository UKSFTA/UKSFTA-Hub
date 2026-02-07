type: "Contact Report"
op_name: ""
op_num: ""
date: <% tp.date.now("YYYY-MM-DD") %>
time: <% tp.date.now("HH:mm") %>
location: ""
---

# Contact Report - <% tp.date.now("YYYY-MM-DD HH:mm") %>

**Operation:** [[<%-tp.file.cursor(1)-%>]]
**Date/Time of Contact:** <% tp.date.now("DD/MM/YYYY HH:mm") %>
**Location of Contact:** <% tp.file.cursor(2) %> (Grid Reference or Description)
**Reporting Unit:** <% tp.file.cursor(3) %>

---

## SNAP Report

-   **S - Size:** <% tp.file.cursor(4) %> (e.g., Squad, Platoon, Fireteam, Individual)
-   **N - Numbers:** <% tp.file.cursor(5) %> (e.g., 8-10 personnel)
-   **A - Activity:** <% tp.file.cursor(6) %> (e.g., Patrolling, Fortifying, Ambush, Moving)
-   **P - Position:** <% tp.file.cursor(7) %> (Grid reference and description of enemy position/direction of travel)

---

## Further Details

-   **Enemy Unit/Personnel:** <% tp.file.cursor(8) %> (Identification, uniform, equipment, suspected allegiance)
-   **Actions Taken:** <% tp.file.cursor(9) %> (e.g., "Returned fire", "Observed and reported", "Disengaged")
-   **Own Casualties:** <% tp.file.cursor(10) %> (KIA/WIA - Friendly)
-   **Enemy Casualties:** <% tp.file.cursor(11) %> (KIA/WIA/Captured - Enemy)
-   **Own Location After Contact:** <% tp.file.cursor(12) %> (Grid reference or description)

---

## Remarks
<% tp.file.cursor(13) %>
*Any other relevant information, follow-up actions, or intelligence requirements.*
