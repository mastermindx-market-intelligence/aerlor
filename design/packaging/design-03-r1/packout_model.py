"""Arithmetic aid for two concept layouts. Never produces a production release.

Unknown inputs block dimensional output. Complete inputs remain CONCEPT_LAYOUT_ONLY;
the converter and qualified engineers must validate geometry, structure and transport.
No costs, supplier information, private quotations or physical test outcomes are used.
"""
from __future__ import annotations

import json
import math
from pathlib import Path
import sys


POSITIVE = ("module_length", "module_width", "module_height", "module_mass",
            "divider_thickness", "interlayer_thickness", "wall_allowance_per_side",
            "case_tare_6", "case_tare_12")
NONNEGATIVE = ("clearance_length_total", "clearance_width_total", "clearance_height_total")
IDENTIFIERS = ("sku_reference", "measurement_record")


def calculate(data: dict) -> dict:
    """Return blocked metadata or two preliminary, nonapproved carton layouts."""
    if not isinstance(data, dict):
        raise ValueError("Input must be a JSON object")
    if data.get("length_unit") != "mm" or data.get("mass_unit") != "kg":
        raise ValueError("Declare length_unit=mm and mass_unit=kg; convert inputs explicitly")
    invalid = []
    for key in POSITIVE + NONNEGATIVE:
        value = data.get(key)
        if value is None:
            continue
        if isinstance(value, bool) or not isinstance(value, (int, float)):
            invalid.append(key)
        elif not math.isfinite(value) or value < 0 or (key in POSITIVE and value == 0):
            invalid.append(key)
    for key in IDENTIFIERS:
        value = data.get(key)
        if value is not None and (not isinstance(value, str) or not value.strip()):
            invalid.append(key)
    if invalid:
        raise ValueError("Invalid measured values: " + ", ".join(invalid))
    missing = [key for key in POSITIVE + NONNEGATIVE + IDENTIFIERS if data.get(key) is None]
    boundary = "Arithmetic only; no structural, ergonomic, safety or transit qualification."
    if missing:
        return {"status": "BLOCKED_MISSING_MEASUREMENTS", "missing": missing,
                "production_release": False, "boundary": boundary}
    cases = []
    for layers in (1, 2):
        columns, rows = 3, 2
        count = columns * rows * layers
        inside = [columns * data["module_length"] + (columns - 1) * data["divider_thickness"] + data["clearance_length_total"],
                  rows * data["module_width"] + (rows - 1) * data["divider_thickness"] + data["clearance_width_total"],
                  layers * data["module_height"] + (layers - 1) * data["interlayer_thickness"] + data["clearance_height_total"]]
        outside = [value + 2 * data["wall_allowance_per_side"] for value in inside]
        gross = count * data["module_mass"] + data[f"case_tare_{count}"]
        if not all(math.isfinite(v) for v in inside + outside + [gross]):
            raise ValueError("Calculated output is nonfinite; measured values are invalid")
        cases.append({"configuration": f"HOTEL-{count}", "layout": [columns, rows, layers],
                      "count": count, "inner_envelope_mm": inside,
                      "preliminary_outer_envelope_mm": outside,
                      "calculated_gross_kg": gross})
    return {"status": "CONCEPT_LAYOUT_ONLY", "production_release": False,
            "sku_reference": data["sku_reference"], "measurement_record": data["measurement_record"],
            "boundary": boundary, "cases": cases}


def main() -> int:
    path = Path(sys.argv[1]) if len(sys.argv) > 1 else Path(__file__).with_name("packout-inputs.json")
    try:
        result = calculate(json.loads(path.read_text(encoding="utf-8")))
    except (ValueError, OSError) as exc:
        print(json.dumps({"status": "INVALID_INPUT", "error": str(exc), "production_release": False}, indent=2))
        return 2
    print(json.dumps(result, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
