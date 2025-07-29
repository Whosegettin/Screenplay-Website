//
// Client‑side behaviour for the Tom Dickinson Scripts portfolio.
//
// This script wires up interactions on the landing page: hovering over
// screenplay titles updates the background to the associated cover art,
// clicking a title loads the corresponding PDF into a full‑screen reader,
// and a hamburger toggles the navigation drawer. All interactions are
// designed to feel light and unobtrusive, allowing the reader to move
// seamlessly between exploring titles and immersing themselves in a script.

document.addEventListener('DOMContentLoaded', function () {
    const body = document.body;
    const scriptList = document.querySelector('.script-list');
    const items = document.querySelectorAll('.script-item');
    const readerContainer = document.querySelector('.reader-container');
    const pdfFrame = readerContainer.querySelector('iframe, embed');
    const closeBtn = readerContainer.querySelector('.close-btn');
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    // Default background (when not hovering over items)
    const defaultBg = body.style.backgroundImage;

    // Helper to clear background when leaving items
    function resetBackground() {
        body.style.backgroundImage = defaultBg || '';
    }

    // Hover behaviour: update background to cover image
    items.forEach(item => {
        const cover = item.dataset.cover;
        item.addEventListener('mouseenter', () => {
            if (cover) {
                body.style.backgroundImage = `url(${cover})`;
            }
        });
        item.addEventListener('mouseleave', () => {
            // Revert to default background
            resetBackground();
        });
        // Click to open PDF
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const pdfSrc = item.dataset.pdf;
            if (!pdfSrc) return;
            openReader(pdfSrc);
        });
    });

    // Open the PDF reader
    function openReader(src) {
        // Hide script list via fade if present
        if (scriptList) {
            scriptList.classList.add('fade-out');
        }
        // Set PDF source
        if (pdfFrame.tagName.toLowerCase() === 'iframe' || pdfFrame.tagName.toLowerCase() === 'embed') {
            pdfFrame.src = src;
        }
        // Show reader after a slight delay to allow fade
        setTimeout(() => {
            readerContainer.classList.add('active');
        }, 300);
        // Prevent body scrolling
        body.style.overflow = 'hidden';
    }

    // Close the PDF reader
    function closeReader() {
        readerContainer.classList.remove('active');
        // Clear PDF src to free resources
        if (pdfFrame.tagName.toLowerCase() === 'iframe' || pdfFrame.tagName.toLowerCase() === 'embed') {
            pdfFrame.src = '';
        }
        // Show list again after fade
        setTimeout(() => {
            if (scriptList) {
                scriptList.classList.remove('fade-out');
            }
            resetBackground();
            body.style.overflow = '';
        }, 300);
    }

    closeBtn.addEventListener('click', closeReader);

    // Clicking anywhere outside the PDF frame will also close
    readerContainer.addEventListener('click', function (e) {
        // Only close if the click target is the container itself (not the PDF)
        if (e.target === readerContainer) {
            closeReader();
        }
    });

    // Toggle navigation drawer
    hamburger.addEventListener('click', function () {
        navMenu.classList.toggle('open');
    });

    // Close nav when clicking a link
    navMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('open');
        });
    });
});