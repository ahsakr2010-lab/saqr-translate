/**
 * Saqr Bridge - جسر الربط بين واجهة التصميم والمحرك البرمجي
 */

document.addEventListener('DOMContentLoaded', () => {
    console.log('Saqr Bridge Loaded Successfully!');

    const sourceLangSelect = document.getElementById('globalSourceLang');
    const targetLangSelect = document.getElementById('globalTargetLang');
    const textArea = document.getElementById('srcTextarea');

    const triggerLiveTranslation = () => {
        if (textArea && textArea.value.trim()) {
            if (typeof window.handleInstantTextTranslation === 'function') {
                window.handleInstantTextTranslation();
            }
        }
    };

    if (sourceLangSelect) {
        sourceLangSelect.addEventListener('change', triggerLiveTranslation);
    }

    if (targetLangSelect) {
        targetLangSelect.addEventListener('change', triggerLiveTranslation);
    }

    const legacyTranslateBtn = document.querySelector('#translate-btn') || document.querySelector('button');
    if (legacyTranslateBtn) {
        legacyTranslateBtn.addEventListener('click', () => {
            console.log('تم الضغط على زر الترجمة الفورية');
            triggerLiveTranslation();
        });
    }
});