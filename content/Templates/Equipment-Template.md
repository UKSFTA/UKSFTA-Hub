type: "Equipment"
name: ""
category: ""
status: "Available"
serial-number: ""
assigned-to: "None"
location: ""
last-maintenance: ""
next-maintenance: ""
notes: ""
tags: [equipment]
-

# <% tp.frontmatter.name %>

## Details
-   **Category:** <% tp.frontmatter.category %>
-   **Status:** <% tp.frontmatter.status %>
-   **Serial Number:** <% tp.frontmatter.serial-number %>
-   **Assigned To:** <% tp.frontmatter.assigned-to %>
-   **Location:** <% tp.frontmatter.location %>

## Maintenance Log
-   **Last Maintenance:** <% tp.frontmatter.last-maintenance %>
-   **Next Scheduled Maintenance:** <% tp.frontmatter.next-maintenance %>

## Notes
<% tp.frontmatter.notes %>

-
