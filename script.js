// عناصر الـ DOM
const imageInput = document.getElementById('imageInput');
const editorSection = document.getElementById('editorSection');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const brightnessSlider = document.getElementById('brightnessSlider');
const contrastSlider = document.getElementById('contrastSlider');
const saturationSlider = document.getElementById('saturationSlider');
const brightnessValue = document.getElementById('brightnessValue');
const contrastValue = document.getElementById('contrastValue');
const saturationValue = document.getElementById('saturationValue');
const resetBtn = document.getElementById('resetBtn');
const downloadBtn = document.getElementById('downloadBtn');

// متغيرات
let originalImage = null;
let currentImage = null;

// التعامل مع رفع الصور
imageInput.addEventListener('change', handleImageUpload);

function handleImageUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
            originalImage = img;
            currentImage = img;
            
            // ضبط حجم Canvas
            canvas.width = img.width;
            canvas.height = img.height;
            
            // رسم الصورة
            drawImage();
            
            // إظهار قسم المحرر
            editorSection.style.display = 'block';
            
            // إعادة تعيين المنزلقات
            brightnessSlider.value = 100;
            contrastSlider.value = 100;
            saturationSlider.value = 100;
            updateSliderValues();
        };
        img.src = event.target.result;
    };
    reader.readAsDataURL(file);
}

// رسم الصورة مع المرشحات
function drawImage() {
    if (!currentImage) return;

    const brightness = brightnessSlider.value / 100;
    const contrast = contrastSlider.value / 100;
    const saturation = saturationSlider.value / 100;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.filter = `brightness(${brightness}) contrast(${contrast}) saturate(${saturation})`;
    ctx.drawImage(currentImage, 0, 0);
}

// تحديث قيم المنزلقات
function updateSliderValues() {
    brightnessValue.textContent = brightnessSlider.value + '%';
    contrastValue.textContent = contrastSlider.value + '%';
    saturationValue.textContent = saturationSlider.value + '%';
}

// استماع لتغييرات المنزلقات
brightnessSlider.addEventListener('input', () => {
    updateSliderValues();
    drawImage();
});

contrastSlider.addEventListener('input', () => {
    updateSliderValues();
    drawImage();
});

saturationSlider.addEventListener('input', () => {
    updateSliderValues();
    drawImage();
});

// إعادة تعيين المرشحات
resetBtn.addEventListener('click', () => {
    brightnessSlider.value = 100;
    contrastSlider.value = 100;
    saturationSlider.value = 100;
    updateSliderValues();
    drawImage();
});

// تحميل الصورة المعدلة
downloadBtn.addEventListener('click', () => {
    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = 'edited-image.png';
    link.click();
});

// دعم السحب والإفلات
const uploadArea = document.querySelector('.upload-area');

uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.style.borderColor = '#ec4899';
});

uploadArea.addEventListener('dragleave', () => {
    uploadArea.style.borderColor = '#6366f1';
});

uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.style.borderColor = '#6366f1';
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        imageInput.files = files;
        handleImageUpload({ target: { files: files } });
    }
});

// فتح مربع الملفات عند النقر على منطقة الرفع
uploadArea.addEventListener('click', () => {
    imageInput.click();
});
