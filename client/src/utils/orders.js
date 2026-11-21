// Етикети и помощни функции за поръчките.
// Стойностите (NEW, ECONT …) са същите като enum-ите в prisma/schema.prisma.

export const STATUS_FLOW = [
    'NEW',
    'CONFIRMED',
    'IN_PROGRESS',
    'READY',
    'SHIPPED',
    'DELIVERED',
];

export const STATUSES = [...STATUS_FLOW, 'CANCELLED'];

// Поръчки, по които вече няма работа.
export const CLOSED_STATUSES = ['SHIPPED', 'DELIVERED', 'CANCELLED'];

export const STATUS_LABELS = {
    NEW: 'Нова',
    CONFIRMED: 'Потвърдена',
    IN_PROGRESS: 'В изработка',
    READY: 'Готова',
    SHIPPED: 'Изпратена',
    DELIVERED: 'Доставена',
    CANCELLED: 'Отказана',
};

// Множествено число за табовете в списъка.
export const STATUS_TAB_LABELS = {
    NEW: 'Нови',
    CONFIRMED: 'Потвърдени',
    IN_PROGRESS: 'В изработка',
    READY: 'Готови',
    SHIPPED: 'Изпратени',
    DELIVERED: 'Доставени',
    CANCELLED: 'Отказани',
};

// Текст на бутона за преминаване към съответния статус.
export const NEXT_STEP_LABELS = {
    CONFIRMED: 'Потвърди поръчката',
    IN_PROGRESS: 'Започни изработката',
    READY: 'Маркирай като готова',
    SHIPPED: 'Маркирай като изпратена',
    DELIVERED: 'Маркирай като доставена',
};

export const CHANNEL_LABELS = {
    INSTAGRAM: 'Instagram',
    FACEBOOK: 'Facebook',
    TIKTOK: 'TikTok',
    WEBSITE: 'Сайт',
    PHONE: 'Телефон',
    OTHER: 'Друго',
};

export const COURIER_LABELS = {
    ECONT: 'Еконт',
    SPEEDY: 'Спиди',
    PICKUP: 'Лично вземане',
};

export const PAYMENT_LABELS = {
    CASH_ON_DELIVERY: 'Наложен платеж',
    BANK_TRANSFER: 'Банков превод',
    CASH: 'В брой',
};

export function statusClass(status) {
    return `order-status order-status--${status.toLowerCase().replace('_', '-')}`;
}

export function formatOrderNumber(number) {
    return `ПС-${String(number).padStart(4, '0')}`;
}

export function formatMoney(value) {
    return `${Number(value || 0).toFixed(2).replace('.', ',')} €`;
}

// Срокът се пази като дата без час (2026-11-21T00:00:00.000Z).
export function toDateInput(value) {
    return value ? String(value).slice(0, 10) : '';
}

export function formatDate(value) {
    if (!value) return '';

    const [year, month, day] = toDateInput(value).split('-');
    return `${day}.${month}.${year}`;
}

export function formatDateTime(value) {
    return new Date(value).toLocaleString('bg-BG', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

export function daysUntil(value) {
    const [year, month, day] = toDateInput(value).split('-').map(Number);
    const today = new Date();

    const deadline = Date.UTC(year, month - 1, day);
    const todayUtc = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());

    return Math.round((deadline - todayUtc) / 86400000);
}

function plural(count) {
    return count === 1 ? 'ден' : 'дни';
}

// Текст и цвят за крайния срок.
export function deadlineInfo(order) {
    if (!order.deadline) {
        return { text: 'Без срок', date: '', className: 'due due--none' };
    }

    const date = formatDate(order.deadline);

    if (CLOSED_STATUSES.includes(order.status)) {
        return { text: date, date: '', className: 'due due--done' };
    }

    const days = daysUntil(order.deadline);

    if (days < 0) {
        return { text: `Просрочена ${-days} ${plural(-days)}`, date, className: 'due due--late' };
    }

    if (days === 0) {
        return { text: 'Днес', date, className: 'due due--late' };
    }

    if (days <= 3) {
        return { text: `След ${days} ${plural(days)}`, date, className: 'due due--soon' };
    }

    return { text: `След ${days} дни`, date, className: 'due' };
}

export const CONTACT_METHOD_LABELS = {
    CALL: 'Обаждане',
    VIBER: 'Viber',
    MESSENGER: 'Messenger',
};

// Телефон в международен формат за линковете tel: и Viber.
export function phoneToInternational(phone) {
    const digits = String(phone || '').replace(/[^\d+]/g, '');

    if (digits.startsWith('+')) return digits;
    if (digits.startsWith('00')) return `+${digits.slice(2)}`;
    if (digits.startsWith('0')) return `+359${digits.slice(1)}`;

    return digits;
}

// Кратко описание откъде е дошъл клиентът (реклама или UTM).
export function attributionLabel(attribution) {
    if (!attribution) return '';

    const source = (attribution.utm_source || '').toLowerCase();

    if (attribution.fbclid || attribution.fbc || ['facebook', 'fb', 'instagram', 'ig', 'meta'].includes(source)) {
        return 'Facebook / Instagram реклама';
    }

    if (attribution.ttclid || source === 'tiktok') return 'TikTok реклама';
    if (attribution.gclid || source === 'google') return 'Google';
    if (attribution.utm_source) return attribution.utm_source;

    return '';
}
