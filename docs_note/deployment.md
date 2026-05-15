# Deployment and Real-Time Use

## Page Summary

This page separates what was truly deployed in the earlier Go1 project from what the later VLM capstone proposes as a conservative real-time path.
That distinction is important for accuracy.

---

## What Was Actually Deployed

### ✔ Real-time on Go1

The earlier navigation project reached real robot deployment.
A compact visual policy from the imitation-learning pipeline was integrated into a ROS runtime on the Go1 and used for real-time inference.

### What this real-time stack included

- low-latency model execution
- direct perception-to-motion mapping
- clipping and smoothing for stable commands
- practical safety handling such as stop overrides and conservative post-processing

### Why it matters

Phase 1 was a true robot deployment project.
Its purpose was to show that a learned visual navigation model could be packaged and executed online on Go1 hardware.

---

## What the VLM Capstone Proposes

### 🧪 Offline first

The later capstone solves a different problem.
It studies whether pretrained VLMs can provide better **high-level social decisions** about how the robot should behave around people.

### What the VLM layer provides

- a semantic reasoning module
- a slower decision policy over image sequences
- high-level actions such as `STOP`, `FORWARD`, `LEFT`, `RIGHT`, and `REVIEW`

### Important clarification

It should **not** be described as a fully deployed closed-loop robot controller.
The main evidence for this phase comes from offline benchmarking on curated Go1 rosbags.

---

## Safety Projection Layer

### ⚠️ Not deployed

Raw VLM output should not directly control Go1.

### Why not

- VLM latency is too high for fast closed-loop control
- social predictions do not guarantee free space or collision clearance
- lateral suggestions such as `LEFT` or `RIGHT` do not by themselves verify kinematic feasibility
- semantic reasoning and motor execution operate at different timescales

### Recommended system split

- the robot controller remains responsible for real-time safety and motion execution
- geometry, local control, and fast collision avoidance remain in the low-level loop
- the VLM provides slower semantic guidance about how to interpret the scene socially

> The VLM layer is best understood as a high-level social decision module, while the robot controller remains responsible for real-time safety and motion execution.

### What safety projection means in practice

- `LEFT` and `RIGHT` can be preserved as advisory hints
- a planner or controller can log or prefer those hints
- the final executable action should still pass through a conservative safety layer

This lets the VLM contribute to social interpretation without being granted direct motor authority.

---

## Final Deployment Interpretation

### In one line

1. **Earlier project:** real-time imitation-learning navigation deployed on Go1
2. **Later capstone:** offline VLM social-navigation benchmark plus a conservative advisory path for future integration

### Why this wording matters

This is the most accurate way to connect the two projects without overclaiming what the VLM phase achieved.
