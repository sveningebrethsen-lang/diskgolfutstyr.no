# Generert rapport for banedata

Generert: 2026-09-29

Autoritativ publiseringskilde: `data/courses/norway.json` (Course Schema V1.1).

| Målepunkt | Resultat |
|---|---:|
| Poster | 27 |
| Legacy | 23 |
| Research complete | 15 |
| Validation pass | 13 |
| Review required | 9 |
| Verified | 4 |
| Publishable | 4 |
| Withheld | 0 |
| Feil | 0 |
| Advarsler | 220 |
| Info | 37 |

## Status per bane

| Bane | Kjerne | Recommended | Kilder | Kildealder | Konflikter | Research | Validate | Review | Publication | Feil/advarsler |
|---|---:|---:|---:|---|---:|---|---|---|---|---:|
| Krokhol Disc Golf Course | 11/11 | 5/6 | 3 | 1 dager / fresh | 0 | klar | bestått | godkjent | publishable | 0/2 |
| Klemetsrud diskgolfbane | 11/11 | 5/6 | 2 | 1 dager / fresh | 0 | klar | bestått | godkjent | publishable | 0/2 |
| Holmenkollen frisbeegolf | 11/11 | 5/6 | 4 | 118 dager / aging | 0 | klar | bestått | kreves | legacy | 0/4 |
| Ekebergsletta frisbeegolfbane | 11/11 | 4/6 | 3 | 118 dager / aging | 0 | klar | bestått | kreves | legacy | 0/4 |
| Hauketo Diskgolfbane | 9/11 | 3/6 | 1 | 118 dager / aging | 0 | mangler | stopp | not_requested | legacy | 0/14 |
| Lambertseter Diskgolfbane | 9/11 | 3/6 | 1 | 118 dager / aging | 0 | mangler | stopp | not_requested | legacy | 0/14 |
| Alvøen Frisbeegolfbane | 11/11 | 4/6 | 3 | 118 dager / aging | 0 | klar | bestått | kreves | legacy | 0/4 |
| Søndre Hetlevik frisbeegolfbane | 11/11 | 5/6 | 4 | 118 dager / aging | 0 | klar | bestått | kreves | legacy | 0/4 |
| Kalandeid IL | 9/11 | 3/6 | 1 | 118 dager / aging | 0 | mangler | stopp | not_requested | legacy | 0/14 |
| Dragvoll Diskgolfpark | 11/11 | 5/6 | 2 | 1 dager / fresh | 0 | klar | bestått | godkjent | publishable | 0/2 |
| Hallset Diskgolfpark | 9/11 | 4/6 | 2 | 118 dager / aging | 0 | mangler | stopp | not_requested | legacy | 0/13 |
| Trolla Diskgolfpark | 11/11 | 4/6 | 3 | 118 dager / aging | 0 | klar | bestått | kreves | legacy | 0/4 |
| Bølgane Frisbeegolfpark | 11/11 | 4/6 | 4 | 118 dager / aging | 0 | klar | bestått | kreves | legacy | 0/4 |
| Sukkevann Frisbeegolfpark | 10/11 | 4/6 | 3 | 1 dager / fresh | 1 | klar | stopp | not_requested | legacy | 0/8 |
| Skimore Drammen | 11/11 | 6/6 | 3 | 118 dager / aging | 0 | klar | bestått | kreves | legacy | 0/2 |
| Kvernhuset DiscGolfpark | 10/11 | 2/6 | 5 | 118 dager / aging | 0 | klar | stopp | not_requested | legacy | 0/10 |
| Ambjørnrød Skole Discgolfbane | 9/11 | 3/6 | 1 | 118 dager / aging | 0 | mangler | stopp | not_requested | legacy | 0/14 |
| Skien Frisbeegolfbane | 11/11 | 5/6 | 4 | 118 dager / aging | 0 | klar | bestått | kreves | legacy | 0/4 |
| Kollmyr Frisbeegolf | 9/11 | 3/6 | 1 | 118 dager / aging | 0 | mangler | stopp | not_requested | legacy | 0/14 |
| Heistad-banen | 11/11 | 4/6 | 5 | 118 dager / aging | 0 | klar | bestått | kreves | legacy | 0/3 |
| Kjølnes-banen | 11/11 | 5/6 | 2 | 1 dager / fresh | 0 | klar | bestått | godkjent | publishable | 0/1 |
| Charlottenlund Discgolfbane | 8/11 | 2/6 | 1 | 118 dager / aging | 0 | mangler | stopp | not_requested | legacy | 0/12 |
| Ørndalen diskgolfpark | 8/11 | 3/6 | 1 | 118 dager / aging | 0 | mangler | stopp | not_requested | legacy | 0/12 |
| Sandnes Disc Golf Park | 9/11 | 2/6 | 1 | 118 dager / aging | 0 | mangler | stopp | not_requested | legacy | 0/14 |
| Egeland Diskgolfpark | 9/11 | 3/6 | 1 | 118 dager / aging | 0 | mangler | stopp | not_requested | legacy | 0/14 |
| Enga Discgolfpark Offisiell | 9/11 | 3/6 | 2 | 118 dager / aging | 0 | mangler | stopp | not_requested | legacy | 0/13 |
| Borg Golfbane | 9/11 | 3/6 | 1 | 118 dager / aging | 0 | mangler | stopp | not_requested | legacy | 0/14 |

