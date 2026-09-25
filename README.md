# DrishtiSetu (दृष्टि-सेतु) — SIH26015 Geospatial Fusion Workbench

**Smart India Hackathon 2026 • Problem Statement SIH26015**  
*Application of Geospatial Techniques for Visualization and Analysis to Interpret Geo-Coded Images to Enhance Watershed Development Outcomes.*  
**Team:** Pixelmob (`TM-SIH26-PXL09`)

> **Honesty & Prototype Disclosure:**  
> This repository is a **frontend-only interactive decision-support prototype**. All micro-watershed boundaries, Strahler stream networks, Sentinel-2 / LISS-IV multi-spectral indices (`NDVI`, `NDWI`), and `DRISHTI` geo-coded field photo cards are **deterministic simulations** anchored to real Bundelkhand (`UP / MP`) coordinates (`24.3°N–25.7°N, 78.3°E–80.8°E`). Live connection to NRSC Bhuvan / SRISHTI production APIs requires a formal DoLR/NRSC government data-sharing MoU and is represented as a planned integration.

---

## 1. Running in GitHub Codespaces & Local Development

### Option A: GitHub Codespaces (Zero-Config)
1. Click **Code → Codespaces → Create codespace on main**.
2. The included [`.devcontainer/devcontainer.json`](file:///c:/Users/abdullah/Downloads/DrishtiSetu/.devcontainer/devcontainer.json) automatically installs Node 20 LTS dependencies (`npm install`) and starts Vite bound to `0.0.0.0:5173` (`npm run dev -- --host 0.0.0.0 --port 5173`).
3. Port `5173` auto-forwards and opens the live preview automatically.

### Option B: Local Machine
```bash
npm install
npm run dev      # Starts dev server at http://localhost:5173
npm run build    # Runs TypeScript (tsc -b) + Vite production bundle
npm run preview  # Previews production build at http://localhost:4173
```

---

## 2. What is Real vs. What is Simulated

| Component / Layer | Status in Prototype | Implementation Detail | Production Requirement (Pending MoU) |
| :--- | :--- | :--- | :--- |
| **Base Satellite & Topo Tiles** | **Real Live Tiles** | Esri World Imagery satellite tiles + OpenStreetMap fallback via `Leaflet` (`EPSG:3857` / `EPSG:4326`). | ISRO Bhuvan SRISHTI WMTS (`Resourcesat-2A LISS-IV 5.8m` & `CartoDEM 10m`). |
| **Watershed Polygons & Area Maths** | **Real Geodesic Math (`@turf/turf`)** | 18 Bundelkhand micro-watersheds across 6 districts (`Jhansi`, `Lalitpur`, `Mahoba`, `Banda`, `Chhatarpur`, `Tikamgarh`) + interactive polygon drawing tool computing real area (`ha`) and perimeter (`km`). | Official SLUSI / SRISHTI micro-watershed codification polygons via `OGC WFS 2.0`. |
| **Geo-Coded Field Photos (`DRISHTI`)** | **Deterministic Simulation** | 320+ structured field asset cards across 6 civil classes (`check_dam`, `farm_pond`, `field_bund`, `trench`, `contour_bund`, `gully_plug`) + simulated mobile upload drawer. | Direct webhook / read replica from state WCDC / NRSC DRISHTI mobile database. |
| **Satellite Spectral Indices (`NDVI` / `NDWI`)** | **Seeded Coordinate Hash (`FNV-1a`)** | `seededCoordinateHash(lat, lng, assetId)` produces identical `NDVI`, `NDWI`, and stream offsets on every reload without random flicker. | Automated cloud-masked zonal extraction over Sentinel-2B / LISS-IV passes. |
| **Classification Accuracy** | **Explicit Placeholder** | Displayed as *"Target: to be validated against DoLR/NRSC ground truth in a pilot"* (never fabricated percentages). | Empirical confusion-matrix validation against physically audited WCDC ground truth. |
| **OGC GeoJSON Export & Print Dossiers** | **Real Working Export** | 1-click download of `RFC 7946` `EPSG:4326` `.geojson` files for any thematic layer (`LULC`, `Drainage`, `NDVI`, `Erosion`, `Assets`, `Flags`) + `@media print` reports. | Bi-directional `OGC WFS-T` transaction callback into Bhuvan SRISHTI. |

---

## 3. Deterministic Matching & Anomaly Rules (`src/services/simulationEngine.ts`)

Every geo-tagged photo is evaluated against its 90m satellite buffer and nearest Strahler stream line using four transparent, inspectable rules (visible live in **Judge Mode → Engine**):

1. **`RULE-CD-NDWI-01` (Check Dam Impoundment & Moisture Plume):**
   - *Condition:* `asset.type === 'check_dam' && claimedStage === 'Completed'`
   - *Requirement:* Post-monsoon `NDWI >= +0.08` AND Turf.js distance to mapped Strahler stream `<= 120m`.
   - *Mismatch Flag:* Flags high severity if photo claims a completed masonry weir but satellite SWIR/NDWI shows a dry channel (`NDWI < 0.08`).
2. **`RULE-FP-SURF-02` (Farm Pond Storage & Command Greenness):**
   - *Condition:* `asset.type === 'farm_pond'`
   - *Requirement:* `NDWI >= +0.05` OR 24-month `ΔNDVI >= +0.055`.
3. **`RULE-DRN-OFFSET-04` (Gully Plug Thalweg Alignment):**
   - *Condition:* `asset.type === 'gully_plug'`
   - *Requirement:* `turf.pointToLineDistance(photoPt, nearestStream) <= 95m` AND `ΔNDVI >= +0.010`.
4. **`RULE-VG-DELTA-03` (Contour/Field Bund & Staggered Trench Canopy Response):**
   - *Condition:* `field_bund | contour_bund | trench`
   - *Requirement:* 24-month Rabi `NDVI_2026 - NDVI_2022 >= +0.035`.

---

## 4. Design Decisions & "Human-Made, Domain-Credible" Pass

1. **Consistent Bundelkhand Semi-Arid Geography (`UP / MP`):** Rather than scattering pins randomly across India, all 18 micro-watersheds are situated in the drought-prone Bundelkhand basin (`Jhansi`, `Lalitpur`, `Mahoba`, `Banda` in UP; `Chhatarpur`, `Tikamgarh` in MP) using authentic regional soil taxonomy (`Bundelkhand Red Parwa`, `Black Mar Clay-Loam`, `Rakar Gravelly Loam`, `Kabar Silty Clay`), local block names (`Babina`, `Mauranipur`, `Talbehat`, `Charkhari`, `Rajnagar`), and SLUSI-style watershed codes (`2C2B4a1`).
2. **Government GIS Workbench Aesthetic over Consumer SaaS:** Eliminated all purple/blue tech gradients, glassmorphism, and consumer card bloat. Adopted a high-contrast cartographic palette: Deep Soil Brown (`#3B2A1E`), Forest/Paddy Green (`#2F6B3A`), Water Blue (`#2A6F97`), Turmeric Yellow (`#E3A72F`), Clay Red (`#9E3B22`), Warm Off-White (`#FBFAF6`), and Paper (`#F2EFE9`), paired with `Fraunces` serif headings, `Inter` data tables, and `JetBrains Mono` coordinate traces.
3. **Custom SVG Civil/Hydrological Asset Symbology:** Hand-coded 6 distinct line-art SVG icons in [`src/components/icons/AssetIcons.tsx`](file:///c:/Users/abdullah/Downloads/DrishtiSetu/src/components/icons/AssetIcons.tsx) representing stepped masonry check dams, trapezoidal farm ponds, earthen field bunds, staggered contour trenches, stone contour bunds, and boulder gully plugs—used identically in both UI legends and Leaflet map pins.
4. **Bilingual English + Hindi (`हिन्दी`) Support:** Added a global `हिन्दी / EN` toggle in the header and Judge Mode so field-level asset classifications (`चेक डैम`, `खेत तालाब`, `मेड़बंदी`, `कंटूर ट्रेंच`, `समोच्च बांध`, `गली प्लग`) and watershed names are accessible to district and block officers.
5. **Strict Scope Discipline:** Excluded farmer login/OTP, DBT payments, subsidy disbursement, carbon/harvest marketplaces, and blockchain certificates to stay 100% focused on **SIH26015 geospatial visualization and photo-satellite interpretation**.

---

## 5. Three-Minute Judge Demo Script

- **0:00 – 0:30 | The Gap (`/`):** Point out the permanent honesty chip in the header. Use the **Live Fusion Preview** toggle in the hero to flip between a *Flagged Site* (`DRI-JHS-101`, `NDWI -0.06`) and a *Matched Site* (`DRI-JHS-102`, `NDWI +0.19`).
- **0:30 – 1:00 | Boundary Delineation (`/explorer`):** Filter Bundelkhand watersheds by district/status. Click **Draw Boundary**, place 4 vertices on the Esri satellite map, watch `@turf/turf` compute geodesic hectares and perimeter live, and click **Create & Open Workspace**.
- **1:00 – 2:00 | Core Fusion & Thematic Workbench (`/watershed/BKD-JHS-001`):**
  - In **1. Fusion View**, inspect the side-by-side DRISHTI field photo card vs. the 90m Sentinel-2/LISS-IV patch and deterministic rule trace.
  - In **2. Thematic Maps**, toggle `LULC`, `Drainage (Strahler 1-4)`, `NDVI Heatmap`, and `RUSLE Erosion`, then click **Export GeoJSON**.
  - In **3. Change (22–26)**, drag the 2022 vs. 2026 swipe slider and inspect the auto-generated quadrant synthesis and 24-month NDVI projection chart.
  - In **4. Flagged Insights**, click **Escalate for Field Visit** on a high-severity check dam mismatch, and test **Simulate DRISHTI Field Upload** in the top bar.
- **2:00 – 2:30 | Planner Drill-Down (`/dashboard`):** Drill down from **National → Uttar Pradesh SLNA → Jhansi District** and review the ranked *Watersheds Needing Attention* table.
- **2:30 – 3:00 | Architecture & Standard Technical Document (`/how-it-works` & `/technical-document`):** Click nodes in the interactive 4-tier SVG architecture diagram, open the **Standard Technical Document** (`Schemas`, `OGC WMS/WFS`, `RBAC`, `StateConfig`), and open **Judge Mode → Engine** in the bottom-right corner.
