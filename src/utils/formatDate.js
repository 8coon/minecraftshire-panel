import {intToStrFormatted} from 'minecraftshire-utils/src/dateutils/dateutils';


const MONTHS = ['Января', 'Февраля', 'Марта', 'Апреля', 'Мая', 'Июня', 'Июля', 'Августа', 'Сентября',
                'Октября', 'Ноября', 'Декабря'];

const formatDateFull = d => `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getYear()}` +
                            ` в ${intToStrFormatted(d.getHours())}:${intToStrFormatted(d.getMinutes())}`;

const formatDateShort = d => `${d.getDate()} ${MONTHS[d.getMonth()]}` +
                             ` в ${intToStrFormatted(d.getHours())}:${intToStrFormatted(d.getMinutes())}`;

/**
 * Форматирует дату
 * @param {Date} date
 */
export default (date) => {
    const now = new Date();

    if (now.getMonth() === date.getMonth() && now.getYear() === date.getYear()) {
        if (now.getDate() === date.getDate()) {
            return 'Сегодня';
        }

        if (now.getDate() - 1 === date.getDate()) {
            return 'Вчера';
        }
    }

    if (now.getYear() === date.getYear()) {
        return formatDateShort(date);
    }

    return formatDateFull(date);
}
