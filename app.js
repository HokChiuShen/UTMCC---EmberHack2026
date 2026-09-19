// UTMCraft - Main Game Application Logic with Gemini 3.5 Flash-Lite Integration
import {
    CATEGORIES,
    BASE_ELEMENTS,
    YEAR_ELEMENTS,
    CURATED_ELEMENTS,
    STATIC_RECIPES_MAP,
    getPairKey,
    isYearElement,
    getYearLevel,
    resolveYearProgression,
    resolveCourseYearProgression,
    generateCourseWithGemini,
    lookupUTMCourseByCode,
    GEMINI_MODEL
} from './recipes.js';
import { sounds } from './audio.js';
import { fx } from './particles.js';

// Preload UTM Courses JSON database for course enrichment
fetch('./utm_courses.json')
    .then(r => r.json())
    .then(data => { window.UTM_COURSES_DB = data; console.log(`UTM Courses DB loaded: ${data.length} courses`); })
    .catch(e => console.warn('Could not load utm_courses.json:', e));

class UTMCraftGame {
    constructor() {
        this.discovered = new Map(); // id -> element object
        this.recipesFound = new Map(); // pairKey -> resultId
        this.canvasCards = []; // Array of card instances on canvas
        this.activeFilter = 'all';
        this.searchQuery = '';
        this.sortBy = 'recent';
        this.discoveryOrder = []; // Track order of discoveries
        this.isSynthesizing = false;

        // Drag State
        this.draggingCard = null;
        this.dragOffset = { x: 0, y: 0 };
        this.craftCandidate = null;
        this.nextInstanceId = 1;

        // Canvas View State
        this.zoom = 1;
        this.panX = 0;
        this.panY = 0;
        this.isPanningCanvas = false;
        this.panStart = { x: 0, y: 0 };

        // DOM Elements
        this.canvasArea = document.getElementById('canvas-area');
        this.canvasContainer = document.getElementById('canvas-container');
        this.fxCanvas = document.getElementById('fx-canvas');
        this.canvasEmptyState = document.getElementById('canvas-empty-state');
        this.elementsGrid = document.getElementById('elements-grid');
        this.categoryFilterWrap = document.getElementById('category-filter-wrap');
        this.searchInput = document.getElementById('search-input');
        this.searchClear = document.getElementById('search-clear');
        this.noResults = document.getElementById('no-results');
        this.trashDropzone = document.getElementById('trash-dropzone');
        this.clearCanvasBtn = document.getElementById('clear-canvas-btn');
        this.btnTopClear = document.getElementById('btn-top-clear');
        this.canvasCardCount = document.getElementById('canvas-card-count');
        this.statDiscoveredCount = document.getElementById('stat-discovered-count');
        this.statProgressFill = document.getElementById('stat-progress-fill');
        this.footerCountText = document.getElementById('footer-count-text');
        this.sortSelect = document.getElementById('sort-select');
        this.btnSound = document.getElementById('btn-sound');
        this.btnEncyclopedia = document.getElementById('btn-encyclopedia');
        this.modalEncyclopedia = document.getElementById('modal-encyclopedia');
        this.btnCloseModal = document.getElementById('btn-close-modal');
        this.btnCloseModalFooter = document.getElementById('btn-close-modal-footer');
        this.btnResetData = document.getElementById('btn-reset-data');
        this.toastContainer = document.getElementById('toast-container');
        this.encyclopediaList = document.getElementById('encyclopedia-list');
        this.modalDiscoveryStat = document.getElementById('modal-discovery-stat');
        this.canvasHint = document.getElementById('canvas-hint');

        // Description popup
        this.descPopup = document.getElementById('desc-popup');
        this.descPopupClose = document.getElementById('desc-popup-close');
        this.descPopupDelete = document.getElementById('desc-popup-delete');
        this._descPopupCard = null;

        // Custom keyword panel
        this.customKeywordInput = document.getElementById('custom-keyword-input');
        this.customKeywordBtn = document.getElementById('custom-keyword-btn');
    }

    init() {
        // Initialize particle canvas
        fx.init(this.fxCanvas);

        // Load saved game or start fresh
        this.loadSaveData();

        // Render UI
        this.renderCategoryChips();
        this.renderSidebar();
        this.updateStats();
        this.updateSoundButtonUI();
        this.updateCanvasCardCount(); // Keeps canvas blank initially and updates empty-state watermark

        // Canvas begins completely blank as requested - users can drag or click cards from the sidebar!

        // Attach Event Listeners
        this.bindEvents();
    }

    spawnInitialCards() {
        const rect = this.canvasArea.getBoundingClientRect();
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        // 2 rows of 3
        const layout = [
            { x: -180, y: -70 }, // Math
            { x: -20,  y: -70 }, // Science
            { x: 140,  y: -70 }, // English
            { x: -180, y: 30 },  // Logic
            { x: -20,  y: 30 },  // Writing
            { x: 140,  y: 30 }   // Presentation
        ];

        BASE_ELEMENTS.forEach((item, index) => {
            const pos = layout[index] || { x: 0, y: 0 };
            this.createCanvasCard(item, centerX + pos.x, centerY + pos.y, false);
        });
    }