## Issues per bane

### Krokhol Disc Golf Course

- Pipeline: research=true, validate=true, review_required=false, approved=true, publishable=true
- Issues: WARNING:recommended_missing, WARNING:layout_par_missing

### Klemetsrud diskgolfbane

- Pipeline: research=true, validate=true, review_required=false, approved=true, publishable=true
- Issues: WARNING:recommended_missing, WARNING:layout_par_missing

### Holmenkollen frisbeegolf

- Pipeline: research=true, validate=true, review_required=true, approved=false, publishable=false
- Issues: WARNING:recommended_missing, WARNING:layout_par_missing, WARNING:layout_par_missing, WARNING:sources_aging, INFO:legacy_record

### Ekebergsletta frisbeegolfbane

- Pipeline: research=true, validate=true, review_required=true, approved=false, publishable=false
- Issues: WARNING:recommended_missing, WARNING:recommended_missing, WARNING:layout_par_missing, WARNING:sources_aging, INFO:legacy_record

### Hauketo Diskgolfbane

- Pipeline: research=false, validate=false, review_required=false, approved=false, publishable=false
- Issues: WARNING:required_missing, WARNING:required_missing, WARNING:recommended_missing, WARNING:recommended_missing, WARNING:recommended_missing, WARNING:difficulty_rationale_missing, WARNING:legacy_suitability_without_rationale, WARNING:legacy_suitability_without_rationale, WARNING:qualified_source_missing, WARNING:secondary_without_primary, WARNING:required_fact_unverified, WARNING:required_fact_unverified, WARNING:sources_aging, INFO:legacy_record, WARNING:hole_information_missing, INFO:research_candidate

### Lambertseter Diskgolfbane

- Pipeline: research=false, validate=false, review_required=false, approved=false, publishable=false
- Issues: WARNING:required_missing, WARNING:required_missing, WARNING:recommended_missing, WARNING:recommended_missing, WARNING:recommended_missing, WARNING:difficulty_rationale_missing, WARNING:legacy_suitability_without_rationale, WARNING:legacy_suitability_without_rationale, WARNING:qualified_source_missing, WARNING:secondary_without_primary, WARNING:required_fact_unverified, WARNING:required_fact_unverified, WARNING:sources_aging, INFO:legacy_record, WARNING:hole_information_missing, INFO:research_candidate

### Alvøen Frisbeegolfbane

- Pipeline: research=true, validate=true, review_required=true, approved=false, publishable=false
- Issues: WARNING:recommended_missing, WARNING:recommended_missing, WARNING:layout_par_missing, WARNING:sources_aging, INFO:legacy_record

### Søndre Hetlevik frisbeegolfbane

- Pipeline: research=true, validate=true, review_required=true, approved=false, publishable=false
- Issues: WARNING:recommended_missing, WARNING:layout_par_missing, WARNING:layout_par_missing, WARNING:sources_aging, INFO:legacy_record

### Kalandeid IL

