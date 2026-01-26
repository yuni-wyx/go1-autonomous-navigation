# Model (ResNet-18, PyTorch)

This section describes the learning formulation, model design, and training procedure used to map camera images to robot motion commands.

---

## Problem Definition

The task is formulated as a **supervised regression problem** for imitation learning.

### Input

* Single RGB image from the Go1 front-facing camera
* Image is preprocessed using:

  * Resize → Center crop
  * ImageNet normalization

### Output Label

* Continuous motion command vector:

  ```
  y = [vx, vy, wz]
  ```

  where:

  * `vx`: forward linear velocity
  * `vy`: lateral velocity (optionally forced to zero at deployment)
  * `wz`: angular velocity (yaw rate)

During deployment, additional safety logic (clipping, smoothing) is applied on top of the raw model output.

---

### Loss

* **Smooth L1 loss (Huber loss)** between predicted and ground-truth commands

This loss provides a balance between:

* L2 loss sensitivity for small errors
* Robustness to outliers compared to pure MSE

---

## Training

### Train / Validation Split

* Initial **train/test split** to hold out unseen data
* **K-fold cross validation** (typically 5-fold) performed on the training split
* Final model trained on the full training set after cross-validation

This setup improves robustness and provides a more reliable estimate of generalization.

---

### Augmentations

* **Random horizontal flip**

  * Applied only during training
  * Corresponding labels are adjusted:

    * `vy → -vy`
    * `wz → -wz`
* **Color jitter**

  * Mild brightness / contrast variation to improve robustness to lighting changes

Augmentations were chosen to reflect **physically valid transformations** for the robot.

---

### Hyperparameters

* Backbone: **ResNet-18**
* Optimizer: **AdamW**
* Learning rate: `1e-3`
* Batch size: `64`
* Epochs: `~10–20` (with early stopping)
* Dropout: `0.2` in the regression head
* Optional:

  * **Stochastic Weight Averaging (SWA)**
  * **Test-Time Augmentation (TTA)** via horizontal flip

---

## Results

### Performance

* Achieved low **mean absolute error (MAE)** on held-out test data
* Cross-validation showed consistent performance across folds
* Qualitative examples indicate:

  * Correct turning direction
  * Reasonable velocity magnitudes
  * Stable predictions across similar frames

(Quantitative metrics and examples are shown in `assets/results.png`.)

---

### Failure Cases

* Ambiguous visual scenes (e.g., wide open spaces without clear directional cues)
* Sudden lighting changes or strong reflections
* Rare maneuvers underrepresented in the dataset (e.g., sharp turns at high speed)

These cases highlight the importance of **data diversity and coverage**, rather than model complexity alone.

---

## Summary

A relatively simple vision backbone (ResNet-18), when paired with a clean data pipeline and careful deployment, proved sufficient to produce stable and deployable robot behavior.

This reinforces the value of strong baselines and system-level design in real-world robotics.
