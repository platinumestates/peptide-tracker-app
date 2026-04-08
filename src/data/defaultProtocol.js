export const defaultProtocol = {
  "version": "4",
  "lastUpdated": "2026-04-08",
  "allergyFlags": [
    "CJC-1295",
    "Sermorelin",
    "Tesamorelin",
    "Any GHRH analog"
  ],
  "avoidList": [
    "Clomiphene (SERMs)",
    "Retatrutide (dizziness history)"
  ],
  "peptides": [
    {
      "id": "ipamorelin",
      "name": "Ipamorelin",
      "shortName": "IP10",
      "category": "GH_stimulation",
      "color": "#6366f1",
      "schedule": "daily",
      "cycleDays": null,
      "doses": [
        {
          "id": "ip_am",
          "label": "AM Dose",
          "amount": "300",
          "unit": "mcg",
          "route": "SubQ",
          "timing": "6:00 AM",
          "reminderTime": "06:00",
          "notes": "Before breakfast, fasted preferred"
        },
        {
          "id": "ip_pm",
          "label": "PM Dose",
          "amount": "300",
          "unit": "mcg",
          "route": "SubQ",
          "timing": "8:00 PM",
          "reminderTime": "20:00",
          "notes": "3 hours after last meal"
        }
      ],
      "notes": "Growth hormone secretagogue. Synergizes with CJC-1295 (do not use). Improves sleep quality.",
      "supplier": "LIYU",
      "productCode": "IP10",
      "storageTemp": "Freezer"
    },
    {
      "id": "igf1_lr3",
      "name": "IGF-1 LR3",
      "shortName": "IG1",
      "category": "anabolic",
      "color": "#f59e0b",
      "schedule": "workout_days",
      "cycleDays": {
        "on": 42,
        "off": 14
      },
      "doses": [
        {
          "id": "ig1_dose",
          "label": "Injection",
          "amount": "50",
          "unit": "mcg",
          "route": "SubQ",
          "timing": "Post-workout",
          "reminderTime": "17:00",
          "notes": "Post-workout, 3x per week (MWF)"
        }
      ],
      "notes": "Anabolic — muscle & recovery. On 42 days, then 14 days off. Hyperglycemia risk — monitor blood sugar.",
      "supplier": "LIYU",
      "productCode": "IG1",
      "storageTemp": "Freezer"
    },
    {
      "id": "mots_c",
      "name": "MOTS-c",
      "shortName": "MS10",
      "category": "mitochondrial",
      "color": "#10b981",
      "schedule": "MWF",
      "cycleDays": null,
      "doses": [
        {
          "id": "mots_dose",
          "label": "Injection",
          "amount": "5",
          "unit": "mg",
          "route": "SubQ",
          "timing": "8:00 AM",
          "reminderTime": "08:00",
          "notes": "Mitochondrial function optimizer"
        }
      ],
      "notes": "Mitochondrial peptide. Improves energy & cellular metabolism. 3x weekly (MWF).",
      "supplier": "LIYU",
      "productCode": "MS10",
      "storageTemp": "Freezer"
    },
    {
      "id": "semax",
      "name": "Semax",
      "shortName": "XA11",
      "category": "nootropic",
      "color": "#8b5cf6",
      "schedule": "weekdays",
      "cycleDays": {
        "on": 60,
        "off": 30
      },
      "doses": [
        {
          "id": "semax_dose",
          "label": "Intranasal",
          "amount": "600",
          "unit": "mcg",
          "route": "Intranasal",
          "timing": "9:00 AM",
          "reminderTime": "09:00",
          "notes": "Cognitive enhancement, 5x per week"
        }
      ],
      "notes": "Nootropic peptide. 60 days ON, 30 days OFF. Improves focus, memory, mood.",
      "supplier": "LIYU",
      "productCode": "XA11",
      "storageTemp": "Fridge"
    },
    {
      "id": "dihexa",
      "name": "Dihexa",
      "shortName": "DHA20",
      "category": "nootropic",
      "color": "#ec4899",
      "schedule": "daily",
      "cycleDays": {
        "on": 28,
        "off": 14
      },
      "doses": [
        {
          "id": "dihexa_dose",
          "label": "Oral Capsule",
          "amount": "20",
          "unit": "mg",
          "route": "Oral",
          "timing": "7:00 AM",
          "reminderTime": "07:00",
          "notes": "Cognitive enhancer — 28 days on, 14 off"
        }
      ],
      "notes": "Potent brain-derived neurotrophic factor (BDNF) enhancer. Mood & memory. Cycling recommended.",
      "supplier": "LIYU",
      "productCode": "DHA20",
      "storageTemp": "Room Temp"
    },
    {
      "id": "hcg",
      "name": "HCG",
      "shortName": "WA10",
      "category": "hormonal",
      "color": "#f97316",
      "schedule": "MWF",
      "cycleDays": {
        "on": 56,
        "bridge": "kisspeptin",
        "bridgeDays": 28
      },
      "doses": [
        {
          "id": "hcg_dose",
          "label": "Injection",
          "amount": "750",
          "unit": "IU",
          "route": "SubQ",
          "timing": "9:00 AM",
          "reminderTime": "09:00",
          "notes": "Testosterone support, MWF. 8-week cycles with 4-week Kisspeptin bridge."
        }
      ],
      "notes": "Maintains endogenous testosterone during peptide use. 8-week cycles alternating with 4-week Kisspeptin bridge.",
      "supplier": "LIYU",
      "productCode": "WA10",
      "storageTemp": "Fridge"
    },
    {
      "id": "kisspeptin",
      "name": "Kisspeptin",
      "shortName": "KS10",
      "category": "hormonal",
      "color": "#ef4444",
      "schedule": "MWF",
      "cycleDays": {
        "on": 28,
        "bridge": "hcg",
        "bridgeDays": 56
      },
      "doses": [
        {
          "id": "kiss_dose",
          "label": "Injection",
          "amount": "150",
          "unit": "mcg",
          "route": "SubQ",
          "timing": "9:00 AM",
          "reminderTime": "09:00",
          "notes": "HPA axis restart bridge, MWF, 4 weeks"
        }
      ],
      "notes": "4-week bridge phase between HCG cycles. Restarts natural testosterone production. MWF schedule.",
      "supplier": "LIYU",
      "productCode": "KS10",
      "storageTemp": "Freezer"
    },
    {
      "id": "epithalon",
      "name": "Epithalon",
      "shortName": "ET50",
      "category": "longevity",
      "color": "#06b6d4",
      "schedule": "daily_during_course",
      "cycleDays": {
        "on": 20,
        "off": 180
      },
      "doses": [
        {
          "id": "epithalon_dose",
          "label": "Injection",
          "amount": "5",
          "unit": "mg",
          "route": "SubQ",
          "timing": "8:00 AM",
          "reminderTime": "08:00",
          "notes": "Telomerase activator, 20 days per course, 6-month breaks"
        }
      ],
      "notes": "Telomerase booster for cellular longevity. 20-day courses separated by 180-day breaks. Take daily during course only.",
      "supplier": "LIYU",
      "productCode": "ET50",
      "storageTemp": "Freezer"
    },
    {
      "id": "ggh",
      "name": "GGH",
      "shortName": "GGH",
      "category": "regenerative",
      "color": "#84cc16",
      "schedule": "MWF",
      "cycleDays": null,
      "doses": [
        {
          "id": "ggh_dose",
          "label": "Injection",
          "amount": "0.4",
          "unit": "ml",
          "route": "SubQ",
          "timing": "8:00 AM",
          "reminderTime": "08:00",
          "notes": "Tissue repair & regeneration, MWF"
        }
      ],
      "notes": "Compound of GHK-CU, Glutathione, Histidine, Glycine, NADH. Tissue repair & skin health. MWF.",
      "supplier": "LIYU",
      "productCode": "GGH",
      "storageTemp": "Fridge"
    },
    {
      "id": "nad_plus",
      "name": "NAD+ (1000mg)",
      "shortName": "NJ1000",
      "category": "longevity",
      "color": "#fbbf24",
      "schedule": "MWF",
      "cycleDays": null,
      "doses": [
        {
          "id": "nad_dose",
          "label": "Injection",
          "amount": "150",
          "unit": "mg",
          "route": "IV",
          "timing": "10:00 AM",
          "reminderTime": "10:00",
          "notes": "NAD+ precursor for cellular energy & longevity, MWF"
        }
      ],
      "notes": "Coenzyme boosting cellular energy (NAD+). Mitochondrial function & longevity. 3x per week.",
      "supplier": "LIYU",
      "productCode": "NJ1000",
      "storageTemp": "Freezer"
    }
  ]
};
