# [RESTRICTED] SBS TRAINING & DOCTRINE DASHBOARD

This dashboard serves as the central hub for the Special Boat Service (SBS). It focuses on maritime special operations and amphibious warfare.

-

## QUICK LINKS

- [[Curriculum/Curriculum|**SBS Training Curriculum**]]
- [[Assessments/Assessments-Dashboard|**Assessments & Evaluations**]]
- [[Reference/Technical-Standards|**Technical Standards (Maritime)**]]
- [[Templates/Templates-Dashboard|**Operational Templates**]]

-

## TRAINING PIPELINE

### PHASE 1: SELECTION
Joint selection phase with the SAS, focusing on physical endurance and maritime aptitude.
- [ ] [[Assessments/SBS-ICE|Initial Candidate Evaluation (ICE)]]
- [ ] Swimmer Canoeist (SC) Aptitude
- [ ] Navigation & Endurance Phase

### PHASE 2: MARITIME SKILLS
Specialized technical training for the maritime environment.
- **Amphibious Infiltration:** Tactical kayaking (Klepper), RHIB, and sub-surface insertion.
- **Combat Diving:** Rebreathers and sub-surface navigation.
- **Ship Boarding (VBSS):** Visit, Board, Search, and Seizure (VBSS) and maritime CQB.
- **Survival:** Coastal survival and SERE.

### PHASE 3: SPECIALIST QUALIFICATIONS
Troopers specialize based on operational requirements:
- **Maritime Sniper:** Precision marksmanship from dynamic maritime/aerial platforms.
- **Advanced Demolitions:** Underwater sabotage and maritime obstacle clearance.
- **Communications:** Maritime-specific communications and satellite data links.

-

## ACTIVE TRAINING RECORDS

```dataview
TABLE status as "Status", phase as "Current Phase"
FROM "Units/SBS/Training/Assessments/Results"
WHERE file.name != "Assessments-Dashboard"
```

-

## REFERENCE & DOCTRINE
- [[../../Documentation/UK-Military-Ranks|UK Military Ranks]]
- [UKSF Progression](../../Training/UKSF%20Progression.pdf)

-
**"By Strength and Guile"**
