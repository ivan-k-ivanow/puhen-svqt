import { useEffect, useMemo, useState } from 'react';
import { getProductionOrders } from '../../../services/orders';
import { formatDate, daysUntil } from '../../../utils/orders';
import '../orders/orders.css';
import './Production.css';

// Към коя колона отива бройката според статуса на поръчката.
// Сървърът връща само потвърдените поръчки, които още не са изпратени –
// новите не влизат, докато не бъдат потвърдени.
const BUCKETS = {
    CONFIRMED: 'todo',
    IN_PROGRESS: 'making',
    READY: 'ready',
};

const COUNTS = [
    { key: 'todo', label: 'за правене' },
    { key: 'making', label: 'в изработка' },
    { key: 'ready', label: 'готови' },
];

function isPending(bucket) {
    return bucket === 'todo' || bucket === 'making';
}

function pieces(count) {
    return `${count} бр.`;
}

function days(count) {
    return `${count} ${count === 1 ? 'ден' : 'дни'}`;
}

function dueInfo(deadline) {
    if (!deadline) {
        return { text: 'Без срок', date: '', className: 'due due--none' };
    }

    const left = daysUntil(deadline);
    const date = formatDate(deadline).slice(0, 5);

    if (left < 0) return { text: `Просрочен с ${days(-left)}`, date, className: 'due due--late' };
    if (left === 0) return { text: 'Днес', date, className: 'due due--late' };
    if (left <= 3) return { text: `След ${days(left)}`, date, className: 'due due--soon' };

    return { text: `След ${left} дни`, date, className: 'due' };
}

// Поръчките без срок отиват най-отдолу.
function byDeadline(a, b) {
    if (!a && !b) return 0;
    if (!a) return 1;
    if (!b) return -1;
    return new Date(a) - new Date(b);
}

// Групира артикулите от поръчките по продукт и брои бройките по колони.
function groupByProduct(orders) {
    const groups = new Map();

    for (const order of orders) {
        const bucket = BUCKETS[order.status];
        if (!bucket) continue;

        for (const item of order.items) {
            const key = item.productId || `name:${item.name.trim().toLowerCase()}`;
            const quantity = item.quantity || 1;

            if (!groups.has(key)) {
                groups.set(key, {
                    key,
                    name: item.product?.name || item.name,
                    image: item.product?.images?.[0]?.url || '',
                    hasPersonalization: (item.product?._count?.fields ?? 0) > 0,
                    todo: 0,
                    making: 0,
                    ready: 0,
                    urgent: 0,
                    deadlines: [],
                });
            }

            const group = groups.get(key);
            group[bucket] += quantity;

            if (isPending(bucket)) {
                group.deadlines.push(order.deadline);

                // Бройки със срок до 3 дни (и просрочените), които още не са готови.
                if (order.deadline && daysUntil(order.deadline) <= 3) {
                    group.urgent += quantity;
                }
            }
        }
    }

    const rows = [...groups.values()].map(group => {
        const pending = group.todo + group.making;
        const total = pending + group.ready;
        const nextDeadline = pending > 0 ? [...group.deadlines].sort(byDeadline)[0] : null;

        return {
            ...group,
            pending,
            total,
            done: group.ready,
            nextDeadline,
            due: pending > 0
                ? dueInfo(nextDeadline)
                : { text: 'Всичко е готово', date: '', className: 'due pr-all-done' },
        };
    });

    // Първо продуктите с най-много за правене, после по най-близък срок.
    return rows.sort((a, b) =>
        b.pending - a.pending || byDeadline(a.nextDeadline, b.nextDeadline)
    );
}

export default function Production() {
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        async function load() {
            try {
                setOrders(await getProductionOrders());
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        }

        load();
    }, []);

    const rows = useMemo(() => groupByProduct(orders), [orders]);

    const totals = useMemo(() => {
        const sum = key => rows.reduce((total, row) => total + row[key], 0);
        return { todo: sum('todo'), making: sum('making'), ready: sum('ready'), urgent: sum('urgent') };
    }, [rows]);

    return (
        <div className="orders-page production-page">
            <div className="pr-top">
                <div>
                    <h2>Изработка</h2>
                    {!isLoading && !error && (
                        <p className="orders-muted">
                            {pieces(totals.todo)} за правене · {totals.making} в изработка · {totals.ready} готови за пращане
                        </p>
                    )}
                </div>

                {totals.urgent > 0 && (
                    <span className="pr-urgent">{pieces(totals.urgent)} със срок до 3 дни</span>
                )}
            </div>

            {error && <p className="orders-message orders-message--error">{error}</p>}

            <div className="orders-card pr-table">
                <div className="pr-row pr-row--head" aria-hidden="true">
                    <span>Продукт</span>
                    <span className="pr-head-num">За правене</span>
                    <span className="pr-head-num">В изработка</span>
                    <span className="pr-head-num">Готови</span>
                    <span>Напредък</span>
                    <span>Най-близък срок</span>
                </div>

                {isLoading && <p className="pr-empty">Зареждане...</p>}

                {!isLoading && !error && rows.length === 0 && (
                    <p className="pr-empty">Няма поръчки за изработка.</p>
                )}

                {rows.map(row => (
                    <div className="pr-row" key={row.key}>
                        <div className="pr-product">
                            {row.image ? (
                                <img src={row.image} alt="" className="pr-thumb" loading="lazy" />
                            ) : (
                                <span className="pr-thumb pr-thumb--empty" aria-hidden="true">
                                    {row.name.charAt(0)}
                                </span>
                            )}
                            <div className="pr-name">
                                <b>{row.name}</b>
                                {row.hasPersonalization && <span className="pr-pz">с персонализация</span>}
                                <span className={`pr-due-inline ${row.due.className}`}>
                                    {row.due.text}{row.due.date && ` · ${row.due.date}`}
                                </span>
                            </div>
                        </div>

                        {COUNTS.map(count => (
                            <div
                                key={count.key}
                                className={`pr-num pr-num--${count.key} ${row[count.key] ? '' : 'is-zero'}`}
                            >
                                <b>{row[count.key]}</b>
                                <span className="pr-num-label">{count.label}</span>
                            </div>
                        ))}

                        <div className="pr-progress">
                            <div className="pr-bar" aria-hidden="true">
                                <i style={{ width: `${Math.round((row.done / Math.max(1, row.total)) * 100)}%` }} />
                            </div>
                            <span className="pr-sub">{row.done} от {row.total} готови</span>
                        </div>

                        <div className="pr-due">
                            <span className={row.due.className}>{row.due.text}</span>
                            {row.due.date && <span className="pr-sub">{row.due.date}</span>}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
