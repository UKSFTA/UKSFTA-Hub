# UKSF Taskforce Alpha - Data Repository

This repository acts as the **Single Source of Truth (SSOT)** for the UKSF Taskforce Alpha community. It serves as the backend database for:
- **UKSFTA-Bot** (Discord Community Manager)
- **UKSFTA-Site** (Public/Private Web Portal)

## 📂 Data Structure

### Personnel (`/Personnel/Roster/*.md`)
Personnel data is stored as Markdown files with YAML Frontmatter.
**Key Fields for Bot Parsing:**
- `full_name`: Display name.
- `rank`: Used for Discord Role sync.
- `unit`: Used for Unit Role sync (SAS, SBS, SRR, RSIS).
- `status`: Active, LOA, Retired.
- `phase`: Training phase (Selection, Phase 2, Active).

### Operations (`/Operations/**/*.md`)
Mission data and intelligence.
- `status`: Planned, Active, Completed.
- `type`: CONOP, Training, Patrol.

### ORBAT (`/Resources/Orbat/`)
Organizational structure data.

## 🤖 Integration Guide

### For the Bot
1. **Pull** latest changes.
2. **Parse** `Personnel/Roster` directory.
3. **Map** `rank` and `unit` fields to Discord Role IDs.
4. **Sync** roles based on file existence and metadata.

### For the Website
1. **Pull** latest changes.
2. **Render** `Operations/*.md` as blog posts/mission reports.
3. **Build** the ORBAT page dynamically from `Personnel` metadata.
