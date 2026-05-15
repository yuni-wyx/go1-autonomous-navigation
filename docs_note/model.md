# Models

## Page Summary

This project uses two different model paradigms for two different jobs:

- **Phase 1:** compact deployable visual models for real-time robot motion
- **Phase 2:** pretrained VLMs for higher-level social decision making

---

## Part A: Imitation-Learning Model

### What this does

The earlier Go1 navigation pipeline uses a lightweight visual imitation-learning model centered on a `ResNet-18` backbone.
The purpose is to map onboard camera input to navigation-relevant robot behavior under real-time deployment constraints.

### Core ingredients

- `ResNet-18` visual backbone
- short temporal history / GRU-style context where useful
- deployment-side safety logic such as smoothing, clipping, and stop-gate style filtering

### Inputs and outputs

**Input:**

- front-camera imagery from Go1

**Output:**

- forward motion tendency
- stop or slow-down behavior
- turning-related control signals
- velocity-style estimates such as `[vx, vy, wz]` in the regression framing

### Why this model family was suitable

- simple and well understood
- efficient enough for real-time use on Go1
- straightforward to integrate into a ROS node
- strong enough to learn corridor-following and navigation cues without making deployment overly fragile

### Why it matters

The practical goal of Phase 1 was not model novelty by itself.
It was to produce a robot system that could actually run online.

---

## Part B: VLM Social-Navigation Model

### What this does

The later capstone shifts from low-level control to high-level social decision making using pretrained vision-language models:

- `Qwen3-VL-30B`
- `InternVL-3.5-14B`

### Important clarification

- The VLMs were **not trained from scratch** in this project.
- They were **not fine-tuned** for this capstone.
- They are used as **pretrained semantic reasoning modules**.

### Single-image vs. sequence reasoning

The benchmark compares:

- single-image prompting
- sequence-based prompting over short front-camera windows

### Why sequence matters

Social navigation often depends on temporal cues rather than one still frame.
Sequence input helps expose:

- crossing direction
- receding motion
- late entry into the frame
- uncertainty when intent is unclear

### Prompt-policy layer

The main modeling contribution is a prompt-policy layer, not gradient-based retraining.
That layer asks the VLM to reason about:

- person presence
- motion type
- crossing direction
- whether the latest frame is blocked
- safer lateral side
- uncertainty or ambiguity

### Structured action output

The VLM layer maps its reasoning into the action space:

- `STOP`
- `FORWARD`
- `LEFT`
- `RIGHT`
- `REVIEW`

### Why this differs from Phase 1

- **Phase 1 model:** optimized for direct robot-oriented motion behavior under real-time constraints
- **Phase 2 model:** optimized for slower semantic interpretation and social decision support

The later phase is therefore not a replacement for the real-time controller.
It is better understood as a semantic module that could sit above a fast controller.

---

## Final Interpretation

### The model progression

1. a compact deployable visual policy for learning to move
2. a larger pretrained semantic policy for deciding when and how to yield around people

### Why this matters

This progression reflects a shift from low-level imitation to higher-level social reasoning rather than simply scaling up a single model family.
