/*
  app.js — 3D carousel + pinned-under-finger drag & drop
  with a "1 Billion" style UI. No external images or fonts!
*/

/* Data for placeholders & categories */
let layout = {
  morning: [null, null, null, null],
  midday:  [null, null, null, null],
  evening: [null, null, null, null]
};

const catNames = ["Energy", "Focus", "Leisure", "Travel", "Wellness", "Fun"];
// Some example emoji sets
const baseEmojis = [
  "🔥","⚡","🎉","🧘‍♂️","📚","🤸‍♀️",
  "🍕","🎨","🚀","🌏","🍹","🏆",
  "🏀","🎧","💡","📱","☕","💻"
];

let dragItem = null;
let dragItemOriginalParent = null;

window.addEventListener('load', initAll);

function initAll() {
  initSectors();
  initCategories();
  attachHeroCarousel();
  attachButtons();
  setActiveDay('morning');
}

/* ================== Sectors (Morning, Midday, Evening) ================== */
function initSectors() {
  // If you want double-tap removal or other logic, put it here
  const placeholders = document.querySelectorAll('.placeholder');
  placeholders.forEach(ph => {
    // Example double-tap detection can be done with timestamps
  });
}

/* ================== Category Deck (Emojis) ================== */
function initCategories() {
  const mainContent = document.getElementById('mainContent');

  catNames.forEach(catName => {
    const catTitle = document.createElement('h2');
    catTitle.textContent = catName;
    mainContent.appendChild(catTitle);

    const emojiGrid = document.createElement('div');
    emojiGrid.className = 'emoji-grid';

    let catEmojis = shuffleArray(baseEmojis).slice(0, 8); // get 8 random
    catEmojis.forEach(em => {
      const emojiDiv = document.createElement('div');
      emojiDiv.className = 'emoji-item';
      emojiDiv.textContent = em;

      // Touch events
      emojiDiv.addEventListener('touchstart', handleEmojiTouchStart);
      emojiDiv.addEventListener('touchmove', handleEmojiTouchMove, {passive:false});
      emojiDiv.addEventListener('touchend', handleEmojiTouchEnd);

      emojiGrid.appendChild(emojiDiv);
    });

    mainContent.appendChild(emojiGrid);
  });
}

/* ================== Hero Carousel (3D) ================== */
function attachHeroCarousel() {
  document.getElementById('morningSect').addEventListener('click', () => setActiveDay('morning'));
  document.getElementById('middaySect').addEventListener('click', () => setActiveDay('midday'));
  document.getElementById('eveningSect').addEventListener('click', () => setActiveDay('evening'));
}

function setActiveDay(day) {
  const morningSect = document.getElementById('morningSect');
  const middaySect  = document.getElementById('middaySect');
  const eveningSect = document.getElementById('eveningSect');

  morningSect.classList.remove('active','left','right');
  middaySect.classList.remove('active','left','right');
  eveningSect.classList.remove('active','left','right');

  if(day === 'morning') {
    morningSect.classList.add('active');
    middaySect.classList.add('right');
    eveningSect.classList.add('left');
  } else if(day === 'midday') {
    middaySect.classList.add('active');
    eveningSect.classList.add('right');
    morningSect.classList.add('left');
  } else {
    eveningSect.classList.add('active');
    morningSect.classList.add('right');
    middaySect.classList.add('left');
  }
}

/* ================== Drag & Drop (Pinned-Under-Finger) ================== */
function handleEmojiTouchStart(e) {
  if(e.touches.length > 1) return;

  const touch = e.touches[0];
  dragItem = e.currentTarget;
  dragItemOriginalParent = dragItem.parentElement;
  dragItem.classList.add('dragging');

  // Optional haptic if supported
  if(navigator.vibrate) {
    navigator.vibrate(10);
  }

  positionDragItem(touch.pageX, touch.pageY);
}

function handleEmojiTouchMove(e) {
  if(!dragItem) return;
  e.preventDefault(); 
  const touch = e.touches[0];
  positionDragItem(touch.pageX, touch.pageY);
}

function handleEmojiTouchEnd(e) {
  if(!dragItem) return;
  if(navigator.vibrate) {
    navigator.vibrate([5, 5, 5]);
  }

  // Determine drop target
  const changedTouch = e.changedTouches[0];
  const dropTarget = document.elementFromPoint(changedTouch.clientX, changedTouch.clientY);

  if(dropTarget && dropTarget.classList.contains('placeholder')) {
    if(dropTarget.children.length === 0) {
      dropTarget.appendChild(dragItem);
    } else {
      // Swap
      const occupant = dropTarget.children[0];
      if(dragItemOriginalParent && dragItemOriginalParent.classList.contains('placeholder')) {
        dragItemOriginalParent.appendChild(occupant);
        dropTarget.appendChild(dragItem);
      } else {
        dropTarget.appendChild(dragItem);
      }
    }
  } else {
    magnetReturn(dragItem, dragItemOriginalParent);
  }

  dragItem.classList.remove('dragging');
  dragItem = null;
  dragItemOriginalParent = null;
}

function positionDragItem(x, y) {
  dragItem.style.left = (x - dragItem.offsetWidth / 2) + 'px';
  dragItem.style.top  = (y - dragItem.offsetHeight / 2) + 'px';
}

function magnetReturn(item, originalParent) {
  if(originalParent) {
    originalParent.appendChild(item);
  }
}

/* ================== Buttons (Reset & Save) ================== */
function attachButtons() {
  const btnReset = document.getElementById('btnReset');
  const btnSave  = document.getElementById('btnSave');
  if(btnReset) btnReset.addEventListener('click', resetLayout);
  if(btnSave)  btnSave.addEventListener('click', saveLayout);
}

function resetLayout() {
  layout.morning = [null,null,null,null];
  layout.midday  = [null,null,null,null];
  layout.evening = [null,null,null,null];

  const placeholders = document.querySelectorAll('.placeholder');
  placeholders.forEach(ph => {
    while(ph.firstChild) {
      document.getElementById('mainContent').appendChild(ph.firstChild);
    }
  });
  alert("Layout reset complete!");
}

function saveLayout() {
  // Could store in localStorage or send to a server
  alert("Save not implemented. (Add your custom logic!)");
}

/* ================== Utility: Shuffle Array ================== */
function shuffleArray(arr) {
  let newArr = arr.slice();
  for(let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
}
