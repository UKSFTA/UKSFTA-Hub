# [RESTRICTED] TASK FORCE INTEL DASHBOARD

This dashboard provides a centralized overview of all intelligence collected, processed, and exploited across all operational theatres.

---

## LATEST INTELLIGENCE (LAST 7 DAYS)
*Recently acquired intelligence reports.*

```dataview
TABLE
    file.cday as "Date Added",
    op_name as "Operation",
    file.link as "File"
FROM "Operations"
WHERE (contains(file.path, "Intel") OR contains(file.path, "DOCEX") OR contains(file.path, "SIGINT") OR contains(file.path, "HUMINT")) 
    AND file.cday >= date("now") - dur(7 days)
    AND file.name != "Intel Pack"
SORT file.cday DESC
```

---

## INTELLIGENCE BY OPERATION
*Intelligence grouping by theatre of operations.*

```dataview
LIST rows.file.link
FROM "Operations"
WHERE contains(file.path, "Intel") OR contains(file.path, "DOCEX") OR contains(file.path, "SIGINT") OR contains(file.path, "HUMINT")
GROUP BY op_name
SORT op_name ASC
```

---

## PERSONS OF INTEREST (POI)
*Individual profiles and network mapping data.*

```dataview
TABLE
    Status,
    Location,
    Affiliation,
    Description
FROM "Operations"
WHERE contains(file.path, "Persons_of_Interest")
```

---

## INTELLIGENCE BY DISCIPLINE

### SIGINT (Signals Intelligence)
```dataview
LIST
FROM "Operations"
WHERE contains(file.path, "SIGINT")
```

### HUMINT (Human Intelligence)
```dataview
LIST
FROM "Operations"
WHERE contains(file.path, "HUMINT")
```

### IMINT (Imagery Intelligence)
```dataview
LIST
FROM "Operations"
WHERE contains(file.path, "IMINT")
```

### DOCEX (Document Exploitation)
```dataview
LIST
FROM "Operations"
WHERE contains(file.path, "DOCEX") OR contains(file.path, "Documents")
```

---

## UNCATEGORISED / PENDING TRIAGE
*Raw intelligence awaiting discipline classification.*

```dataview
LIST
FROM "Operations"
WHERE contains(file.path, "Intel")
    AND !contains(file.path, "SIGINT")
    AND !contains(file.path, "HUMINT")
    AND !contains(file.path, "IMINT")
    AND !contains(file.path, "DOCEX")
    AND !contains(file.path, "Case Files")
    AND !contains(file.path, "Persons_of_Interest")
    AND file.name != "Intel Pack"
    AND file.name != "Intel Dashboard"
```

---
**"Knowledge is Lethality"**
