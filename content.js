(() => {
  let dragBox, maskDiv;
  let startX, startY;

  let isFocusBoxDrawn = false;
  let isDragging = false;

  // Function to activate crosshair cursor
  const enableCrosshairCursor = () => {
    document.body.style.cursor = "crosshair";
  };

  enableCrosshairCursor(); // Change cursor to crosshair

  // Function to reset cursor to default
  const resetCursor = () => {
    if (!isDragging) {
      document.body.style.cursor = "auto";
    }
  };

  const createOverlay = () => {
    overlay = document.createElement("div");
    overlay.style.position = "fixed";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.width = "100vw";
    overlay.style.height = "100vh";
    overlay.style.background = "transparent";
    overlay.style.zIndex = "9998";
    overlay.style.pointerEvents = "auto"; // Blocks interactions
    document.body.appendChild(overlay);
  };

  const removeOverlay = () => {
    if (overlay) {
      overlay.remove();
      overlay = null;
    }
  };

  const addCloseButton = () => {
    closeButton = document.createElement("div");
    closeButton.innerHTML = "&#x2715;"; // Unicode for 'X'
    closeButton.style.position = "fixed";
    closeButton.style.color = "white";
    closeButton.style.fontSize = "20px";
    closeButton.style.fontWeight = "bold";
    closeButton.style.cursor = "pointer";
    closeButton.style.zIndex = "10000";
  
    // Position the close button outside the top-right of the box
    closeButton.style.left = `${parseInt(dragBox.style.left) + parseInt(dragBox.style.width) + 5}px`;
    closeButton.style.top = `${parseInt(dragBox.style.top) - 20}px`;
  
    document.body.appendChild(closeButton);
  
    // Add functionality to remove the drag box when the close button is clicked
    closeButton.addEventListener("click", () => {
      dragBox.remove();
      maskDiv.remove();
      closeButton.remove();
      dragBox = null;
      closeButton = null;
    });
  };

  const disableExtension = () => {
    // Remove all event listeners and UI elements
    document.removeEventListener("mousedown", onMouseDown);
    document.removeEventListener("mousemove", onMouseMove);
    document.removeEventListener("mouseup", onMouseUp);
  };


  const onMouseDown = (e) => {
    if (e.button !== 0 || isFocusBoxDrawn) return; // Only respond to left-click
    createOverlay();

    startX = e.clientX;
    startY = e.clientY;

    // Create a new mask if it doesn't exist
    if (!maskDiv) {
      maskDiv = document.createElement("div");
      maskDiv.style.position = "fixed";
      maskDiv.style.top = "0";
      maskDiv.style.left = "0";
      maskDiv.style.width = "100vw";
      maskDiv.style.height = "100vh";
      maskDiv.style.background = "rgba(0, 0, 0, 0.5)";
      maskDiv.style.pointerEvents = "none";
      maskDiv.style.zIndex = "9998";
      document.body.appendChild(maskDiv);
    }

    // Create the drag box
    dragBox = document.createElement("div");
    dragBox.style.position = "absolute";
    dragBox.style.zIndex = "9999";
    dragBox.style.pointerEvents = "none";
    document.body.appendChild(dragBox);

    // Add listeners for drag actions
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };

  const onMouseMove = (e) => {
    const currentX = e.clientX;
    const currentY = e.clientY;

    // Calculate dimensions
    const width = Math.abs(currentX - startX);
    const height = Math.abs(currentY - startY);

    // Update box position and size
    dragBox.style.left = `${Math.min(startX, currentX)}px`;
    dragBox.style.top = `${Math.min(startY, currentY)}px`;
    dragBox.style.width = `${width}px`;
    dragBox.style.height = `${height}px`;

    // Update the mask to create a hole for the box
    const boxLeft = Math.min(startX, currentX);
    const boxTop = Math.min(startY, currentY);
    const boxRight = boxLeft + width;
    const boxBottom = boxTop + height;

    maskDiv.style.clipPath = `polygon(
      0% 0%, 100% 0%, 100% 100%, 0% 100%, 
      0% ${boxTop}px, ${boxLeft}px ${boxTop}px, ${boxLeft}px ${boxBottom}px, ${boxRight}px ${boxBottom}px, ${boxRight}px ${boxTop}px, 0% ${boxTop}px
    )`;
  };

  const onMouseUp = () => {
    addCloseButton();
    isFocusBoxDrawn = true;
    maskDiv.style.background = "rgba(0, 0, 0, 0.95)";

    // Keep the drag box, but pointer events enabled for interaction
    dragBox.style.pointerEvents = "auto";
    
     // Reset cursor
     resetCursor();
     removeOverlay(); 
     disableExtension();
  };

  // Add the mousedown listener to start the process
  document.addEventListener("mousedown", onMouseDown);
})();
