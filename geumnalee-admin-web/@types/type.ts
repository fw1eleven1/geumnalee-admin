type TapasType = {
	id: number;
	type: 'main' | 'side';
	name: string;
	price: number;
	img: string;
	desc: string;
};

type TapasMainType = TapasType & {
	type: 'main';
};

type TapasSideType = TapasType & {
	type: 'side';
};
