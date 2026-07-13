// عناصر الـ DOM
const imageInput = document.getElementById('imageInput');
const uploadArea = document.getElementById('uploadArea');
const previewCanvas = document.getElementById('previewCanvas');
const ctx = previewCanvas.getContext('2d');
const stadiumSelect = document.getElementById('stadium');
const crowdSlider = document.getElementById('crowd');
const positionSelect = document.getElementById('position');
const brightnessSlider = document.getElementById('brightness');
const cheeringSlider = document.getElementById('cheering');
const processBtn = document.getElementById('processBtn');
const downloadBtn = document.getElementById('downloadBtn');
const resetBtn = document.getElementById('resetBtn');

// متغيرات
let uploadedImage = null;
let stadiumBackground = null;
let crowdEmojis = [];

// نصوص الهتاف بالعربية
const cheeringTexts = {
    1: '👏',
    2: '👏 الله أكبر 👏',
    3: '🎉 يا جماعة! 🎉 الله أكبر!',
    4: '🔥 الله أكبر الله أكبر! 🔥 يا حلووو!',
    5: '🎊 الله أكبر! الله أكبر! 🎊 واااه يا حلو! 🔥 يالا يالا! 🌟'
};

// خيارات الملاعب والألوان
const stadiums = {
    soccer: {
        name: 'ملعب كرة القدم 🏟️',
        colors: ['#0d4527', '#166534', '#15803d', '#22c55e'],
        crowd: '👥🎉🙌👏'
    },
    basketball: {
        name: 'ملعب كرة السلة 🏀',
        colors: ['#1f1f1f', '#404040', '#525252', '#737373'],
        crowd: '👥🎊🙌👏'
    },
    cricket: {
        name: 'ملعب الكريكيت 🏏',
        colors: ['#1e40af', '#3b82f6', '#60a5fa', '#93c5fd'],
        crowd: '👥🎉🙌👏'
    },
    concert: {
        name: 'حفل موسيقي 🎤',
        colors: ['#1e1b4b', '#312e81', '#4c1d95', '#6d28d9'],
        crowd: '👥🎶🙌👏'
    }
};

// التعامل مع رفع الصور
imageInput.addEventListener('change', handleImageUpload);
uploadArea.addEventListener('click', () => imageInput.click());

// دعم السحب والإفلات
uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.style.opacity = '0.7';
});

uploadArea.addEventListener('dragleave', () => {
    uploadArea.style.opacity = '1';
});

uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.style.opacity = '1';
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        handleImageUpload({ target: { files: files } });
    }
});

function handleImageUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
            uploadedImage = img;
            console.log('✅ تم تحميل الصورة بنجاح');
            processBtn.disabled = false;
            processBtn.style.opacity = '1';
        };
        img.src = event.target.result;
    };
    reader.readAsDataURL(file);
}

// معالجة خيارات التحديث
crowdSlider.addEventListener('input', updateCrowdValue);
cheeringSlider.addEventListener('input', updateCheeringValue);

function updateCrowdValue() {
    const value = crowdSlider.value;
    const labels = ['منخفضة', 'قليلة', 'متوسطة', 'عالية', 'جداً عالية'];
    document.getElementById('crowdValue').textContent = labels[value - 1];
}

function updateCheeringValue() {
    const value = cheeringSlider.value;
    const labels = ['هادئ', 'خفيف', 'عادي', 'عالي', 'مجنون'];
    document.getElementById('cheeringValue').textContent = labels[value - 1];
}

// رسم خلفية الملعب
function drawStadiumBackground(width, height, stadiumType) {
    const stadium = stadiums[stadiumType];
    const colors = stadium.colors;
    
    // رسم تدرج لوني للملعب
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, colors[0]);
    gradient.addColorStop(0.25, colors[1]);
    gradient.addColorStop(0.75, colors[2]);
    gradient.addColorStop(1, colors[3]);
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    
    // رسم خطوط الملعب
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 2;
    
    // خطوط أفقية
    for (let i = 0; i < height; i += 40) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(width, i);
        ctx.stroke();
    }
    
    // خطوط رأسية
    for (let i = 0; i < width; i += 40) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, height);
        ctx.stroke();
    }
}