- Pipeline: research=false, validate=false, review_required=false, approved=false, publishable=false
- Issues: WARNING:required_missing, WARNING:required_missing, WARNING:recommended_missing, WARNING:recommended_missing, WARNING:recommended_missing, WARNING:difficulty_rationale_missing, WARNING:legacy_suitability_without_rationale, WARNING:legacy_suitability_without_rationale, WARNING:qualified_source_missing, WARNING:secondary_without_primary, WARNING:required_fact_unverified, WARNING:required_fact_unverified, WARNING:sources_aging, INFO:legacy_record, WARNING:hole_information_missing, INFO:research_candidate

### Dragvoll Diskgolfpark

- Pipeline: research=true, validate=true, review_required=false, approved=true, publishable=true
- Issues: WARNING:recommended_missing, WARNING:layout_par_missing

### Hallset Diskgolfpark

- Pipeline: research=false, validate=false, review_required=false, approved=false, publishable=false
- Issues: WARNING:required_missing, WARNING:required_missing, WARNING:recommended_missing, WARNING:recommended_missing, WARNING:difficulty_rationale_missing, WARNING:legacy_suitability_without_rationale, WARNING:legacy_suitability_without_rationale, WARNING:qualified_source_missing, WARNING:secondary_without_primary, WARNING:required_fact_unverified, WARNING:required_fact_unverified, WARNING:sources_aging, INFO:legacy_record, WARNING:hole_information_missing, INFO:research_candidate

### Trolla Diskgolfpark

- Pipeline: research=true, validate=true, review_required=true, approved=false, publishable=false
- Issues: WARNING:recommended_missing, WARNING:recommended_missing, WARNING:layout_par_missing, WARNING:sources_aging, INFO:legacy_record

### Bølgane Frisbeegolfpark

- Pipeline: research=true, validate=true, review_required=true, approved=false, publishable=false
- Issues: WARNING:recommended_missing, WARNING:recommended_missing, WARNING:layout_par_missing, WARNING:sources_aging, INFO:legacy_record

### Sukkevann Frisbeegolfpark

- Pipeline: research=true, validate=false, review_required=false, approved=false, publishable=false
- Issues: WARNING:recommended_missing, WARNING:recommended_missing, WARNING:layout_par_missing, WARNING:layout_par_missing, WARNING:qualified_source_missing, WARNING:secondary_without_primary, WARNING:required_fact_unverified, WARNING:required_fact_unverified, INFO:legacy_record, INFO:research_candidate

### Skimore Drammen

- Pipeline: research=true, validate=true, review_required=true, approved=false, publishable=false
- Issues: WARNING:layout_par_missing, WARNING:sources_aging, INFO:legacy_record

### Kvernhuset DiscGolfpark

- Pipeline: research=true, validate=false, review_required=false, approved=false, publishable=false
- Issues: WARNING:recommended_missing, WARNING:recommended_missing, WARNING:recommended_missing, WARNING:recommended_missing, WARNING:layout_par_missing, WARNING:qualified_source_missing, WARNING:secondary_without_primary, WARNING:required_fact_unverified, WARNING:required_fact_unverified, WARNING:sources_aging, INFO:legacy_record, INFO:research_candidate

### Ambjørnrød Skole Discgolfbane

- Pipeline: research=false, validate=false, review_required=false, approved=false, publishable=false
- Issues: WARNING:required_missing, WARNING:required_missing, WARNING:recommended_missing, WARNING:recommended_missing, WARNING:recommended_missing, WARNING:difficulty_rationale_missing, WARNING:legacy_suitability_without_rationale, WARNING:legacy_suitability_without_rationale, WARNING:qualified_source_missing, WARNING:secondary_without_primary, WARNING:required_fact_unverified, WARNING:required_fact_unverified, WARNING:sources_aging, INFO:legacy_record, WARNING:hole_information_missing, INFO:research_candidate

### Skien Frisbeegolfbane

- Pipeline: research=true, validate=true, review_required=true, approved=false, publishable=false
- Issues: WARNING:recommended_missing, WARNING:layout_par_missing, WARNING:layout_par_missing, WARNING:sources_aging, INFO:legacy_record

### Kollmyr Frisbeegolf

- Pipeline: research=false, validate=false, review_required=false, approved=false, publishable=false
- Issues: WARNING:required_missing, WARNING:required_missing, WARNING:recommended_missing, WARNING:recommended_missing, WARNING:recommended_missing, WARNING:difficulty_rationale_missing, WARNING:legacy_suitability_without_rationale, WARNING:legacy_suitability_without_rationale, WARNING:qualified_source_missing, WARNING:secondary_without_primary, WARNING:required_fact_unverified, WARNING:required_fact_unverified, WARNING:sources_aging, INFO:legacy_record, WARNING:hole_information_missing, INFO:research_candidate

