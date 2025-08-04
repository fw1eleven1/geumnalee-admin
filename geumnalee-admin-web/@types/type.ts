type TapasType = {
	id: number;
	type: 'main' | 'side';
	name: string;
	price: number;
	image: string;
	description: string;
};

type TapasMainType = TapasType & {
	type: 'main';
};

type TapasSideType = TapasType & {
	type: 'side';
};
