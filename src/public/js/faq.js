const items = document.querySelectorAll('.faq-item');

items.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    question.addEventListener('click', () => {

        items.forEach(otherItem => {
            if (otherItem !== item) {
                otherItem.classList.remove('active');
                otherItem.querySelector('.faq-answer').style.height = '0';
            }
        });

        const isOpen = item.classList.contains('active');

        item.classList.toggle('active');

        answer.style.height = isOpen
            ? '0'
            : `${answer.scrollHeight}px`;
    });
});