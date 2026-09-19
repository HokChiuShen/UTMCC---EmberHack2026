# UTMCC - UTM Course Craft

An Infinite Craft style game powered by authentic University of Toronto Mississauga (UTM) undergraduate courses. Combine foundational disciplines, academic keywords, and year levels to discover real UTM courses!

---

## How to Run the Game

### Method 1: One-Click Run (Windows)
Just double-click **`run.bat`** in this folder! It will start the server and automatically launch the game in your browser at `http://localhost:8080`.

---

### Method 2: Command Line (Windows / Mac / Linux)

1. Open your terminal or PowerShell in this project folder:
   ```bash
   cd path/to/EmberHack2026-main
   ```

2. Start the local server:
   * **Using Python:**
     ```bash
     py -m http.server 8080
     # or
     python3 -m http.server 8080
     ```
   * **Using Node.js:**
     ```bash
     npx serve
     # or
     npx http-server -p 8080
     ```

3. Open your web browser and go to:
   **`http://localhost:8080`**

---

## Game Mechanics
* **Foundational Disciplines:** Start with Math, Science, Computer Science, Art, English, Logic, Writing, and Presentation.
* **Academic Year Levels:** Merge year levels (1st Year, 2nd Year, 3rd Year, 4th Year) with disciplines or courses to discover and level up courses strictly matching that year level (100, 200, 300, 400).
* **Custom Keywords:** Type any academic subject (e.g. *Economics*, *Philosophy*, *Astronomy*) to add it to your board and merge it into real UTM courses!
* **100% Authentic:** Every course is verified against the official `utm_courses.json` catalog.