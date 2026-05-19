# Data Evolution

## Page Summary

The Go1 work uses two related but distinct kinds of data:

- **Phase 1 data:** low-level supervision for robot movement
- **Phase 2 data:** decision-level supervision for social navigation reasoning

---

## Imitation Learning Data

### What this data is

The earlier project relies on Go1 teleoperation and ROS bag recording.
While manually driving the robot, I record the visual stream and the corresponding motion commands so the model can learn navigation behavior from real robot experience.

### Typical supervision

- front-camera imagery
- motion-command labels such as `vx`, `vy`, and `wz`
- timestamp alignment between frames and control commands

### What these labels mean

These are **low-level control labels**.
They describe how the robot moved, not how a scene should be interpreted socially.

### Why this data was useful

It captures:

- corridor following
- turning behavior
- stop / go behavior in practice
- real sensor noise, motion blur, and environmental variation

This is the data foundation for a deployable visual controller.

---

## Social Navigation Benchmark Data

### What this data is

The later capstone uses a curated benchmark of **13 Go1 rosbag scenarios**.
These bags are labeled at the **decision level**, not the low-level control level.

### Extraction pipeline

- extract front-camera frames from each bag
- assemble short temporal windows for evaluation
- feed either single frames or capped sequences to the VLM

### Final benchmark configuration

- sequence window length = `10`
- maximum frames per VLM call = `5`
- sequence sampling mode = capped temporal subsampling

This means each candidate window spans 10 ordered frames, but at inference time only up to 5 evenly spaced frames are actually passed to the VLM.

### Scenario coverage

The benchmark includes:

- no person / empty path
- centered frontal person
- person on the left or right side
- right-to-left and left-to-right crossing
- approaching person
- receding person
- person entering the frame late
- two-person scenes
- review-oriented ambiguous cases

### What these labels mean

These are **decision-level labels** for high-level social behavior:

- `STOP`
- `FORWARD`
- `LEFT`
- `RIGHT`
- `REVIEW`

They do not specify exact motor commands.
They evaluate whether the semantic policy interprets the scene correctly.

---

## Why the Data Changed

### Phase 1 question

How did the robot move?

### Phase 2 question

How should the robot interpret a socially meaningful scene?

### Why that matters

The change in data is what enables the project to move from low-level visual imitation toward higher-level social decision making.
