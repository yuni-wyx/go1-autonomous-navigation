# Experiments

This document summarizes the key experimental choices, ablations, and
engineering observations made while developing and deploying a vision-based
imitation learning policy on the Unitree Go1.

The focus of these experiments is not exhaustive hyperparameter search, but
understanding which design decisions most strongly affect performance and
stability on a real robot.

---

## Baseline Configuration

- **Task:** Vision-based imitation learning  
- **Input:** Single RGB camera frame  
- **Output:** Continuous velocity command `[vx, vy, wz]`  
- **Backbone:** ResNet-18  
- **Loss:** Smooth L1 (Huber)  
- **Training:** Supervised regression with teleoperation data  

This baseline was chosen to be simple, interpretable, and efficient enough for
CPU-only deployment on the robot.

---

## Data Pipeline Experiments

### Teleoperation Data Characteristics

Raw teleoperation data exhibits:
- Strong bias toward straight-line motion
- Sparse coverage of turning behaviors
- High correlation between consecutive frames

**Observation:**  
Models trained on unfiltered data tend to under-predict yaw (`wz`) and show
directional bias in corridors.

---

### Timestamp Alignment Strategy

**Method:**  
- Nearest-neighbor matching between image timestamps and `Twist` commands

**Observation:**  
- Even small temporal misalignments noticeably degraded training stability
- Nearest-neighbor alignment was sufficient given the teleop command rate

---

## Data Augmentation Experiments

### Horizontal Flip Augmentation

**Setup:**  
- Random horizontal flip applied during training only  
- Corresponding label correction:
  - `vy → -vy`
  - `wz → -wz`

**Observation:**  
- Reduced left/right bias in narrow corridors
- Improved generalization to unseen turning directions
- No negative impact on straight-line behavior

This augmentation proved to be one of the highest-impact changes.

---

### Color Jitter

**Setup:**  
- Mild brightness and contrast jitter

**Observation:**  
- Improved robustness to lighting variation
- Limited impact compared to geometric augmentation

---

## Training Strategy Experiments

### Train / Validation Splits

**Setup:**  
- Initial train/test split
- 5-fold cross validation on training data

**Observation:**  
- Single random splits produced unstable validation metrics
- K-fold CV provided more reliable performance estimates
- Fold variance highlighted sensitivity to dataset composition

---

### Stochastic Weight Averaging (SWA)

**Setup:**  
- Enabled during the later phase of training
- Averaged model weights evaluated against standard checkpoint

**Observation:**  
- Slight improvement in validation MAE
- Reduced sensitivity to the final epoch choice
- Benefits were modest but consistent

---

## Ensemble Inference

**Setup:**  
- Deployed multiple fold checkpoints simultaneously
- Predictions aggregated via simple mean

**Observation:**  
- Reduced prediction variance
- Smoother velocity commands during runtime
- Particularly beneficial for yaw (`wz`) stability

The ensemble improved control behavior more than offline metrics alone would
suggest.

---

## Deployment-Oriented Experiments

### Runtime Smoothing (EMA)

**Setup:**  
- Exponential moving average applied to predicted `vx` and `wz`

**Observation:**  
- Significantly reduced jitter in angular velocity
- Improved perceived smoothness of robot motion
- Minor increase in response latency, acceptable for walking speeds

---

### Velocity Clipping

**Setup:**  
- Conservative bounds enforced on `vx` and `wz`

**Observation:**  
- Improved safety during early deployment
- Prevented outlier predictions from causing abrupt motion

---

### Test-Time Augmentation (TTA)

**Setup:**  
- Horizontal flip TTA with sign correction at inference

**Observation:**  
- Minimal improvement in offline metrics
- Slight increase in runtime cost
- Disabled by default in deployment

---

## Negative Results and Limitations

- Increasing model capacity beyond ResNet-18 did not yield clear gains
- Removing EMA led to visibly unstable yaw commands
- Training without flip augmentation resulted in strong directional bias
- Dataset imbalance had a larger impact than optimizer or learning-rate tuning

---

## Summary of Findings

Across all experiments, the most impactful improvements came from:
1. Data coverage and balance
2. Physically valid augmentations
3. Runtime safety and smoothing

Model complexity played a secondary role compared to system-level design and
deployment considerations.

---

## Implications for Future Work

These findings motivate future exploration of:
- Richer data collection strategies
- Temporal models incorporating short histories
- More expressive policies (e.g., diffusion-based or VLA-style approaches)

However, even simple vision models can produce stable real-world behavior when
paired with a robust data pipeline and conservative deployment strategy.
