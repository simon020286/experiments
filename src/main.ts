import './style.css'

const gra = function(min: number, max: number) {
	return Math.random() * (max - min) + min;
}

const ul = document.querySelector<HTMLUListElement>('ul')!;

for (let i = 0; i < 10; i++) {
	const li = document.createElement('li');
	li.style.minHeight = `${gra(30, 80)}px`;
	li.innerHTML = `${i}`;
	ul.appendChild(li);
}