    loadSaveData() {
        // Clear prior version saves so user starts fresh with only default basic elements
        localStorage.removeItem('utmcraft_save_v1');
        localStorage.removeItem('utmcraft_save_v2');
        localStorage.removeItem('utmcraft_save_v3');
        localStorage.removeItem('utmcraft_save_v4');

        try {
            const raw = localStorage.getItem('utmcraft_save_v5');
            if (raw) {
                const data = JSON.parse(raw);
                if (data.discovered && Array.isArray(data.discovered)) {
                    data.discovered.forEach(item => {
                        this.discovered.set(item.id, item);
                    });
                    this.discoveryOrder = data.discoveryOrder || Array.from(this.discovered.keys());
                }
                if (data.recipesFound) {
                    this.recipesFound = new Map(Object.entries(data.recipesFound));
                }
            }
        } catch (e) {
            console.warn('Failed to parse saved game data, resetting:', e);
        }

        // Always ensure base default elements exist
        BASE_ELEMENTS.forEach(elem => {
            if (!this.discovered.has(elem.id)) {
                this.discovered.set(elem.id, elem);
                if (!this.discoveryOrder.includes(elem.id)) {
                    this.discoveryOrder.push(elem.id);
                }
            }
        });

        this.saveGameData();
    }

    saveGameData() {
        try {
            const data = {
                discovered: Array.from(this.discovered.values()),
                discoveryOrder: this.discoveryOrder,
                recipesFound: Object.fromEntries(this.recipesFound)
            };
            localStorage.setItem('utmcraft_save_v5', JSON.stringify(data));
        } catch (e) {
            console.warn('Failed to save to localStorage:', e);
        }
    }

    renderCategoryChips() {
        this.categoryFilterWrap.innerHTML = '';
        Object.entries(CATEGORIES).forEach(([key, cat]) => {
            const chip = document.createElement('button');
            chip.className = `cat-chip ${this.activeFilter === key ? 'active' : ''}`;
            chip.innerHTML = `<span>${cat.icon}</span> <span>${cat.label}</span>`;
            chip.addEventListener('click', () => {
                this.activeFilter = key;
                this.renderCategoryChips();
                this.renderSidebar();
            });
            this.categoryFilterWrap.appendChild(chip);
        });
    }

    renderSidebar() {
        this.elementsGrid.innerHTML = '';

        let items = Array.from(this.discovered.values());

        // Apply Search
        if (this.searchQuery.trim()) {
            const query = this.searchQuery.toLowerCase();
            items = items.filter(i =>
                i.name.toLowerCase().includes(query) ||
                (i.code && i.code.toLowerCase().includes(query)) ||
                (i.desc && i.desc.toLowerCase().includes(query))
            );
        }

        // Apply Category Filter
        if (this.activeFilter !== 'all') {
            items = items.filter(i => i.category === this.activeFilter);
        }

        // Apply Sorting
        if (this.sortBy === 'recent') {
            items.sort((a, b) => {
                const idxA = this.discoveryOrder.indexOf(a.id);
                const idxB = this.discoveryOrder.indexOf(b.id);
                return idxB - idxA;
            });
        } else if (this.sortBy === 'alpha') {
            items.sort((a, b) => a.name.localeCompare(b.name));
        } else if (this.sortBy === 'category') {
            items.sort((a, b) => a.category.localeCompare(b.category) || a.name.localeCompare(b.name));
        }

        // Toggle empty state
        this.noResults.style.display = items.length === 0 ? 'block' : 'none';

        // Render card items in drawer
        items.forEach(elem => {
            const card = document.createElement('div');
            card.className = 'element-card';
            card.dataset.id = elem.id;
            card.dataset.cat = elem.category || 'starter';
            card.title = `${elem.code ? `[${elem.code}] ` : ''}${elem.name}\n${elem.desc || ''}\n(Click or drag to canvas)`;

            card.innerHTML = `
                <span class="elem-emoji">${elem.emoji}</span>
                <span class="elem-name">${elem.name}</span>
            `;

            // Fluid Drag or Click from sidebar onto canvas
            card.addEventListener('pointerdown', (e) => {
                if (e.button !== 0) return;
                const startX = e.clientX;
                const startY = e.clientY;
                let isDragging = false;
                let cardInstance = null;

                const onMove = (moveEv) => {
                    const dist = Math.hypot(moveEv.clientX - startX, moveEv.clientY - startY);
                    if (!isDragging && dist > 5) {
                        isDragging = true;
                        const containerRect = this.canvasContainer.getBoundingClientRect();
                        const x = (moveEv.clientX - containerRect.left) / this.zoom - 50;
                        const y = (moveEv.clientY - containerRect.top) / this.zoom - 20;
                        cardInstance = this.createCanvasCard(elem, x, y, false);
                        this.startDraggingCard(cardInstance, moveEv, 50, 20);
                        cleanup();
                    }
                };

                const onUp = () => {
                    cleanup();
                    if (!isDragging) {
                        // Clean Click / Tap: spawn 1 card on canvas near center
                        const rect = this.canvasArea.getBoundingClientRect();
                        const spawnX = (rect.width / 2 + (Math.random() - 0.5) * 200 - this.panX) / this.zoom;
                        const spawnY = (rect.height / 2 + (Math.random() - 0.5) * 160 - this.panY) / this.zoom;
                        this.createCanvasCard(elem, spawnX, spawnY);
                        sounds.playPop(520);
                    }
                };

                const cleanup = () => {
                    window.removeEventListener('pointermove', onMove);
                    window.removeEventListener('pointerup', onUp);
                    window.removeEventListener('pointercancel', cleanup);
                };

                window.addEventListener('pointermove', onMove);
                window.addEventListener('pointerup', onUp);
                window.addEventListener('pointercancel', cleanup);
            });

            // Double-click on sidebar card shows description popup
            card.addEventListener('dblclick', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.showDescPopup({ elemData: elem, el: null }, e.clientX, e.clientY);
            });

            this.elementsGrid.appendChild(card);
        });

