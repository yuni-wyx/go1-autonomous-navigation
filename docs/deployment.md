# Deployment on Go1

This section describes how the trained vision policy was packaged, deployed, and executed on the Unitree Go1 for real-time inference.

---

## Packaging

### Model Export

* Trained models were saved as **PyTorch checkpoints (`.pt`)**
* Multiple K-fold models were retained and deployed as an **ensemble**
* Deployment artifacts include:

  * `model_fold*.pt` — trained ResNet-18 weights
  * `preprocess.json` — image preprocessing configuration (resize, crop, normalization)

This setup ensures that **training and deployment use identical preprocessing and output scaling**.

---

### Dependencies

The on-robot runtime environment includes:

* **ROS Melodic**
* **Python 3**
* **PyTorch (CPU-only)**
* **OpenCV** (image handling and visualization)
* **torchvision** (model and preprocessing)
* **cv_bridge** (ROS ↔ OpenCV image conversion)
* **NumPy**

The model runs entirely on CPU, simplifying deployment and avoiding GPU-specific dependencies.

---

## Runtime

### Inference Frequency

* Inference runs at **~10 Hz** (configurable via ROS parameters)
* The loop frequency balances:

  * Model inference cost
  * Control stability
  * Camera frame availability

---

### Latency Notes

* End-to-end inference latency (image → model → command) is low enough to support smooth teleoperation-style control
* To improve runtime stability:

  * Model outputs are **clipped to safe velocity limits**
  * **Exponential Moving Average (EMA)** smoothing is applied to reduce command jitter
* The system prioritizes **predictable, stable motion** over aggressive responsiveness

---

### Integration with ROS Nodes

The deployed policy runs as a standalone ROS node:

* Subscribes to:

  * Camera topic (`sensor_msgs/Image`)
  * Emergency stop topic (`std_msgs/Bool`)
* Publishes:

  * Velocity commands as `geometry_msgs/Twist`

At runtime:

1. Camera frames are received from the Go1 sensor pipeline
2. Images are preprocessed and passed through the neural network
3. Predicted motion commands `[vx, vy, wz]` are post-processed (clipping + smoothing)
4. Commands are published back to the robot control interface

An emergency stop signal immediately overrides all predicted commands.

---

## Summary

Deploying the trained model on the Go1 validated the full end-to-end system:

* The same model trained offline was executed on real robot hardware
* Inference ran in real time with safety constraints
* The perception-to-action pipeline functioned reliably in physical environments

This step transformed the project from an offline ML experiment into a **working embodied AI system**.
