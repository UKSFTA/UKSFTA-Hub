# [RESTRICTED] OPERATIONS DASHBOARD GUIDE

This guide defines the protocols for the operational management system and the lifecycle of a Concept of Operations (CONOP).

---

## OPERATIONAL LIFECYCLE

1.  **Operation Initialization:**
    *   Create a dedicated directory in `Operations/` using the format `Op-YYYY-MM-DD-Name`.
    *   Initialize the following sub-directories: `Intel/`, `Planning/`, `Execution/`, `Post-Op/`, and `Resources/`.
    *   Further categorize `Resources/` into `Intel/`, `Documents/`, and `Briefings/`.

2.  **CONOP Development:**
    *   Initialize a new CONOP using the `CONOP-Template.md`.
    *   Deploy the file into the operation's `Planning/` directory.
    *   Maintain accurate metadata:
        *   `type`: "CONOP"
        *   `status`: "Draft" (Advance to "Approved" post-briefing).
        *   `op_num`: Chronological identifier.

3.  **Intelligence & Exploitation:**
    *   All acquired field intelligence must be deployed into the `Intel/` sub-directories, categorized by discipline (SIGINT, HUMINT, IMINT, DOCEX).
    *   Identify and document Persons of Interest (POI) within the `Intel/Persons_of_Interest/` directory.

---

## DASHBOARD SYNCHRONIZATION
The [[Operations/Operation-Dashboard|Operations-Dashboard]] utilizes Dataview to aggregate all operational data. Accuracy in file metadata is critical for real-time command oversight.

---
**"Everywhere, Unseen"**
