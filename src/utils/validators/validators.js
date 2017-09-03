

export default {

    email(value) {
        if (!/.*@.*/.test(value)) {
            return 'Неверный формат Email-адреса!';
        }

        return true;
    },

    username(value) {
        if (value.length < 4) {
            return `Минимальная длина — 4 символа!`;
        }

        if (value.length > 30) {
            return `Максимальная длина — 30 символов!`
        }

        if (!/[a-zA-Z0-9._=[\]]+/.test(value)) {
            return 'Разрешены только символы: a-z A-Z 0-9 ._=[]';
        }

        return true;
    },

    password(value) {
        if (value.length < 4) {
            return `Минимальная длина — 4 символа!`;
        }

        if (value.length > 30) {
            return `Максимальная длина — 30 символов!`
        }

        return true;
    },

    name(value) {
        if (value.length < 2) {
            return `Минимальная длина — 2 символа!`;
        }

        if (value.length > 20) {
            return `Максимальная длина — 20 символов!`
        }

        if (!/[a-zA-Z]+/.test(value)) {
            return 'Разрешены только символы: a-z A-Z';
        }

        if (value.includes('  ')) {
            return 'Допустимо использование не более двух пробелов подряд!';
        }

        return true;
    }

}
