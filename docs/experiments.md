# Experiments

This document summarizes key experimental decisions and observations made
during the development of the Go1 vision-based Autowalker.

---

## Baseline Model

- Backbone: ResNet-18
- Loss: Smooth L1 (Huber)
- Input: single RGB frame
- Output: [vx, vy, wz]

This baseline was chosen for simplicity and reliability on real robot hardware.

---

## Data & Augmentation Experiments

### Horizontal Flip Augmentation
- Applied only during training
- Label adjustment:
  - vy → -vy
  - wz → -wz

**Observation:**
- Improved generalization to left/right turns
- Reduced directional bias in narrow corridors

---

### Dataset Balance
- Straight-line motion dominates raw teleop data
- Under-representation of turning maneuvers caused unstable yaw predictions

**Mitigation:**
- Increased data collection during turning
- Optional down-sampling of long straight segments

---

## Training Strategies

### K-Fold Cross Validation
- Used 5-fold CV on training split
- Reduced sensitivity to specific train/val splits
- Provided more reliable estimate of generalization

---

### Ensemble Inference
- Deployed multiple fold checkpoints at runtime
- Aggregation via mean

**Observation:**
- Reduced prediction variance
- Smoother control behavior on robot

---

## Deployment-Oriented Adjustments

### EMA Smoothing
- Applied only at runtime
- Reduced jitter in angular velocity

### Velocity Clipping
- Enforced conservative bounds on vx and wz
- Improved safety during early testing

---

## Negative Results / Limitations

- Training without data augmentation led to strong left/right bias
- Removing EMA caused visibly unstable yaw commands
- Increasing model depth did not yield noticeable gains

---

## Summary

Most performance and stability gains came from **data coverage and runtime
safety logic**, rather than model complexity.