// رسم الجمهور المحتفل
function drawCrowd(width, height, crowdLevel, position) {
    const crowdDensity = parseInt(crowdLevel);
    const stadium = stadiums[stadiumSelect.value];
    
    // رسم دوائر الجمهور
    const crowdCount = crowdDensity * 8;
    
    for (let i = 0; i < crowdCount; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height * 0.7; // الجمهور في الأعلى والأوسط
        
        // تجنب المنطقة الوسطية حيث سيكون الشخص
        if (position === 'center' && x > width * 0.3 && x < width * 0.7 && y > height * 0.2 && y < height * 0.7) {
            continue;
        }
        
        // رسم رأس الشخص (دائرة)
        ctx.fillStyle = `rgba(255, 200, 100, ${0.3 + crowdDensity * 0.1})`;
        ctx.beginPath();
        ctx.arc(x, y, 8, 0, Math.PI * 2);
        ctx.fill();
        
        // رسم جسم الشخص
        ctx.fillRect(x - 5, y + 8, 10, 15);
        
        // إضافة يدين مرفوعة (احتفالي)
        ctx.fillRect(x - 12, y + 5, 6, 20);
        ctx.fillRect(x + 6, y + 5, 6, 20);
    }
    
    // رسم نصوص هتاف عشوائية
    const cheerLevel = parseInt(document.getElementById('cheering').value);
    if (cheerLevel > 1) {
        ctx.font = 'bold 14px Arial';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        
        for (let i = 0; i < cheerLevel * 2; i++) {
            const x = Math.random() * width;
            const y = Math.random() * height * 0.5;
            
            const cheerTexts = ['الله أكبر!', 'يا حلو!', 'كويس!', '👏', '🔥', '🎉'];
            const text = cheerTexts[Math.floor(Math.random() * cheerTexts.length)];
            
            ctx.fillText(text, x, y);
        }
    }
}

// رسم الشخص من الصورة المحملة
function drawPersonFromImage(width, height, position) {
    if (!uploadedImage) return;
    
    // حساب حجم الشخص ليناسب الملعب
    const maxWidth = width * 0.25;
    const maxHeight = height * 0.4;
    
    const imageRatio = uploadedImage.width / uploadedImage.height;
    let personWidth, personHeight;
    
    if (imageRatio > maxWidth / maxHeight) {
        personWidth = maxWidth;
        personHeight = maxWidth / imageRatio;
    } else {
        personHeight = maxHeight;
        personWidth = maxHeight * imageRatio;
    }
    
    // حساب الموضع بناءً على الخيار المختار
    let personX, personY;
    
    switch(position) {
        case 'center':
            personX = (width - personWidth) / 2;
            personY = (height - personHeight) / 2 - 30;
            break;
        case 'left':
            personX = width * 0.15;
            personY = height * 0.4;
            break;
        case 'right':
            personX = width * 0.6;
            personY = height * 0.4;
            break;
        case 'top':
            personX = (width - personWidth) / 2;
            personY = height * 0.1;
            break;
        default:
            personX = (width - personWidth) / 2;
            personY = (height - personHeight) / 2;
    }
    
    // رسم الشخص
    ctx.drawImage(uploadedImage, personX, personY, personWidth, personHeight);
    
    // إضافة إضاءة حول الشخص
    ctx.shadowColor = 'rgba(255, 215, 0, 0.8)';
    ctx.shadowBlur = 30;
    ctx.strokeStyle = 'rgba(255, 215, 0, 0.5)';
    ctx.lineWidth = 3;
    ctx.strokeRect(personX - 5, personY - 5, personWidth + 10, personHeight + 10);
}

// المعالجة الرئيسية
processBtn.addEventListener('click', () => {
    if (!uploadedImage) {
        alert('يرجى اختيار صورة أولاً!');
        return;
    }
    
    const width = previewCanvas.width;
    const height = previewCanvas.height;
    
    // مسح الـ Canvas
    ctx.clearRect(0, 0, width, height);
    
    // رسم الملعب
    const stadiumType = stadiumSelect.value;
    drawStadiumBackground(width, height, stadiumType);
    
    // رسم الجمهور
    const crowdLevel = crowdSlider.value;
    const position = positionSelect.value;
    drawCrowd(width, height, crowdLevel, position);
    
    // رسم الشخص
    drawPersonFromImage(width, height, position);
    
    // إظهار رسالة النجاح والهتاف
    const cheeringLevel = cheeringSlider.value;
    const cheerMessage = cheeringTexts[cheeringLevel];
    alert(`🎉 تم المعالجة! ${cheerMessage}`);
    
    // تفعيل زر التحميل
    downloadBtn.disabled = false;
    downloadBtn.style.opacity = '1';
});

// تحميل الصورة
downloadBtn.addEventListener('click', () => {
    const link = document.createElement('a');
    link.href = previewCanvas.toDataURL('image/png');
    link.download = `stadium-photo-${Date.now()}.png`;
    link.click();
    alert('✅ تم تحميل الصورة بنجاح!');
});

// إعادة تعيين
resetBtn.addEventListener('click', () => {
    imageInput.value = '';
    uploadedImage = null;
    ctx.clearRect(0, 0, previewCanvas.width, previewCanvas.height);
    processBtn.disabled = true;
    downloadBtn.disabled = true;
    processBtn.style.opacity = '0.5';
    downloadBtn.style.opacity = '0.5';
    crowdSlider.value = 3;
    cheeringSlider.value = 3;
    updateCrowdValue();
    updateCheeringValue();
    console.log('🔄 تم إعادة التعيين');
});

// تهيئة القيم الأولية
updateCrowdValue();
updateCheeringValue();
processBtn.disabled = true;
downloadBtn.disabled = true;
processBtn.style.opacity = '0.5';
downloadBtn.style.opacity = '0.5';