        // Update footer text
        this.footerCountText.textContent = `${this.discovered.size} UTM courses & keywords`;
    }

    createCanvasCard(elem, x, y, playEffect = true) {
        const instanceId = this.nextInstanceId++;
        const cardEl = document.createElement('div');
        cardEl.className = 'canvas-card';
        cardEl.dataset.instanceId = instanceId;
        cardEl.dataset.id = elem.id;
        cardEl.dataset.cat = elem.category || 'starter';

        cardEl.innerHTML = `
            <span class="card-emoji">${elem.emoji}</span>
            <span class="card-name">${elem.name}</span>
            ${elem.code ? `<span class="card-code">${elem.code}</span>` : ''}
        `;

        // No longer clamped to viewport; infinite canvas
        cardEl.style.left = `${x}px`;
        cardEl.style.top = `${y}px`;

        const cardObj = {
            instanceId,
            elemData: elem,
            el: cardEl,
            x: x,
            y: y
        };

        // Pointer Events for Smooth Dragging
        cardEl.addEventListener('pointerdown', (e) => {
            if (e.button !== 0) return;
            this.startDraggingCard(cardObj, e);
        });

        // Double-click detection using click counter (avoids dblclick swallowing)
        let clickCount = 0;
        let clickTimer = null;
        cardEl.addEventListener('click', (e) => {
            e.stopPropagation();
            clickCount++;
            if (clickCount === 1) {
                clickTimer = setTimeout(() => { clickCount = 0; }, 300);
            } else if (clickCount >= 2) {
                clearTimeout(clickTimer);
                clickCount = 0;
                this.showDescPopup(cardObj, e.clientX, e.clientY);
            }
        });

        // Native dblclick event for immediate response
        cardEl.addEventListener('dblclick', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.showDescPopup(cardObj, e.clientX, e.clientY);
        });

        // Right click also shows description popup
        cardEl.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.showDescPopup(cardObj, e.clientX, e.clientY);
        });

        this.canvasContainer.appendChild(cardEl);
        this.canvasCards.push(cardObj);
        this.updateCanvasCardCount();

        if (playEffect) {
            const burstX = (x + 60) * this.zoom + this.panX;
            const burstY = (y + 20) * this.zoom + this.panY;
            fx.burst(burstX, burstY, false);
        }

        return cardObj;
    }

    showDescPopup(cardObj, clientX, clientY) {
        if (!this.descPopup) return;
        const elem = cardObj.elemData;
        this._descPopupCard = cardObj;

        // Enrich with utm_courses.json data if available
        let enriched = null;
        if (elem.code) {
            enriched = lookupUTMCourseByCode(elem.code);
        }

        const catLabel = CATEGORIES[elem.category]?.label || elem.category || 'UTM Course';
        const deptText = enriched?.dept_code
            ? `<span class="popup-dept-badge">${enriched.dept_code}</span>`
            : '';
        const prereqText = enriched?.prerequisites
            ? `<div class="popup-meta-row"><span class="popup-meta-label">📋 Prerequisites:</span> <span>${enriched.prerequisites}</span></div>`
            : '';
        const hoursText = enriched?.hours
            ? `<div class="popup-meta-row"><span class="popup-meta-label">🕐 Hours:</span> <span>${enriched.hours}</span></div>`
            : '';
        const distText = enriched?.distribution
            ? `<div class="popup-meta-row"><span class="popup-meta-label">📚 Distribution:</span> <span>${enriched.distribution}</span></div>`
            : '';
        const modeText = enriched?.delivery_mode
            ? `<div class="popup-meta-row"><span class="popup-meta-label">🏫 Delivery:</span> <span>${enriched.delivery_mode}</span></div>`
            : '';
        const fullDesc = enriched?.description || elem.desc || 'A UTM course.';

        const calendarLinkText = elem.code
            ? `<div class="popup-meta-row" style="margin-top: 8px;"><a href="https://utm.calendar.utoronto.ca/course-search" target="_blank" rel="noopener noreferrer" class="popup-calendar-btn">View on Official UTM Academic Calendar ↗</a></div>`
            : '';

        document.getElementById('desc-popup-emoji').textContent = elem.emoji || '📜';
        document.getElementById('desc-popup-title').textContent = elem.name || 'UTM Course';
        document.getElementById('desc-popup-code').textContent = elem.code || '';
        document.getElementById('desc-popup-cat').textContent = catLabel;
        document.getElementById('desc-popup-dept').innerHTML = deptText + (elem.department ? `<span class="popup-dept-text">${elem.department}</span>` : '');
        document.getElementById('desc-popup-desc').textContent = fullDesc;
        document.getElementById('desc-popup-meta').innerHTML = prereqText + hoursText + distText + modeText + calendarLinkText;

        // Render Recipe Graph
        const graphContainer = document.getElementById('desc-popup-graph');
        if (graphContainer) {
            graphContainer.innerHTML = '';
            const craftRecipes = [];
            this.recipesFound.forEach((resId, pairKey) => {
                if (resId === elem.id) {
                    const [idA, idB] = pairKey.split('___');
                    const itemA = this.discovered.get(idA) || CURATED_ELEMENTS[idA];
                    const itemB = this.discovered.get(idB) || CURATED_ELEMENTS[idB];
                    if (itemA && itemB) {
                        craftRecipes.push(`
                            <div style="display: flex; align-items: center; justify-content: center; width: 100%;">
                                <div class="recipe-node"><span>${itemA.emoji}</span> <span>${itemA.name}</span></div>
                                <span class="recipe-operator">+</span>
                                <div class="recipe-node"><span>${itemB.emoji}</span> <span>${itemB.name}</span></div>
                            </div>
                        `);
                    }
                }
            });

            if (craftRecipes.length > 0) {
                graphContainer.style.display = 'flex';
                graphContainer.innerHTML = `<div class="desc-popup-graph-title">Recipe</div>` + craftRecipes.join('<div style="text-align:center; color: var(--text-muted); font-size: 10px; margin: 2px 0;">OR</div>');
            } else {
                graphContainer.style.display = 'flex';
                graphContainer.innerHTML = `<div class="desc-popup-graph-title">Recipe</div><div style="font-style: italic; color: var(--text-muted); text-align: center;">Created customly</div>`;
            }
        }

        if (this.descPopupDelete) {
            this.descPopupDelete.style.display = cardObj.el ? 'inline-flex' : 'none';
        }

        // Position popup near click
        const popup = this.descPopup;
        popup.style.display = 'flex';
        popup.classList.add('open');

        // Wait one frame then position to avoid stale rect
        requestAnimationFrame(() => {
            const pw = popup.offsetWidth || 340;
            const ph = popup.offsetHeight || 280;
            let px = clientX + 12;
            let py = clientY - 12;
            if (px + pw > window.innerWidth - 10) px = clientX - pw - 12;
            if (py + ph > window.innerHeight - 10) py = window.innerHeight - ph - 10;
            if (py < 10) py = 10;
            if (px < 10) px = 10;
            popup.style.left = `${px}px`;
            popup.style.top = `${py}px`;
        });
    }

    hideDescPopup() {
        if (this.descPopup) {
            this.descPopup.classList.remove('open');
            setTimeout(() => {
                if (this.descPopup && !this.descPopup.classList.contains('open')) {
                    this.descPopup.style.display = 'none';
                }
            }, 200);
        }
        this._descPopupCard = null;
    }

    duplicateCard(cardObj) {
        const offset = 28;
        this.createCanvasCard(cardObj.elemData, cardObj.x + offset, cardObj.y + offset);
        sounds.playPop(580);
    }

    removeCanvasCard(cardObj) {
        if (cardObj.el && cardObj.el.parentNode) {
            cardObj.el.parentNode.removeChild(cardObj.el);
        }
        this.canvasCards = this.canvasCards.filter(c => c.instanceId !== cardObj.instanceId);
        this.updateCanvasCardCount();
    }

    updateCanvasCardCount() {
        this.canvasCardCount.textContent = this.canvasCards.length;
        if (this.canvasEmptyState) {
            this.canvasEmptyState.classList.toggle('hidden', this.canvasCards.length > 0);
        }
    }

    clearCanvas() {
        if (this.canvasCards.length === 0) return;
        this.canvasCards.forEach(card => {
            if (card.el && card.el.parentNode) {
                card.el.parentNode.removeChild(card.el);
            }
        });
        this.canvasCards = [];
        this.updateCanvasCardCount();
        sounds.playTrash();
    }

    startDraggingCard(cardObj, e, offsetX, offsetY) {
        this.draggingCard = cardObj;
        
        if (offsetX === undefined || offsetY === undefined) {
            const containerRect = this.canvasContainer.getBoundingClientRect();
            const mouseX = (e.clientX - containerRect.left) / this.zoom;
            const mouseY = (e.clientY - containerRect.top) / this.zoom;
            offsetX = mouseX - cardObj.x;
            offsetY = mouseY - cardObj.y;
        }
        
        this.dragOffset = { x: offsetX, y: offsetY };
        cardObj.el.classList.add('dragging');
        sounds.playPop(440);

        // Bring to front
        this.canvasContainer.appendChild(cardObj.el);
    }

    handlePointerMove(e) {
        if (this.isPanningCanvas) {
            this.panX += e.movementX;
            this.panY += e.movementY;
            this.updateCanvasTransform();
            return;
        }

        if (!this.draggingCard) return;

        const containerRect = this.canvasContainer.getBoundingClientRect();
        const mouseX = (e.clientX - containerRect.left) / this.zoom;
        const mouseY = (e.clientY - containerRect.top) / this.zoom;

        let curX = mouseX - this.dragOffset.x;
        let curY = mouseY - this.dragOffset.y;

        // No strict clamped boundaries so you can drag into the infinite canvas space
        this.draggingCard.x = curX;
        this.draggingCard.y = curY;
        this.draggingCard.el.style.left = `${curX}px`;
        this.draggingCard.el.style.top = `${curY}px`;

        // Check hover over Trash Zone (Trash is fixed to viewport, so use e.clientX/Y)
        const trashRect = this.trashDropzone.getBoundingClientRect();
        const isOverTrash = (
            e.clientX >= trashRect.left &&
            e.clientX <= trashRect.right &&
            e.clientY >= trashRect.top &&
            e.clientY <= trashRect.bottom
        );

        if (isOverTrash) {
            this.trashDropzone.classList.add('hovering');
        } else {
            this.trashDropzone.classList.remove('hovering');
        }

        // Collision detection for card craft combination
        const cardCenter = {
            x: curX + 60,
            y: curY + 22
        };

        let closestCandidate = null;
        let minDistance = 75; // Snap distance threshold

        for (const other of this.canvasCards) {
            if (other.instanceId === this.draggingCard.instanceId) continue;

            const otherCenter = {
                x: other.x + 60,
                y: other.y + 22
            };

            const dist = Math.hypot(cardCenter.x - otherCenter.x, cardCenter.y - otherCenter.y);
            if (dist < minDistance) {
                minDistance = dist;
                closestCandidate = other;
            }
        }

        // Update visual highlight on candidate card
        if (this.craftCandidate && this.craftCandidate !== closestCandidate) {
            this.craftCandidate.el.classList.remove('craft-candidate');
        }

        if (closestCandidate) {
            closestCandidate.el.classList.add('craft-candidate');
            this.craftCandidate = closestCandidate;
        } else {
            this.craftCandidate = null;
        }
    }

    async handlePointerUp(e) {
        if (this.isPanningCanvas) {
            this.isPanningCanvas = false;
            this.canvasArea.style.cursor = 'crosshair';
            return;
        }

        if (!this.draggingCard) return;

        const card = this.draggingCard;
        const candidate = this.craftCandidate;
        card.el.classList.remove('dragging');

        // Check if dropped into trash
        const trashRect = this.trashDropzone.getBoundingClientRect();
        const isOverTrash = (
            e.clientX >= trashRect.left &&
            e.clientX <= trashRect.right &&
            e.clientY >= trashRect.top &&
            e.clientY <= trashRect.bottom
        );

        if (isOverTrash) {
            this.removeCanvasCard(card);
            this.trashDropzone.classList.remove('hovering');
            sounds.playTrash();
            this.draggingCard = null;
            if (candidate) candidate.el.classList.remove('craft-candidate');
            this.craftCandidate = null;
            return;
        }

        // Check if dropped onto another card to craft
        if (candidate) {
            candidate.el.classList.remove('craft-candidate');
            this.draggingCard = null;
            this.craftCandidate = null;
            await this.executeCraft(card, candidate);
        } else {
            sounds.playPop(390);
            this.draggingCard = null;
            this.craftCandidate = null;
        }
    }

    async executeCraft(cardA, cardB) {
        const elemA = cardA.elemData;
        const elemB = cardB.elemData;
        const pairKey = getPairKey(elemA.id, elemB.id);

        const spawnX = (cardA.x + cardB.x) / 2;
        const spawnY = (cardA.y + cardB.y) / 2;

        // Show loading placeholder indicator
        cardB.el.innerHTML = `<span class="elem-emoji">⚡</span> <span class="elem-name">Consulting UTM Catalog...</span>`;
        cardB.el.classList.add('craft-candidate');
        sounds.playPop(480);

        let resultElem = null;

        // 1. Check local recipe cache first (0ms instantaneous lookup for previously discovered combos)
        const cachedId = this.recipesFound.get(pairKey);
        if (cachedId && this.discovered.has(cachedId)) {
            resultElem = this.discovered.get(cachedId);
        } else if (STATIC_RECIPES_MAP.has(pairKey)) {
            resultElem = STATIC_RECIPES_MAP.get(pairKey);
        }

        // 2. Check Year progression or Course + Year Level transmutation
        if (!resultElem) {
            const yearProgression = resolveCourseYearProgression(elemA, elemB);
            if (yearProgression) {
                resultElem = yearProgression;
            }
        }

        // 3. Query Gemini 3.5 Flash-Lite API
        if (!resultElem) {
            try {
                resultElem = await generateCourseWithGemini(elemA, elemB);
            } catch (err) {
                console.warn('Gemini Flash-Lite API error, aborting craft:', err);
                this.showToast('Could not combine those elements! (API Error)', '⚠️');
                sounds.playTrash();

                // Restore card B's visuals
                cardB.el.innerHTML = `
                    <span class="card-emoji">${elemB.emoji}</span>
                    <span class="card-name">${elemB.name}</span>
                    ${elemB.code ? `<span class="card-code">${elemB.code}</span>` : ''}
                `;
                cardB.el.classList.remove('craft-candidate');

                // Nudge card A slightly so they don't perfectly overlap
                cardA.x -= 20;
                cardA.y -= 20;
                cardA.el.style.left = \`\${cardA.x}px\`;
                cardA.el.style.top = \`\${cardA.y}px\`;

                return; // Abort the combination
            }
        }

        // Enrich result with utm_courses.json full description if available
        if (resultElem.code) {
            const enriched = lookupUTMCourseByCode(resultElem.code);
            if (enriched) {
                // Use real course title if more accurate than AI title
                if (!resultElem.name.includes(enriched.code)) {
                    resultElem = { ...resultElem };
                }
                // Use official description if present
                if (enriched.description && !resultElem.isEnriched) {
                    resultElem = { ...resultElem, officialDesc: enriched.description, isEnriched: true };
                }
            }
        }

        // Remove the two merged cards from the canvas
        this.removeCanvasCard(cardA);
        this.removeCanvasCard(cardB);

        // Notify if 4th Year Max Level merge
        if (resultElem.isMaxLevel) {
            this.showMaxYearToast();
        }

        // Check if first discovery
        const isFirstDiscovery = !this.discovered.has(resultElem.id);

        if (isFirstDiscovery) {
            this.discovered.set(resultElem.id, resultElem);
            this.discoveryOrder.push(resultElem.id);
            this.recipesFound.set(pairKey, resultElem.id);

            // Celebration sound & particles
            sounds.playDiscovery();
            fx.burst((spawnX + 60) * this.zoom + this.panX, (spawnY + 22) * this.zoom + this.panY, true);

            // Toast notification
            this.showDiscoveryToast(resultElem);

            // Save and refresh UI
            this.saveGameData();
            this.renderSidebar();
            this.updateStats();
        } else {
            this.recipesFound.set(pairKey, resultElem.id);
            sounds.playCraft();
            fx.burst((spawnX + 60) * this.zoom + this.panX, (spawnY + 22) * this.zoom + this.panY, false);
        }

        // Spawn result card on canvas
        const newCard = this.createCanvasCard(resultElem, spawnX, spawnY, false);
        if (isFirstDiscovery) {
            newCard.el.classList.add('new-discovery');
            setTimeout(() => {
                newCard.el.classList.remove('new-discovery');
            }, 3000);
        }
    }

    showDiscoveryToast(elem) {
        const toast = document.createElement('div');
        toast.className = 'toast';
        const tagText = elem.category === 'year' ? '🎓 Academic Year Level Unlocked!' : '✨ New UTM Course Discovered!';
        toast.innerHTML = `
            <span class="toast-icon">${elem.emoji}</span>
            <div class="toast-content">
                <span class="toast-tag">${tagText}</span>
                <span class="toast-title">${elem.name}</span>
                <span style="font-size: 11px; color: var(--text-muted);">${elem.department || 'University of Toronto Mississauga'}</span>
            </div>
        `;
        this.toastContainer.appendChild(toast);

        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 4500);
    }

    showMaxYearToast() {
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.innerHTML = `
            <span class="toast-icon">🎓</span>
            <div class="toast-content">
                <span class="toast-tag" style="color: var(--utm-gold);">Maximum Level Reached</span>
                <span class="toast-title">4th Year (Senior Capstone)</span>
                <span style="font-size: 11px; color: var(--text-muted);">4th Year is the maximum undergraduate year at UTM!</span>
            </div>
        `;
        this.toastContainer.appendChild(toast);

        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 4500);
    }

    updateStats() {
        const count = this.discovered.size;
        this.statDiscoveredCount.textContent = count;
        this.statProgressFill.style.width = `${Math.min(100, Math.max(10, count * 5))}%`;
    }

    updateSoundButtonUI() {
        if (sounds.isMuted()) {
            this.btnSound.textContent = '🔇';
            this.btnSound.title = 'Sound Effects Muted (Click to unmute)';
        } else {
            this.btnSound.textContent = '🔊';
            this.btnSound.title = 'Sound Effects On (Click to mute)';
        }
    }

    openEncyclopediaModal() {
        this.modalDiscoveryStat.textContent = `${this.discovered.size} UTM courses & keywords unlocked`;
        this.encyclopediaList.innerHTML = '';

        const allKnown = Array.from(this.discovered.values());

        allKnown.forEach(elem => {
            const itemEl = document.createElement('div');
            itemEl.className = 'encyclopedia-item';

            // Find recipes that produce this element
            const craftRecipes = [];
            this.recipesFound.forEach((resId, pairKey) => {
                if (resId === elem.id) {
                    const [idA, idB] = pairKey.split('___');
                    const itemA = this.discovered.get(idA) || CURATED_ELEMENTS[idA];
                    const itemB = this.discovered.get(idB) || CURATED_ELEMENTS[idB];
                    if (itemA && itemB) {
                        craftRecipes.push(`${itemA.emoji} ${itemA.name} + ${itemB.emoji} ${itemB.name}`);
                    }
                }
            });

            const recipeText = craftRecipes.length > 0
                ? `<div class="item-recipe-hint">Crafted from: ${craftRecipes.join(' OR ')}</div>`
                : (elem.parents ? `<div class="item-recipe-hint">Synthesized from: ${elem.parents.join(' + ')}</div>` : '');

            itemEl.innerHTML = `
                <span class="item-badge">${elem.emoji}</span>
                <div class="item-info">
                    <div class="item-header">
                        <span class="item-title">${elem.name}</span>
                        <span class="item-category-tag">${CATEGORIES[elem.category]?.label || elem.category}</span>
                    </div>
                    <div class="item-description">${elem.desc || 'An authentic UTM academic course.'}</div>
                    <div style="font-size: 11px; color: var(--accent-blue); margin-top: 3px;">🏛️ ${elem.department || 'UTM'}</div>
                    ${recipeText}
                </div>
            `;
            this.encyclopediaList.appendChild(itemEl);
        });

        this.modalEncyclopedia.classList.add('open');
    }

    closeEncyclopediaModal() {
        this.modalEncyclopedia.classList.remove('open');
    }

    resetGame() {
        if (confirm('Reset your discovered UTM courses back to the starter disciplines and 1st Year?')) {
            localStorage.removeItem('utmcraft_save_v5');
            this.discovered.clear();
            this.recipesFound.clear();
            this.discoveryOrder = [];
            this.clearCanvas();

            BASE_ELEMENTS.forEach(elem => {
                this.discovered.set(elem.id, elem);
                this.discoveryOrder.push(elem.id);
            });

            this.saveGameData();
            this.renderSidebar();
            this.updateStats();
            this.updateCanvasCardCount();
            this.closeEncyclopediaModal();
            sounds.playTrash();
        }
    }

    updateCanvasTransform() {
        this.canvasContainer.style.transform = `translate(${this.panX}px, ${this.panY}px) scale(${this.zoom})`;
    }

    bindEvents() {
        // Pointer events for canvas dragging & dropping
        window.addEventListener('pointermove', (e) => this.handlePointerMove(e));
        window.addEventListener('pointerup', (e) => this.handlePointerUp(e));

        this.canvasArea.addEventListener('pointerdown', (e) => {
            if (!e.target.closest('.canvas-card') && !e.target.closest('.trash-dropzone') && !e.target.closest('.clear-canvas-btn')) {
                this.isPanningCanvas = true;
                this.canvasArea.style.cursor = 'grabbing';
            }
        });

        this.canvasArea.addEventListener('wheel', (e) => {
            e.preventDefault();
            
            if (e.ctrlKey || e.metaKey) {
                // Zoom (Pinch or Ctrl+Scroll)
                // Use a smaller delta multiplier for smoother pinch-to-zoom on trackpads
                const zoomFactor = Math.exp(-e.deltaY * 0.01);
                const newZoom = Math.min(Math.max(this.zoom * zoomFactor, 0.15), 4);
                
                // Adjust pan to zoom towards mouse cursor
                const rect = this.canvasArea.getBoundingClientRect();
                const mouseX = e.clientX - rect.left;
                const mouseY = e.clientY - rect.top;
                
                this.panX = mouseX - (mouseX - this.panX) * (newZoom / this.zoom);
                this.panY = mouseY - (mouseY - this.panY) * (newZoom / this.zoom);
                this.zoom = newZoom;
            } else {
                // Pan (Scroll)
                this.panX -= e.deltaX;
                this.panY -= e.deltaY;
            }
            
            this.updateCanvasTransform();
        }, { passive: false });

        // Search bar
        this.searchInput.addEventListener('input', (e) => {
            this.searchQuery = e.target.value;
            this.searchClear.classList.toggle('visible', this.searchQuery.length > 0);
            this.renderSidebar();
        });

        this.searchClear.addEventListener('click', () => {
            this.searchInput.value = '';
            this.searchQuery = '';
            this.searchClear.classList.remove('visible');
            this.renderSidebar();
        });

        // Sort select
        this.sortSelect.addEventListener('change', (e) => {
            this.sortBy = e.target.value;
            this.renderSidebar();
        });

        // Clear Canvas Buttons
        this.clearCanvasBtn.addEventListener('click', () => this.clearCanvas());
        this.btnTopClear.addEventListener('click', () => this.clearCanvas());

        // Sound toggle
        this.btnSound.addEventListener('click', () => {
            sounds.toggleMute();
            this.updateSoundButtonUI();
            if (!sounds.isMuted()) {
                sounds.playPop(600);
            }
        });

        // Encyclopedia / Guide Modal
        this.btnEncyclopedia.addEventListener('click', () => this.openEncyclopediaModal());
        this.btnCloseModal.addEventListener('click', () => this.closeEncyclopediaModal());
        this.btnCloseModalFooter.addEventListener('click', () => this.closeEncyclopediaModal());
        this.modalEncyclopedia.addEventListener('click', (e) => {
            if (e.target === this.modalEncyclopedia) {
                this.closeEncyclopediaModal();
            }
        });

        // Reset progress
        this.btnResetData.addEventListener('click', () => this.resetGame());

        // Custom keyword
        if (this.customKeywordBtn && this.customKeywordInput) {
            this.customKeywordBtn.addEventListener('click', () => this.addCustomKeyword());
            this.customKeywordInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') this.addCustomKeyword();
            });
        }

        // Description popup close button
        if (this.descPopupClose) {
            this.descPopupClose.addEventListener('click', () => this.hideDescPopup());
        }
        if (this.descPopupDelete) {
            this.descPopupDelete.addEventListener('click', () => {
                if (this._descPopupCard) {
                    this.removeCanvasCard(this._descPopupCard);
                    sounds.playTrash();
                }
                this.hideDescPopup();
            });
        }
        // Close popup on click outside
        document.addEventListener('pointerdown', (e) => {
            if (this.descPopup && this.descPopup.classList.contains('open') &&
                !this.descPopup.contains(e.target)) {
                this.hideDescPopup();
            }
        }, { capture: true });

        // Dismiss hint on first click
        this.canvasArea.addEventListener('click', () => {
            if (this.canvasHint) {
                this.canvasHint.style.opacity = '0.4';
            }
        }, { once: true });
    }

    addCustomKeyword() {
        const input = this.customKeywordInput;
        if (!input) return;
        const raw = input.value.trim();
        if (!raw || raw.length < 2 || raw.length > 32) {
            input.classList.add('shake');
            setTimeout(() => input.classList.remove('shake'), 500);
            return;
        }

        const name = raw.charAt(0).toUpperCase() + raw.slice(1).toLowerCase();
        const id = 'custom_' + raw.toLowerCase().replace(/[^a-z0-9]/g, '_');

        if (this.discovered.has(id)) {
            this.showToast(`"${name}" already exists in your collection!`, '⚠️');
            input.value = '';
            return;
        }

        const customElem = {
            id,
            name,
            emoji: '🔮',
            category: 'starter',
            desc: `A custom keyword you added: "${name}". Combine it with other elements to discover UTM courses!`,
            isCustom: true
        };

        this.discovered.set(id, customElem);
        this.discoveryOrder.push(id);
        this.saveGameData();
        this.renderSidebar();
        this.updateStats();
        input.value = '';

        this.showToast(`Custom keyword "${name}" added!`, '🔮');
        sounds.playDiscovery();
    }

    showToast(message, icon = '✨') {
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.innerHTML = `
            <span class="toast-icon">${icon}</span>
            <div class="toast-content">
                <span class="toast-title">${message}</span>
            </div>
        `;
        this.toastContainer.appendChild(toast);
        setTimeout(() => { if (toast.parentNode) toast.parentNode.removeChild(toast); }, 4500);
    }
}

// Start Game on DOM Load
window.addEventListener('DOMContentLoaded', () => {
    const game = new UTMCraftGame();
    game.init();
    window.utmCraft = game;
});
