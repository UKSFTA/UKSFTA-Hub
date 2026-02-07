# [RESTRICTED] RSIS TRAINING & DOCTRINE DASHBOARD

This dashboard serves as the central hub for the Royal Secret Intelligence Service (RSIS) - Tactical Intelligence & Exploitation (TIE) cell.

---

## QUICK LINKS

- [**RSIS Training Curriculum**](Curriculum/Curriculum.md)
- [**Assessments & Evaluations**](Assessments/Assessments-Dashboard.md)
- [**Technical Standards (SIGINT/SSE)**](Reference/Technical-Standards.md)
- [**Operational Templates**](Templates/Templates-Dashboard.md)

---

## TRAINING PIPELINE

### PHASE 1: SELECTION & INITIAL EVALUATION (ICE)
The **RSIS ICE** focuses on analytical reasoning, information processing, and technical aptitude.
- [ ] [ICE Theory Assessment](Assessments/RSIS-ICE.md)
- [ ] Technical Aptitude Test (Spectrum Analysis)
- [ ] Interview: "The TIE Mandate"

### PHASE 2: CORE SKILLS (THE "GREY COURSE")
Candidates learn the tradecraft and methodologies of the Tactical Intelligence Operator.
- **SIGINT / EW:** Spectrum monitoring, Direction Finding (DF), and electronic order of battle management.
- **Tactical Questioning (TQ):** ACE-3 Interaction, civilian engagement, and detainee handling.
- **Site Exploitation (SSE):** Forensic sweep, document recovery, and rapid intelligence triage.
- **Technical Surveillance:** ISR management (UAV) and remote sensor employment.

### PHASE 3: SPECIALIST ROLES
Operators specialize in one of the two primary TIE Cell functions:
- **Technical Specialist (Active Targeting):** ISR overwatch, dynamic HVT tracking, and threat warning dissemination.
- **Exploitation Operator (Forward Exploitation Team):** Embedded support, on-target forensics, and field interrogation.

---

## ACTIVE TRAINING RECORDS

```dataview
TABLE status as "Status", phase as "Current Phase"
FROM "Units/RSIS/Training/Assessments/Results"
WHERE file.name != "Assessments-Dashboard"
```

---

## REFERENCE & DOCTRINE
- [The TIE Mandate](../../RSIS%20Brief.md)
- [Orbat & Structure](../../Resources/Orbat/RSIS/RSIS%20Orbat.md)

---
**"Knowledge is Lethality"**
