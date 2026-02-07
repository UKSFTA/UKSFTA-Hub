# [RESTRICTED] SAS TRAINING & DOCTRINE DASHBOARD

This dashboard serves as the central hub for the Special Air Service (SAS). It tracks candidate progression from Selection through to Troop attachment.

-

## QUICK LINKS

- [**SAS Training Curriculum**](Curriculum/Curriculum.md)
- [**Assessments & Evaluations**](Assessments/Assessments-Dashboard.md)
- [**Technical Standards (SOPs)**](Reference/Technical-Standards.md)
- [**Operational Templates**](Templates/Templates-Dashboard.md)

-

## TRAINING PIPELINE

### PHASE 1: SELECTION (THE HILLS)
Focuses on physical endurance, navigational proficiency, and mental resilience.
- [ ] [Initial Candidate Evaluation (ICE)](Assessments/SAS-ICE.md)
- [ ] Aptitude Phase (Navigation & Endurance)
- [ ] Standard Operating Procedures (SOP) Review

### PHASE 2: CONTINUATION TRAINING
Candidates learn the fundamental tactical and technical skills of the SAS Trooper.
- **Tactical Combat:** Advanced CQB, contact drills, and patrol skills.
- **Demolitions:** Breach techniques and sabotage.
- **Advanced Communications:** ACRE/TFAR mastery in contested environments.
- **Medical:** Combat Medical Technician (CMT) standards.

### PHASE 3: TROOP SPECIALIZATION
Troopers are assigned to specific troops based on operational aptitude:
- **Air Troop:** HALO/HAHO and high-altitude operations.
- **Boat Troop:** Diving, surface swimming, and maritime insertion.
- **Mountain Troop:** High-angle climbing and cold-weather operations.
- **Mobility Troop:** Vehicle-mounted tactics and heavy weapons employment.

-

## ACTIVE TRAINING RECORDS

```dataview
TABLE status as "Status", phase as "Current Phase"
FROM "Units/SAS/Training/Assessments/Results"
WHERE file.name != "Assessments-Dashboard"
```

-

## REFERENCE & DOCTRINE
- [UK Military Ranks](../../Documentation/UK-Military-Ranks.md)
- [UKSF Progression](../../Training/UKSF%20Progression.pdf)

-
**"Who Dares Wins"**
