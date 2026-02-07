# Intel Dashboard

This dashboard provides a centralized overview of all intelligence gathered across all operations.

---

## Latest Intelligence (Last 7 Days)
*A list of the most recently added intelligence files.*

```dataview
TABLE
    file.cday as "Date Added",
    op_name as "Operation",
    file.link as "File"
FROM "Operations"
WHERE file.folder.path.contains("Intel") AND file.cday >= date("now") - dur(7 days)
SORT file.cday DESC
```

---

## Intelligence by Operation
*All intelligence files, grouped by the operation they are associated with.*

```dataview
LIST rows.file.link
FROM "Operations"
WHERE file.folder.path.contains("Intel")
GROUP BY op_name
SORT op_name ASC
```

---

## Persons of Interest (POI)
*A list of all profiled individuals.*

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

## Intel by Type
*Intelligence categorized by its source.*

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

---

## Uncategorized Intelligence
*Intelligence files that have not yet been categorized.*

```dataview
LIST
FROM "Operations"
WHERE file.folder.path.contains("Intel")
    AND !contains(file.path, "SIGINT")
    AND !contains(file.path, "HUMINT")
    AND !contains(file.path, "IMINT")
    AND !contains(file.path, "Case Files")
    AND file.name != "Intel Pack.md"
```
