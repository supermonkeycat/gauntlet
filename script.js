document.getElementById('generate').addEventListener('click', function() {
    const mainImage = document.getElementById('mainImage').files[0];
    const subImages = [
        document.getElementById('subImage1').files[0],
        document.getElementById('subImage2').files[0],
        document.getElementById('subImage3').files[0],
        document.getElementById('subImage4').files[0],
        document.getElementById('subImage5').files[0],
    ];

    // Checks if all images are uploaded
    if (!mainImage || subImages.some(img => !img)) {
        alert('Please upload all images.');
        return;
    }

    const spinner = document.getElementById('spinner');
    const resultDiv = document.getElementById('result');
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    const size = 300;
    canvas.width = size * 3;
    canvas.height = size * 3;

    // draws image
    const drawImage = (image, x, y, width, height) => {
        return new Promise(resolve => {
            const img = new Image();
            img.src = URL.createObjectURL(image);
            img.onload = () => {
                ctx.drawImage(img, x, y, width, height);
                resolve();
            };
            img.onerror = () => {
                console.error(`Failed to load image: ${img.src}`);
                resolve(); // Proceed with next images even if one fails
            };
        });
    };

    // text
    const drawText = (text, x, y, width, height) => {
        ctx.font = 'bold 30px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 4;
        ctx.strokeText(text, x + width / 2, y + height - 20);
        ctx.fillText(text, x + width / 2, y + height - 20);
    };

    // Main rendering function
    const render = async () => {
        try {
            spinner.classList.remove('hidden');

            // Draw images in the specified layout
            await drawImage(mainImage, 0, 0, size * 2, size * 2);
            await drawImage(subImages[0], size * 2, 0, size, size); // Top-right corner
            await drawImage(subImages[1], size * 2, size, size, size); // Center-right
            await drawImage(subImages[2], size * 2, size * 2, size, size); // Bottom-right corner
            await drawImage(subImages[3], size * 1, size * 2, size, size); // Bottom-middle
            await drawImage(subImages[4], size * 0, size * 2, size, size); // Bottom-left corner

            // Draw text
            drawText('Start', size * 2, 0, size, size);
            drawText('Finish', size * 0, size * 2, size, size);

            // Show the result and provide download link
            resultDiv.classList.remove('hidden');
            const downloadLink = document.getElementById('downloadLink');
            downloadLink.href = canvas.toDataURL('image/png');

        } catch (error) {
            console.error('Error during rendering:', error);
        } finally {
            spinner.classList.add('hidden');
        }
    };

    // Execute the rendering function
    render();
});
