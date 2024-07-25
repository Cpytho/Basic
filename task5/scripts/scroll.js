
export let horizontallyScrolled = 0;

export class Scroll {

    constructor(fullCanvas, horizontalBar, horizontalScroll, verticalBar, verticalScroll, miniCanvas) {
        this.fullCanvas = fullCanvas;
        this.horizontalBar = horizontalBar;
        this.horizontalScroll = horizontalScroll;
        this.verticalBar = verticalBar;
        this.verticalScroll = verticalScroll;
        this.miniCanvas = miniCanvas;
        this.init();
        this.prevScrolledHorizontal = 0;

    }

    init() {
        this.updateHorizontalScrollBar();
        this.updateVerticalScrollBar();
    }

    updateGrid() {
        this.miniCanvas.renderCanvasOnScroll();
    }

    // updateHorizontalScrollBar() {

    //     this.horizontalBar.addEventListener('mousedown', (e) => {
    //         e.preventDefault();

    //         let isHorizontalScrolling = true;
    //         let startMouseX = e.clientX;
    //         let startBarLeft = this.horizontalBar.offsetLeft;
            
    //         const onMouseMove = (e) => {
    //             e.preventDefault();
    //             if (isHorizontalScrolling) {
    //                 const currentMouseX = e.clientX;
    //                 let diffX = currentMouseX - startMouseX;
    //                 let accRatio = Math.min(20,(this.horizontalScroll.clientWidth+horizontallyScrolled/2*this.horizontalScroll.clientWidth))
    //                 console.log(startBarLeft)
    //                 startBarLeft = startBarLeft + diffX;
    //                 console.log(startBarLeft)
    //                 let maxBarLeft = this.horizontalScroll.clientWidth - this.horizontalBar.offsetWidth;
                    

    //                 if(diffX>0){
    //                     horizontallyScrolled += diffX*accRatio;
    //                     this.horizontalBar.style.left = `${startBarLeft}px`;
    //                     console.log(this.horizontalBar.style.left)
    //                 }
    //                 else{
    //                     return
    //                 }
    //                 if (startBarLeft < 0) {
    //                     startBarLeft = 0;
    //                     this.horizontalBar.style.width = 0.40 * this.horizontalScroll.clientWidth + 'px';
    //                     // horizontallyScrolled = 0;
    //                     //making the scrollbar of original size on reaching the start again
    //                 }


    //                 // if (this.horizontalBar.offsetLeft+this.horizontalBar.offsetWidth > maxBarLeft) {
    //                 //     startBarLeft = maxBarLeft;

    //                 //     //setting width as per scrolled
    //                 //     this.horizontalBar.style.width = `${this.horizontalScroll.clientWidth / horizontallyScrolled * 100}px`;
    //                 //     this.horizontalBar.style.left = `${startBarLeft / 2}px`;
    //                 //     startBarLeft = startBarLeft / 2;
    //                 //     startMouseX = e.clientX;
    //                 //     this.prevScrolledHorizontal = horizontallyScrolled;
    //                 // }


                 
    //                 startMouseX = currentMouseX
    //                 this.updateGrid();
    //             }

    //         };

    //         const onMouseUp = (e) => {
    //             isHorizontalScrolling = false;
    //             this.prevScrolledHorizontal = horizontallyScrolled;
    //             this.fullCanvas.removeEventListener('mousemove', onMouseMove);
    //             this.fullCanvas.removeEventListener('mouseup', onMouseUp);
    //             this.fullCanvas.removeEventListener('mouseleave', onMouseUp)
    //         };

    //         this.fullCanvas.addEventListener('mousemove', onMouseMove);
    //         this.fullCanvas.addEventListener('mouseup', onMouseUp);
    //         this.fullCanvas.addEventListener('mouseleave', onMouseUp);
    //     });

    // }

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
    
                // Update bar position
                let newBarLeft = startBarLeft + diffX;
                newBarLeft = Math.max(0, Math.min(newBarLeft, maxBarLeft));
    
                // Update scroll amount
                if (diffX > 0) {
                    const accRatio = Math.min(5, (totalContentWidth / 2*this.horizontalScroll.clientWidth));
                    horizontallyScrolled += diffX * accRatio;
                }else if (diffX < 0) {
                    // Calculate a deceleration factor based on how close we are to the start
                    const accBackward = ((horizontallyScrolled+1) / (this.horizontalBar.offsetLeft+1));

                    console.log("accBackward",accBackward,horizontallyScrolled,this.horizontalBar.offsetLeft)
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
                    newBarLeft = maxBarLeft/2;
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
    
    updateVerticalScrollBar() {

        this.verticalBar.addEventListener('mousedown', (e) => {
            e.preventDefault();

            let isVerticalScrolling = true;
            let startMouseY = e.clientY;
            let startBarTop = this.verticalBar.offsetTop;
            let prevBarHeight = this.verticalBar.offsetHeight;

            const onMouseMove = (e) => {
                if (isVerticalScrolling) {
                    const currentMouseY = e.clientY;
                    const diffY = currentMouseY - startMouseY;
                    let newTop = startBarTop + diffY;
                    let maxBarTop = this.verticalScroll.clientHeight - this.verticalBar.offsetHeight;

                    newTop < 0 ? newTop = 0 : "";

                    if (newTop > maxBarTop) {
                        newTop = maxBarTop;
                        this.verticalBar.style.height = `${prevBarHeight * 0.7}px`;
                        this.verticalBar.style.top = `${newTop / 2}px`;
                        startBarTop = newTop / 2;
                        startMouseY = e.clientY;
                        prevBarHeight = prevBarHeight * 0.7;
                    }

                    this.verticalBar.style.top = `${newTop}px`

                }
            };

            const onMouseUp = (e) => {
                isVerticalScrolling = false;
                this.fullCanvas.removeEventListener('mousemove', onMouseMove);
                this.fullCanvas.removeEventListener('mouseup', onMouseUp);
                this.fullCanvas.removeEventListener('mouseleave', onMouseUp);
            };

            this.fullCanvas.addEventListener('mousemove', onMouseMove);
            this.fullCanvas.addEventListener('mouseup', onMouseUp);
            this.fullCanvas.addEventListener('mouseleave', onMouseUp)
        });


    }

}
