# [RESTRICTED] SBS TRAINING & DOCTRINE DASHBOARD

This dashboard serves as the central hub for the Special Boat Service (SBS). It focuses on maritime special operations and amphibious warfare.

---

## QUICK LINKS

- [**SBS Training Curriculum**](Curriculum/Curriculum.md)
- [**Assessments & Evaluations**](Assessments/Assessments-Dashboard.md)
- [**Technical Standards (Maritime)**](Reference/Technical-Standards.md)
- [**Operational Templates**](Templates/Templates-Dashboard.md)

---

## TRAINING PIPELINE

### PHASE 1: SELECTION
Joint selection phase with the SAS, focusing on physical endurance and maritime aptitude.
- [ ] [Initial Candidate Evaluation (ICE)](Assessments/SBS-ICE.md)
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

---

## ACTIVE TRAINING RECORDS

```dataview
TABLE status as "Status", phase as "Current Phase"
FROM "Units/SBS/Training/Assessments/Results"
WHERE file.name != "Assessments-Dashboard"
```

---

## REFERENCE & DOCTRINE
- [UK Military Ranks](../../Documentation/UK-Military-Ranks.md)
- [UKSF Progression](../../Training/UKSF%20Progression.pdf)

---
**"By Strength and Guile"**
