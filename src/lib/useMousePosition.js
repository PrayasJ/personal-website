import React from "react";

const useMousePosition = ({ includeTouch }) => {
    const [mousePosition, setMousePosition] = React.useState({
        x: null,
        y: null,
    });

    React.useEffect(() => {
        const updateMousePosition = (ev) => {
            let x, y;
            if (ev.touches && ev.touches.length > 0) {
                // Use the first touch in case of multiple touches
                const touch = ev.touches[0];
                x = touch.clientX;
                y = touch.clientY;
            } else {
                x = ev.clientX;
                y = ev.clientY + window.scrollY;
            }

            var body = document.body,
                html = document.documentElement;

            const pageHeight = Math.max(
                body.scrollHeight,
                body.offsetHeight,
                html.clientHeight,
                html.scrollHeight,
                html.offsetHeight
            ) - 375;

            const pageWidth = Math.max(
                body.scrollWidth,
                body.offsetWidth,
                html.clientWidth,
                html.scrollWidth,
                html.offsetWidth
            ) - 375;

            // Clamp the mouse position to the page boundaries
            x = Math.min(pageWidth, Math.max(0, x));
            y = Math.min(pageHeight, Math.max(0, y));

            setMousePosition({ x, y });
        };

        // Use the "mousemove" event for mouse tracking
        window.addEventListener("mousemove", updateMousePosition);

        if (includeTouch) {
            // Use the "touchmove" event for touch tracking
            window.addEventListener("touchmove", updateMousePosition, {
                passive: true,
            });
        }

        return () => {
            // Cleanup event listeners
            window.removeEventListener("mousemove", updateMousePosition);
            if (includeTouch) {
                window.removeEventListener("touchmove", updateMousePosition);
            }
        };
    }, [includeTouch]);

    return mousePosition;
};

export default useMousePosition;
