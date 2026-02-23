// src/lib/validation.js

/**
 * 辞書エントリのバリデーションルール
 */
export const DICT_VALIDATION = {
    wordMinLength: 1,
    wordMaxLength: 50,
    readingMinLength: 1,
    readingMaxLength: 100,
    // 禁止文字パターン（制御文字など）
    forbiddenPattern: /[\x00-\x1F\x7F]/,
};

/**
 * 辞書エントリをバリデートする
 * @param {string} word - 単語
 * @param {string} reading - 読み
 * @returns {{ valid: boolean, errors: string[] }}
 */
export function validateDictEntry(word, reading) {
    const errors = [];

    // 単語のバリデーション
    if (!word || typeof word !== "string") {
        errors.push("単語を入力してください");
    } else {
        const trimmedWord = word.trim();
        if (trimmedWord.length < DICT_VALIDATION.wordMinLength) {
            errors.push("単語を入力してください");
        }
        if (trimmedWord.length > DICT_VALIDATION.wordMaxLength) {
            errors.push(`単語は${DICT_VALIDATION.wordMaxLength}文字以内で入力してください`);
        }
        if (DICT_VALIDATION.forbiddenPattern.test(trimmedWord)) {
            errors.push("単語に使用できない文字が含まれています");
        }
    }

    // 読みのバリデーション
    if (!reading || typeof reading !== "string") {
        errors.push("読みを入力してください");
    } else {
        const trimmedReading = reading.trim();
        if (trimmedReading.length < DICT_VALIDATION.readingMinLength) {
            errors.push("読みを入力してください");
        }
        if (trimmedReading.length > DICT_VALIDATION.readingMaxLength) {
            errors.push(`読みは${DICT_VALIDATION.readingMaxLength}文字以内で入力してください`);
        }
        if (DICT_VALIDATION.forbiddenPattern.test(trimmedReading)) {
            errors.push("読みに使用できない文字が含まれています");
        }
    }

    return {
        valid: errors.length === 0,
        errors,
    };
}

/**
 * 文字数制限の値をバリデートする
 * @param {number} value - 文字数
 * @param {number} min - 最小値
 * @param {number} max - 最大値
 * @returns {{ valid: boolean, clampedValue: number }}
 */
export function validateCharLimit(value, min = 10, max = 200) {
    const numValue = Number(value);

    if (isNaN(numValue)) {
        return { valid: false, clampedValue: min };
    }

    const clampedValue = Math.max(min, Math.min(max, Math.floor(numValue)));

    return {
        valid: numValue === clampedValue,
        clampedValue,
    };
}
