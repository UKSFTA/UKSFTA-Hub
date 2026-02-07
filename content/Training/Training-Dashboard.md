# UKSF Training Dashboard

## Unit Training Dashboards
- [[Units/SAS/Training/Training|SAS-Training-Hub]]
- [[Units/SBS/Training/Training|SBS-Training-Hub]]
- [[Units/SRR/Training/Training|SRR-Training-Hub]]
- [[Units/RSIS/Training/Training|RSIS-Training-Hub]]

---

## Progression Pipeline
*This board tracks all candidates through the UKSF selection and training process.*

> [!NOTE] Documentation
> For instructions on how to use this dashboard, see the [[Documentation/Training-Dashboard-Guide|Training-Dashboard-Guide]].

<br>

### Phase 2: Basic Training (SFSG)
```dataview
TABLE WITHOUT ID
    link(file.link, full_name) AS "Candidate",
    current_unit as "Unit"
FROM "Personnel"
WHERE status = "Basic Training"
```

### Phase 3: JSFAW
```dataview
TABLE WITHOUT ID
    link(file.link, full_name) AS "Candidate",
    current_unit as "Unit"
FROM "Personnel"
WHERE status = "JSFAW"
```

### Phase 4: Continuation Training
*SAS, SBS, or SRR specific training.*
```dataview
TABLE WITHOUT ID
    link(file.link, full_name) AS "Candidate",
    current_unit AS "Selection Path"
FROM "Personnel"
WHERE contains(status, "Continuation")
```

### Phase 5: Specialist Training
```dataview
TABLE WITHOUT ID
    link(file.link, full_name) AS "Candidate",
    current_unit AS "Unit"
FROM "Personnel"
WHERE status = "Specialist Training"
```

### Phase 6: Active
```dataview
TABLE WITHOUT ID
    link(file.link, full_name) AS "Operative",
    call_sign AS "Call Sign",
    current_unit AS "Unit"
FROM "Personnel"
WHERE status = "Active"
```
---

## Training Resources
- [[Training/UKSF-Progression.pdf]]
- *Add links to training modules and resources here.*
