# Models

## Page Summary

The project uses two model families for two different reasons.
The first one is chosen because it can actually run online on Go1.
The second one is chosen because it can express distinctions that the first interface could not.

---

## Imitation Learning Model

### What this does

The earlier Go1 navigation pipeline uses a lightweight visual imitation-learning model centered on a `ResNet-18` backbone.
The goal is straightforward: map onboard camera input to navigation-relevant motion behavior under real-time deployment constraints.

### Core ingredients

- `ResNet-18` visual backbone
- short temporal history / GRU-style context where useful
- deployment-side logic such as smoothing, clipping, and stop-gate style filtering

### Inputs and outputs

**Input:**

- front-camera imagery from Go1

**Output:**

- forward motion tendency
- stop or slow-down behavior
- turning-related control signals
- velocity-style estimates such as `[vx, vy, wz]` in the regression framing

### Why this model family was used

- it is simple enough to debug
- it is light enough for real-time use on Go1
- it integrates cleanly into a ROS node
- it is strong enough to learn corridor-following and turning cues without making deployment too brittle

### Engineering tradeoff

The upside is deployability.
The downside is that this kind of model says little about why a scene should map to one decision rather than another, especially once people are involved.

---

## VLM Social Navigation Model

### What this does

The later capstone uses pretrained vision-language models to see whether the decision interface can be made more expressive:

- `Qwen3-VL-30B`
- `InternVL-3.5-14B`

### Important clarification

- The VLMs were **not trained from scratch** here.
- They were **not fine-tuned** for this capstone.
- They are used as pretrained models whose outputs are shaped by prompt design and post-hoc evaluation.

### Single-image vs. sequence reasoning

The benchmark compares:

- single-image prompting
- sequence-based prompting over short front-camera windows

This matters because some failures only make sense over time.
A still frame may show “person present,” but not whether that person is crossing, receding, or just entering the frame.

### Prompt-policy layer

The main intervention is a prompt-policy layer, not gradient-based retraining.
That layer forces the model to reason about:

- person presence
- motion type
- crossing direction
- whether the latest frame is blocked
- safer lateral side
- uncertainty or ambiguity

### Structured action output

The VLM layer maps its reasoning into:

- `STOP`
- `FORWARD`
- `LEFT`
- `RIGHT`
- `REVIEW`

### Engineering tradeoff

The VLM interface is more expressive, but much less suitable for direct low-level control.
It is slower, less geometrically grounded, and harder to trust frame by frame.
That is why it makes more sense as a decision layer than as a replacement controller.

---

## Final Interpretation

The model progression is not “small model, then bigger model.”
It is closer to:

1. a model chosen because it can run online
2. a model chosen because it can represent decisions the earlier interface was hiding

That distinction is more important than parameter count.
