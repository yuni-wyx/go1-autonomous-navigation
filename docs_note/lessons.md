# Lessons Learned

This project highlighted that in robotics, system design and data quality often matter as much as model architecture. Below are the key lessons learned while building and deploying a vision-based policy on a real robot.

---

### Data Quality Issues Encountered

* **Motion blur and camera shake** significantly degraded label quality during fast turns or abrupt joystick inputs
* **Lighting variation** (shadows, reflections, overexposure) introduced distribution shifts that were not obvious during data collection
* Long segments of **near-constant motion** (e.g., straight driving) reduced effective supervision diversity
* Small timestamp misalignments between image frames and control commands could noticeably affect training stability

These issues reinforced that collecting *more* data is not always better than collecting *better* data.

---

### Debugging Tips

* Always **visualize extracted frames** before training to verify image quality and correct alignment
* Print and inspect **raw control command distributions** (`vx`, `wz`) to detect clipping or dead zones
* Validate that **training and deployment preprocessing are identical** (resize, crop, normalization)
* Test inference in a **dry-run mode** (no actuation) before enabling real motion on the robot
* Add safety layers (clipping, EMA smoothing, emergency stop) early to simplify on-robot debugging

System-level debugging saved more time than tuning hyperparameters.

---

### What I Would Do Differently

* Collect data more deliberately across **multiple environments and lighting conditions**
* Actively balance the dataset to avoid over-representing straight-line motion
* Introduce lightweight **self-supervised or auxiliary objectives** to improve representation learning
* Log and replay **full inference traces** (images + predictions) to accelerate iteration
* Explore tighter integration between perception and control, rather than treating them as separate stages

Overall, the project demonstrated that robust robotics systems emerge from **iterative data collection, careful validation, and conservative deployment**, not from model complexity alone.