### Heistad-banen

- Pipeline: research=true, validate=true, review_required=true, approved=false, publishable=false
- Issues: WARNING:recommended_missing, WARNING:recommended_missing, WARNING:sources_aging, INFO:legacy_record

### Kjølnes-banen

- Pipeline: research=true, validate=true, review_required=false, approved=true, publishable=true
- Issues: WARNING:recommended_missing

### Charlottenlund Discgolfbane

- Pipeline: research=false, validate=false, review_required=false, approved=false, publishable=false
- Issues: WARNING:required_missing, WARNING:required_missing, WARNING:recommended_missing, WARNING:recommended_missing, WARNING:recommended_missing, WARNING:recommended_missing, WARNING:qualified_source_missing, WARNING:secondary_without_primary, WARNING:required_fact_unverified, WARNING:required_fact_unverified, WARNING:sources_aging, INFO:legacy_record, WARNING:hole_information_missing, INFO:research_candidate

### Ørndalen diskgolfpark

- Pipeline: research=false, validate=false, review_required=false, approved=false, publishable=false
- Issues: WARNING:required_missing, WARNING:required_missing, WARNING:recommended_missing, WARNING:recommended_missing, WARNING:recommended_missing, WARNING:legacy_suitability_without_rationale, WARNING:qualified_source_missing, WARNING:secondary_without_primary, WARNING:required_fact_unverified, WARNING:required_fact_unverified, WARNING:sources_aging, INFO:legacy_record, WARNING:hole_information_missing, INFO:research_candidate

### Sandnes Disc Golf Park

- Pipeline: research=false, validate=false, review_required=false, approved=false, publishable=false
- Issues: WARNING:required_missing, WARNING:required_missing, WARNING:recommended_missing, WARNING:recommended_missing, WARNING:recommended_missing, WARNING:recommended_missing, WARNING:difficulty_rationale_missing, WARNING:legacy_suitability_without_rationale, WARNING:qualified_source_missing, WARNING:secondary_without_primary, WARNING:required_fact_unverified, WARNING:required_fact_unverified, WARNING:sources_aging, INFO:legacy_record, WARNING:hole_information_missing, INFO:research_candidate

### Egeland Diskgolfpark

- Pipeline: research=false, validate=false, review_required=false, approved=false, publishable=false
- Issues: WARNING:required_missing, WARNING:required_missing, WARNING:recommended_missing, WARNING:recommended_missing, WARNING:recommended_missing, WARNING:difficulty_rationale_missing, WARNING:legacy_suitability_without_rationale, WARNING:legacy_suitability_without_rationale, WARNING:qualified_source_missing, WARNING:secondary_without_primary, WARNING:required_fact_unverified, WARNING:required_fact_unverified, WARNING:sources_aging, INFO:legacy_record, WARNING:hole_information_missing, INFO:research_candidate

### Enga Discgolfpark Offisiell

- Pipeline: research=false, validate=false, review_required=false, approved=false, publishable=false
- Issues: WARNING:required_missing, WARNING:required_missing, WARNING:recommended_missing, WARNING:recommended_missing, WARNING:recommended_missing, WARNING:difficulty_rationale_missing, WARNING:legacy_suitability_without_rationale, WARNING:qualified_source_missing, WARNING:secondary_without_primary, WARNING:required_fact_unverified, WARNING:required_fact_unverified, WARNING:sources_aging, INFO:legacy_record, WARNING:hole_information_missing, INFO:research_candidate

### Borg Golfbane

- Pipeline: research=false, validate=false, review_required=false, approved=false, publishable=false
- Issues: WARNING:required_missing, WARNING:required_missing, WARNING:recommended_missing, WARNING:recommended_missing, WARNING:recommended_missing, WARNING:difficulty_rationale_missing, WARNING:legacy_suitability_without_rationale, WARNING:legacy_suitability_without_rationale, WARNING:qualified_source_missing, WARNING:secondary_without_primary, WARNING:required_fact_unverified, WARNING:required_fact_unverified, WARNING:sources_aging, INFO:legacy_record, WARNING:hole_information_missing, INFO:research_candidate
