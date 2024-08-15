import './style.css'

const gra = function(min: number, max: number) {
	return Math.random() * (max - min) + min;
}

const ul = document.querySelector<HTMLUListElement>('ul')!;
const text = document.querySelector<HTMLDivElement>('#log')!;

const log = function() {
	text.innerHTML = `Scroll top: ${Math.ceil(ul.scrollTop)}<br>
	Scroll height: ${ul.scrollHeight}<br>
	End: ${ul.scrollHeight - ul.offsetHeight} < ${Math.round(ul.scrollTop)}<br>
	End: ${ul.scrollHeight - ul.offsetHeight <= Math.round(ul.scrollTop)}`;
}

ul.addEventListener('scroll', log);

for (let i = 0; i < 15; i++) {
	const li = document.createElement('li');
	li.style.minHeight = `${gra(60, 80)}px`;
	li.innerHTML = `${i}`;
	ul.appendChild(li);
}

log();
