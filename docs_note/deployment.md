# Deployment and Real-Time Use

## Page Summary

This page separates what was actually run on the robot from what the later VLM capstone explored through a cautious integration path.
That distinction is not just wording. It affects what claims are technically defensible.

---

## What Was Actually Deployed

### ✔ Real-time on Go1

The earlier navigation project reached real robot deployment.
A compact visual policy from the imitation-learning pipeline was integrated into a ROS runtime on the Go1 and used for real-time inference.

### What this stack included

- low-latency model execution
- direct perception-to-motion mapping
- clipping and smoothing for stable commands
- stop overrides and conservative post-processing

### Engineering implication

Phase 1 was a controller project.
The main difficulty was keeping the system responsive and stable enough to use on hardware.

---

## What the VLM Capstone Proposes

### 🧪 Offline first

The later capstone is not another controller project in the same sense.
It asks whether pretrained VLMs can produce better decision labels for human-facing scenes than the earlier interface allowed.

### What the VLM layer provides

- slower scene interpretation over short image sequences
- explicit outputs such as `STOP`, `FORWARD`, `LEFT`, `RIGHT`, and `REVIEW`
- a way to represent ambiguity instead of forcing everything into motor-style outputs
- a controller-side path for safety-projected online decision studies

### Important clarification

It should **not** be described as a fully deployed closed-loop robot controller.
The reported evidence comes mainly from offline benchmarking on curated Go1 rosbags, while the broader study also included online integration experiments around wrapper calls, controller paths, and safety-projected execution.

---

## Safety Projection Layer

### ⚠️ Why raw VLM output should not drive Go1 directly

- VLM latency is too high for fast closed-loop control
- the outputs do not guarantee free space or collision clearance
- lateral suggestions such as `LEFT` or `RIGHT` do not verify kinematic feasibility
- semantic judgments and motor execution operate on different timescales

### Recommended system split

- the low-level controller remains responsible for real-time safety and motion execution
- geometry and local control stay in the fast loop
- the VLM layer only contributes slower scene interpretation and action suggestions

### What this means in practice

- `LEFT` and `RIGHT` can be logged or passed forward as advisory hints
- the final executable action should still pass through a conservative safety layer
- the value of the VLM layer is mostly in scene interpretation, not direct actuation

This is why the most honest description is a safety-projected advisory path, not an online VLM controller.

---

## Final Deployment Interpretation

### In practical terms

1. **Earlier project:** a learned visual controller actually ran on Go1
2. **Later capstone:** an offline decision benchmark, plus controller-side integration experiments, explored what a more expressive human-aware interface might look like

### Why this distinction matters

If these two phases are collapsed into one story too aggressively, it sounds like the VLM policy was deployed in a way it was not.
Keeping the distinction explicit is part of the engineering result, not just a disclaimer.
