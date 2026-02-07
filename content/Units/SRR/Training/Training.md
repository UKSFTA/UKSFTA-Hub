# [RESTRICTED] SRR TRAINING & DOCTRINE DASHBOARD

This dashboard serves as the central hub for all Special Reconnaissance Regiment (SRR) training activities, curriculum, and doctrinal standards. All candidates and instructors must adhere to the protocols outlined herein.

-

## QUICK LINKS

- [[Curriculum/Curriculum|**SRR Training Curriculum**]]
- [[Assessments/Assessments-Dashboard|**Assessments & Evaluations**]]
- [[Reference/Technical-Standards|**Technical Standards (ACE/ACRE/cTAB)**]]
- [[Templates/Templates-Dashboard|**Operational Templates**]]

-

## TRAINING PIPELINE

### PHASE 1: SELECTION & INITIAL EVALUATION (ICE)
The **Initial Candidate Evaluation (ICE)** is designed to verify a candidate's theoretical knowledge of Special Reconnaissance doctrine and their aptitude for covert operations.
- [ ] [ICE Theory Assessment](Assessments/Initial-Candidate-Evaluation-(ICE).md)
- [ ] [[Assessments/Field-Skills-Assessment|Covert Infiltration Assessment]]
- [ ] Technical Standards Validation (ACE/ACRE/cTAB)

### PHASE 2: CORE SKILLS (THE "BLACK COURSE")
Candidates undergo intensive training in the fundamental skills of the SRR operator.
- **Advanced Surveillance:** Urban/Rural foot and vehicle surveillance.
- **Close Target Reconnaissance (CTR):** Infiltration, observation, and intelligence gathering.
- **Technical Surveillance:** Employment of remote sensors, cameras, and SIGINT tools.
- **Covert Communications:** Mastery of ACRE/TFAR and low-profile communication methods.
- **Specialist Navigation:** Night navigation, micro-terrain utilisation, and cTAB proficiency.

### PHASE 3: SPECIALIST QUALIFICATIONS
Upon completion of core training, operators may specialize in:
- **Technical Surveillance Specialist (TSS)**
- **Advanced HUMINT Operator (AHO)**
- **Signals Intelligence Analyst (SIGINT)**
- **Specialist Driver (SD)**

-

## ACTIVE TRAINING RECORDS

```dataview
TABLE status as "Status", phase as "Current Phase"
FROM "Units/SRR/Training/Assessments/Results"
WHERE file.name != "Assessments-Dashboard"
```

-

## REFERENCE & DOCTRINE
- [PIR Standards](Reference/Priority%20Intelligence%20Requirements%20(PIR).md)
- [[Documentation/UK-Military-Ranks|UK Military Ranks]]
- [UKSF Progression](Training/UKSF%20Progression.pdf)

-
**"Everywhere, Unseen"**
