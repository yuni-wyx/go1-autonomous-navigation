# Go1 Research Report Overview

## One-Sentence Summary

This report documents both an earlier real-time imitation-learning navigation pipeline and a later VLM-based social-navigation capstone. The VLM policy is evaluated primarily offline and should not be described as a fully deployed closed-loop robot controller.

---

## The Big Picture

### What this report covers

- **Phase 1:** real-time imitation-learning navigation on Go1
- **Phase 2:** VLM-based social-navigation benchmark on curated Go1 rosbags
- **Final system view:** a fast controller paired with a slower semantic reasoning layer

### Why this progression matters

- The first phase asks whether a learned visual controller can run on the robot.
- The second phase asks whether the robot can make more interpretable decisions around people.
- Together, they show a move from low-level motion execution to higher-level social reasoning.

---

## Phase 1: Real-Time Imitation-Learning Navigation

### What this does

- Collects teleoperation data from Go1 rosbags
- Trains visual navigation policies such as ResNet-18-based models
- Integrates the learned policy into a real-time ROS pipeline on the robot

### What the policy is trying to control

- move forward when the path is clear
- slow or stop when necessary
- turn smoothly and stably
- keep inference lightweight enough for on-robot execution

### Why it matters

This phase establishes the practical robotics foundation of the project:

- data collection
- preprocessing and alignment
- training and packaging
- real-time deployment on Go1

---

## Why the Problem Changed

### Limitation of the earlier framing

Imitation learning can reproduce observed navigation behavior, but it does not always explain **why** the robot should stop, go forward, yield left, yield right, or defer.

### Social scenes need more structure

A centered person, a receding person, a late-entering person, and a crossing person are not equivalent cases.
The navigation interface therefore needs richer outputs than simple low-level motion imitation.

---

## Phase 2: VLM Social-Navigation Capstone

### What this does

- evaluates pretrained vision-language models on Go1 image sequences
- treats social navigation as a **high-level decision problem**
- expands the action space to:
  - `STOP`
  - `FORWARD`
  - `LEFT`
  - `RIGHT`
  - `REVIEW`

### Key design choice

The capstone does **not** fine-tune a new robot policy end to end.
Instead, it uses pretrained VLMs as semantic reasoning modules and adds a prompt-policy layer for:

- crossing-direction logic
- receding-person recovery
- explicit uncertainty via `REVIEW`

### What was evaluated

- 13 curated Go1 rosbag scenarios
- single-image and sequence-based prompting
- offline metrics such as action accuracy, unsafe-forward rate, and bag-level consensus

---

## Architectural Progression

### Phase 1

`image input -> learned visual policy -> direct real-time robot control`

### Phase 2

`image sequence -> pretrained VLM reasoning -> structured social decision -> safety-projected controller path`

### What changed architecturally

The later phase separates:

- a **fast controller** for real-time execution and safety
- a **slower semantic layer** for interpreting people and ambiguity

This is important because raw VLM outputs are not suitable as low-latency motor commands.

---

## Offline vs. Real-Time

### Evaluated offline

- `Qwen3-VL-30B` and `InternVL-3.5-14B`
- single-image and sequence-based social-navigation policies
- 13 curated Go1 rosbag scenarios
- decision-level metrics and scenario analysis

### Deployed or safety-projected in real time

- the earlier imitation-learning stack was deployed on Go1 for real-time inference
- the later VLM work defines a conservative path in which VLM outputs are treated as advisory signals and projected through safety logic before any executable robot action is considered

---

## Main Takeaway

### In one line

This project evolves from **learning how to move** to **reasoning about when and how to yield around people**.

### Why that matters

It shows not only model-building ability, but also systems thinking about:

- deployment constraints
- interface design
- interpretability
- safety in embodied AI
