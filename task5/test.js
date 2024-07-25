updateHorizontalScrollBar() {
    this.horizontalBar.addEventListener('mousedown', (e) => {
        e.preventDefault();

        let isHorizontalScrolling = true;
        let startMouseX = e.clientX;
        let startBarLeft = this.horizontalBar.offsetLeft;
        
        const onMouseMove = (e) => {
            if (!isHorizontalScrolling) return;
            e.preventDefault();

            const currentMouseX = e.clientX;
            const diffX = currentMouseX - startMouseX;
            const maxBarLeft = this.horizontalScroll.clientWidth - this.horizontalBar.offsetWidth;

            // Calculate acceleration ratio
            const totalContentWidth = horizontallyScrolled + this.horizontalScroll.clientWidth;
            const accRatio = Math.min(5, (totalContentWidth / 2*this.horizontalScroll.clientWidth));
            console.log(this.horizontalBar.offsetLeft)
            const accBackward = ((horizontallyScrolled+1) / (this.horizontalBar.offsetLeft+1));
            console.log("accBackward",accBackward,horizontallyScrolled)

            // Update bar position
            let newBarLeft = startBarLeft + diffX;
            newBarLeft = Math.max(0, Math.min(newBarLeft, maxBarLeft));

            // Update scroll amount
            if (diffX > 0) {
                horizontallyScrolled += diffX * accRatio;
            }else if (diffX < 0) {
                // Calculate a deceleration factor based on how close we are to the start
                const decelerationFactor = Math.max(0.3, newBarLeft / maxBarLeft);
                horizontallyScrolled += diffX * accBackward;
                
                // Ensure we don't scroll past the start
                horizontallyScrolled = Math.max(0, horizontallyScrolled);
            }

            // Update bar style
            this.horizontalBar.style.left = `${newBarLeft}px`;

            // Adjust bar width at the start
            if (newBarLeft === 0) {
                this.horizontalBar.style.width = '80%';
            }


            // Adjust bar width at the end
            if (newBarLeft === maxBarLeft) {
                const newWidth = Math.max(40, this.horizontalScroll.clientWidth / horizontallyScrolled * 100);
                console.log(newWidth);
                this.horizontalBar.style.width = `${newWidth}px`;
            }

            startMouseX = currentMouseX;
            startBarLeft = newBarLeft;

            this.updateGrid();
        };

        const onMouseUp = () => {
            isHorizontalScrolling = false;
            this.prevScrolledHorizontal = horizontallyScrolled;
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        };

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    });
}