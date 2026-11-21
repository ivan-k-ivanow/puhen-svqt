import { createHash } from 'node:crypto';

// Meta Conversions API – изпраща Purchase директно от сървъра.
// Работи само ако са зададени META_PIXEL_ID и META_CAPI_TOKEN
// и ако клиентът е приел бисквитките на сайта.

const GRAPH_VERSION = process.env.META_GRAPH_VERSION || 'v26.0';
const GRAPH_URL = process.env.META_GRAPH_URL || 'https://graph.facebook.com';
const SITE_URL = process.env.SITE_URL || 'https://puhensvqt.com';

function sha256(value) {
    return createHash('sha256').update(value).digest('hex');
}

function hashed(value) {
    return value ? [sha256(value)] : undefined;
}

// 0888 123 456 / +359 888 123 456 -> 359888123456
function normalizePhone(phone) {
    let digits = String(phone || '').replace(/\D/g, '');

    if (digits.startsWith('00')) digits = digits.slice(2);
    if (digits.startsWith('0')) digits = `359${digits.slice(1)}`;
    if (digits.startsWith('3590')) digits = `359${digits.slice(4)}`;

    return digits || null;
}

function normalizeText(value) {
    const text = String(value || '').trim().toLowerCase().replace(/[\s\p{P}]/gu, '');
    return text || null;
}

function splitName(fullName) {
    const parts = String(fullName || '').trim().split(/\s+/).filter(Boolean);
    return { first: parts[0] ?? '', last: parts.length > 1 ? parts[parts.length - 1] : '' };
}

// Ако няма бисквитка _fbc, но клиентът е дошъл от реклама с fbclid.
function buildFbc(attribution) {
    if (attribution.fbc) return attribution.fbc;
    if (!attribution.fbclid) return undefined;

    const time = Number(attribution.fbclid_ts) || Date.now();
    return `fb.1.${time}.${attribution.fbclid}`;
}

export function buildPurchaseEvent(order, request = {}) {
    const attribution = order.attribution ?? {};
    const item = order.items?.[0];
    const { first, last } = splitName(order.customerName);
    const city = String(order.deliveryAddress || '').split(',')[0];
    const value = Number(order.total) || 0;

    const userData = {
        ph: hashed(normalizePhone(order.customerPhone)),
        em: hashed(order.customerEmail ? order.customerEmail.trim().toLowerCase() : null),
        fn: hashed(normalizeText(first)),
        ln: hashed(normalizeText(last)),
        ct: hashed(normalizeText(city)),
        country: hashed('bg'),
        external_id: hashed(order.id),
        client_ip_address: request.ip || undefined,
        client_user_agent: request.userAgent || undefined,
        fbp: attribution.fbp || undefined,
        fbc: buildFbc(attribution),
    };

    // Махаме празните полета – Meta не ги иска.
    Object.keys(userData).forEach(key => userData[key] === undefined && delete userData[key]);

    return {
        event_name: 'Purchase',
        event_time: Math.floor(new Date(order.createdAt ?? Date.now()).getTime() / 1000),
        // Същият ID като на пиксела в браузъра – Meta брои поръчката веднъж.
        event_id: `order-${order.id}`,
        action_source: 'website',
        event_source_url: request.url || `${SITE_URL}/order`,
        user_data: userData,
        custom_data: {
            currency: 'EUR',
            value,
            content_ids: item?.productId ? [item.productId] : undefined,
            content_name: item?.name,
            content_type: 'product',
            num_items: item?.quantity ?? 1,
            order_id: `PS-${String(order.number).padStart(4, '0')}`,
        },
    };
}

async function sendPurchase(order, request) {
    const pixelId = process.env.META_PIXEL_ID;
    const token = process.env.META_CAPI_TOKEN;

    if (!pixelId || !token) {
        return;
    }

    // Без съгласие за бисквитки не изпращаме нищо на Meta.
    if (order.attribution?.consent !== 'accepted') {
        return;
    }

    const body = {
        data: [buildPurchaseEvent(order, request)],
        access_token: token,
    };

    if (process.env.META_TEST_EVENT_CODE) {
        body.test_event_code = process.env.META_TEST_EVENT_CODE;
    }

    const response = await fetch(`${GRAPH_URL}/${GRAPH_VERSION}/${pixelId}/events`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(8000),
    });

    if (!response.ok) {
        const text = await response.text();
        throw new Error(`Meta CAPI ${response.status}: ${text.slice(0, 300)}`);
    }
}

export default {
    sendPurchase,
};
