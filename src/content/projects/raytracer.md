---
id: 3
title: "Raytracer in Rust"
tags: ["Rust", "Math"]
image: "/immagini/raytracer.jpg"
order: 3
---

> **Raytracer offline multithreaded** scritto in Rust puro (no lib esterne eccetto random) seguendo il libro "Ray Tracing in One Weekend".

## Features
- Bounding Volume Hierarchies (BVH) per prestazioni ottimali.
- Materiali (Lambertian, Metal, Dielectric).
- Multithreading tramite `rayon`.

```rust
// Core della logica di scattering
fn scatter(ray: &Ray, rec: &HitRecord, color: &mut Color, scattered: &mut Ray) -> bool {
    // ... logic ...
}
```
