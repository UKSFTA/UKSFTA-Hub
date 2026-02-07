# Lessons Learned Dashboard

This dashboard provides an overview of documented lessons from operations and training.

-

## All Lessons Learned
*Browse all documented lessons, sortable and filterable.*

```dataview
TABLE
    date,
    op-name as "Operation",
    category,
    severity,
    status
FROM "Lessons Learned"
WHERE type = "Lesson Learned"
SORT date DESC
```

-

## Lessons by Category
*Overview of lessons grouped by their category.*

```dataview
TABLE WITHOUT ID
    category,
    length(rows) as "Total Lessons"
FROM "Lessons Learned"
WHERE type = "Lesson Learned"
GROUP BY category
SORT category ASC
```

-

## Lessons by Severity
*Overview of lessons grouped by their severity level.*

```dataview
TABLE WITHOUT ID
    severity,
    length(rows) as "Total Lessons"
FROM "Lessons Learned"
WHERE type = "Lesson Learned"
GROUP BY severity
SORT severity DESC
```

-

## Open Lessons
*Lessons that are currently open and require follow-up.*

```dataview
TABLE
    date,
    op-name as "Operation",
    category,
    severity
FROM "Lessons Learned"
WHERE type = "Lesson Learned" AND status = "Open"
SORT date ASC
```

-

## How to use this system

1.  **Create a new Lesson Learned:**
    *   Use the `Lessons Learned-Template.md` to create new lesson entries in this folder.
    *   Fill in the metadata and follow the structured prompts.

2.  **Update Lesson Status:**
    *   To update the status of a lesson, simply edit the `status:` field in its markdown file.

3.  **View Lessons Overview:**
    *   This dashboard will automatically update as you create and modify your lesson learned files.
